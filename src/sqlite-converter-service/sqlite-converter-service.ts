import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TODO Implement a separate module with connection to the database like NeDB. Configure logging. Configure the database connection route.

export class SqliteConverterService {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async deleteAll() {
    await prisma.genre.deleteMany();
    await prisma.game.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.channel.deleteMany();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async convertToSqlite(channelsJson: any) {
    await this.deleteAll();
    console.log('Size:', channelsJson.length);
    await prisma.$connect();
    for (const channel of channelsJson) {
      if (!channel.data?.broadcaster_id) {
        continue;
      }
      const currentChannelId = channel.data.broadcaster_id;
      const index = channelsJson.indexOf(channel);
      console.log(
        `Current channel ID: ${currentChannelId}. Number ${index} of ${channelsJson.length}`,
      );
      const channelDatabase = await prisma.channel.create({
        data: {
          id: channel.data.broadcaster_id,
          // eslint-disable-next-line camelcase
          broadcaster_name: channel.data.broadcaster_name,
          // eslint-disable-next-line camelcase
          broadcaster_language: channel.data.broadcaster_language,
          followers: channel.followers,
        },
      });
      for (const tag of channel.data.tags) {
        await prisma.tag.upsert({
          where: {
            value: tag,
          },
          create: {
            channels: { connect: { id: channelDatabase.id } },
            value: tag,
          },
          update: {
            channels: { connect: { id: channelDatabase.id } },
          },
        });
      }
      if (channel.data?.game_data?.id) {
        const gameDatabase = await prisma.game.upsert({
          where: {
            id: channel.data?.game_data?.id,
          },
          create: {
            id: channel.data?.game_data?.id,
            name: channel.data?.game_data?.name,
            slug: channel.data?.game_data?.igdb_data?.slug,
            rating: channel.data?.game_data?.igdb_data?.rating,
            channels: { connect: { id: channel.id.toString() } },
          },
          update: {
            channels: { connect: { id: channel.id.toString() } },
          },
        });
        if (channel.data?.game_data?.igdb_data?.genres)
          for (const genre of channel.data?.game_data?.igdb_data?.genres) {
            await prisma.genre.upsert({
              where: {
                value: genre,
              },
              create: {
                game: { connect: { id: gameDatabase.id } },
                value: genre,
              },
              update: {
                game: { connect: { id: gameDatabase.id } },
              },
            });
          }
      }
    }
    console.log('!!!!!!!!!!!!!!!Done!!!!!!!!!!!!!!!');
  }
}
