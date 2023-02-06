import { PrismaClient } from '@prisma/client';

// TODO Implement a separate module with connection to the database like NeDB. Configure logging. Configure the database connection route.
import channelsJson from '../data/twitch-channels-template.json';

const prisma = new PrismaClient();

async function deleteAll() {
  await prisma.genre.deleteMany();
  await prisma.game.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.channel.deleteMany();
}

async function convertToJs() {
  await deleteAll();
  console.log('Size:', channelsJson.length);
  await prisma.$connect();
  let currentChannelId: string | null;
  setInterval(() => {
    console.log('Current channel ID:', currentChannelId);
    // eslint-disable-next-line no-magic-numbers
  }, 1000);
  for (const channel of channelsJson) {
    if (!channel.data?.broadcaster_id) {
      continue;
    }
    currentChannelId = channel.data.broadcaster_id;
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

async function main() {
  try {
    await convertToJs();
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    console.error('!!!!!!!!!!!!!!!Error!!!!!!!!!!!!!!!');
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => {
  throw error;
});
