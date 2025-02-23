import type { Prisma } from '@prisma/client';
import type { RssNews } from '~/@types/rssNews';
import { differenceInMinutes } from 'date-fns';
import xml2js from 'xml2js';

import type {
    RssSource,
    RssSourceCreate,
    RssSourceUpdate,
} from '~/@types/rssSource';
import { prisma } from '~/db/prisma.server';
import {
    deleteRssNewsBySourceId,
    storeImportedRssNews,
} from '~/repositories/rssNewsRepository.server';

export const getRssSources = async (options?: {
    sortColumn?: string;
    page?: number;
    sortOrder?: Prisma.SortOrder;
}): Promise<RssSource[] | null> => {
    try {
        const page = options?.page ?? 1;
        const sortDirection = options?.sortOrder ?? 'desc';
        const sortColumn = options?.sortColumn ?? 'id';
        const take = 10;
        const skip = page > 1 ? take * (page - 1) : 0;

        const count = await prisma.rssSource.count();
        const rssSources = await prisma.rssSource.findMany({
            take,
            skip,
            orderBy: {
                [sortColumn]: sortDirection,
            },
        });

        return {
            rssSources,
            page,
            sortColumn,
            sortDirection,
            hasNextPage: count - skip > take,
            hasPreviousPage: page > 1,
        };
    } catch (err) {
        throw new Error(`Error fetching Rss sources: ${err}`);
    }
};

export const getActiveRssSources = async () => {
    return await prisma.rssSource.findMany({
        where: {
            isActive: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};

export const getRssSourceById = async (id: number) => {
    return await prisma.rssSource.findUnique({
        where: { id },
    });
};

export const createRssSource = async (data: RssSourceCreate) => {
    return await prisma.rssSource.create({
        data,
    });
};

export const updateRssSource = async (id: number, data: RssSourceUpdate) => {
    return await prisma.rssSource.update({
        where: { id },
        data,
    });
};

export const deleteRssSource = async (id: number) => {
    return await prisma.rssSource.delete({
        where: { id },
    });
};

export const parseRssXml = async (xml: string) => {
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser?.parseStringPromise(xml);
    const items = result?.rss?.channel?.item || [];
    return { items: Array.isArray(items) ? items : [items] };
};

export const mapFields = (item: RssNews, fieldMapping: Record<string, string>) => {
    const mappedData: Record<string, any> = {};
    for (const [newsField, rssField] of Object.entries(fieldMapping)) {
        mappedData[newsField] = item[rssField] || '';
    }
    return mappedData;
};

export const fetchAndStoreRssFeeds = async () => {
    const activeSources = await getActiveRssSources();

    if (activeSources?.length) {
        for (const source of activeSources) {
            try {
                /** Check interval */
                const difference = source.fetchedAt
                    ? differenceInMinutes(
                          new Date(),
                          new Date(source.fetchedAt)
                      )
                    : 0;

                if (
                    source.importInterval &&
                    difference >= Number(source.importInterval)
                ) {
                    console.log('FETCH RSS!');

                    /** Remove old existing rss news from db */
                    source?.id && (await deleteRssNewsBySourceId(source.id));

                    const response = await fetch(source.url);
                    if (!response.ok) continue;

                    const xml = await response.text();
                    const jsonData = await parseRssXml(xml);

                    const latestTwoRssNews =
                        jsonData?.items?.splice(0, 2) || [];

                    for (const item of latestTwoRssNews) {
                        if (
                            source.stopTags.some((tag) =>
                                item.categories?.includes(tag)
                            )
                        ) {
                            continue;
                        }

                        const mappedData = mapFields(item, source.fieldMapping);

                        /** Store new rss news in db */
                        await storeImportedRssNews(mappedData, source.id);
                    }
                }
            } catch (err) {
                throw new Error(`Error fetching RSS from ${source.url}:`, err);
            }
        }
    }
};
