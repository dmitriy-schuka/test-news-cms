import type { RssNews, RssNewsCreate, RssNewsUpdate } from '~/@types/rssNews';
import { prisma } from '~/db/prisma.server';
import { updateRssSource } from '~/repositories/rssSourceRepository.server';
import { extractMediaUrl } from '~/utils/extractMediaUrl';

export const getAllRssNews = async () => {
    try {
        return await prisma.rssNews.findMany({
            take: 2,
        });
    } catch (err) {
        throw new Error(`Error fetching all rss news: ${err}`);
    }
};

export const deleteRssNewsBySourceId = async (rssSourceId: number) => {
    try {
        await prisma.rssNews.deleteMany({
            where: {
                rssSourceId,
            },
        });

        await updateRssSource(rssSourceId, { fetchedAt: new Date() });
    } catch (err) {
        throw new Error(`Error deleting rss news: ${err}`);
    }
};

export const storeImportedRssNews = async (
    data: RssNewsUpdate,
    rssSourceId: number
) => {
    try {
        if (data?.mediaUrl) {
            data.mediaUrl = extractMediaUrl(data.mediaUrl);
        }

        await prisma.rssNews.create({
            data: {
                ...data,
                rssSourceId,
            },
        });
    } catch (err) {
        throw new Error(`Error in store rss news: ${err}`);
    }
};
