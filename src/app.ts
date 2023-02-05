import channelsJson from '../data/twitch-channels-template.json';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteAll() {
    await prisma.genre.deleteMany();
    await prisma.game.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.channel.deleteMany();
}

async function main() {
    await deleteAll();
    console.log('Size:', channelsJson.length);
    await prisma.$connect();
    let currentChannelId: string | null = null;
    setInterval(() => {
        console.log('Current channel ID:', currentChannelId);
    }, 1000);
    for (const channel of channelsJson) {
        if (!channel.data?.broadcaster_id) {
            continue;
        }
        currentChannelId = channel.data.broadcaster_id;
        const channelDb = await prisma.channel.create({
            data: {
                id: channel.data.broadcaster_id,
                broadcaster_name: channel.data.broadcaster_name,
                broadcaster_language: channel.data.broadcaster_language,
                followers: channel.followers,
            }
        });
        for (let tag of channel.data.tags) {
            await prisma.tag.upsert({
                where: {
                    value: tag
                },
                create: {
                    channels: {connect: {id: channelDb.id}},
                    value: tag
                },
                update: {
                    channels: {connect: {id: channelDb.id}},
                }
            })
        }
        if (channel.data?.game_data?.id) {
            const gameDb = await prisma.game.upsert({
                where: {
                    id: channel.data?.game_data?.id,
                },
                create: {
                    id: channel.data?.game_data?.id,
                    name: channel.data?.game_data?.name,
                    slug: channel.data?.game_data?.igdb_data?.slug,
                    rating: channel.data?.game_data?.igdb_data?.rating,
                    channels: {connect: {id: channel.id.toString()}},
                },
                update: {
                    channels: {connect: {id: channel.id.toString()}},
                }
            })
            if (channel.data?.game_data?.igdb_data?.genres)
                for (const genre of channel.data?.game_data?.igdb_data?.genres) {
                    await prisma.genre.upsert({
                        where: {
                            value: genre
                        },
                        create: {
                            game: {connect: {id: gameDb.id}},
                            value: genre
                        },
                        update: {
                            game: {connect: {id: gameDb.id}}
                        }
                    })
                }
        }
    }
    console.log('!!!!!!!!!!!!!!!Done!!!!!!!!!!!!!!!');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
