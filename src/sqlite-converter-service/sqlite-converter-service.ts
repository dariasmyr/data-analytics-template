import { PrismaClient } from '@prisma/client';

import { Logger } from '../logger/logger';

export class SqliteConverterService {
  public prisma: PrismaClient;
  private readonly logger: Logger;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = new Logger('SqliteConverterService');
  }

  async deleteAll() {
    this.logger.debug('Deleting all data from the database');
    await this.prisma.genre.deleteMany();
    await this.prisma.game.deleteMany();
    await this.prisma.tag.deleteMany();
    await this.prisma.channel.deleteMany();
    // Check if the database is empty
    const genres = await this.prisma.genre.findMany();
    const games = await this.prisma.game.findMany();
    const tags = await this.prisma.tag.findMany();
    const channels = await this.prisma.channel.findMany();
    if (
      genres.length === 0 &&
      games.length === 0 &&
      tags.length === 0 &&
      channels.length === 0
    ) {
      this.logger.debug('The database is empty');
      return true;
    } else {
      this.logger.error('The database is not empty');
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,sonarjs/cognitive-complexity,complexity
  async convertToSqlite(channelsJson: any) {
    const result = await this.deleteAll();
    if (result) {
      this.logger.debug('The database is empty');
      this.logger.debug('Size:', channelsJson.length);
      this.logger.debug('Connecting to the database');
      await this.prisma.$connect();
      for (const channel of channelsJson) {
        if (!channel.data?.broadcaster_id) {
          continue;
        }
        const currentChannelId = channel.data.broadcaster_id;
        const index = channelsJson.indexOf(channel);
        this.logger.debug(
          `Current channel ID: ${currentChannelId}. Number ${index} of ${channelsJson.length}.`,
        );
        const channelDatabase = await this.prisma.channel.create({
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
          await this.prisma.tag.upsert({
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
          const gameDatabase = await this.prisma.game.upsert({
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
              await this.prisma.genre.upsert({
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
      return true;
    } else {
      this.logger.error('The database is not empty');
      return false;
    }
  }
}
