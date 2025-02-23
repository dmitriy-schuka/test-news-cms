import type { Prisma } from '@prisma/client';

import type {
    News,
    PaginatedNews,
    NewsCreate,
    NewsUpdate,
} from '~/@types/news';
import { prisma } from '~/db/prisma.server';
import { getSettings } from '~/repositories/settingsRepository.server';
import { deleteFile } from '~/services/minio.server';

export const getNews = async (
    _,
    options?: {
        sortColumn?: string;
        page?: number;
        sortOrder?: Prisma.SortOrder;
    },
    userId?: number[]
): Promise<PaginatedNews | null> => {
    try {
        const page = options?.page ?? 1;
        const sortDirection = options?.sortOrder ?? 'desc';
        const sortColumn = options?.sortColumn ?? 'id';
        const take = 10;
        const skip = page > 1 ? take * (page - 1) : 0;

        const totalNews = await prisma.news.count();

        const news = await prisma.news.findMany({
            take,
            skip,
            orderBy: {
                [sortColumn]: sortDirection,
            },
            include: {
                tags: true,
                media: true,
            },
        });

        return {
            news,
            totalNews,
            page,
            sortColumn,
            sortDirection,
            hasNextPage: totalNews - skip > take,
            hasPreviousPage: page > 1,
        };
    } catch (err) {
        throw new Error(`Error fetching news: ${err}`);
    }
};

export const getMainPageNews = async (
    newsTags?: number[],
    options?: {
        sortColumn?: string;
        page?: number;
        sortOrder?: Prisma.SortOrder;
        searchColumn?: string;
        searchValue?: string;
        regexFilter?: string;
        searchedPage?: string;
    }
): Promise<PaginatedNews | null> => {
    try {
        const page = options?.page ?? 1;
        const sortDirection = options?.sortOrder ?? 'desc';
        const sortColumn = options?.sortColumn ?? 'id';
        const searchedPage = options?.searchedPage ?? 'LIST';
        const take = 8;
        const skip = page > 1 ? take * (page - 1) : 0;

        const latestNews = await prisma.news.findFirst({
            where: {
                published: true,
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                tags: true,
                media: true,
            },
        });

        let searchFilter;

        if (options?.searchColumn && options?.searchValue) {
            searchFilter = {
                [options.searchColumn]: {
                    contains: options.searchValue,
                    mode: 'insensitive', // Case insensitive search
                },
            };
        }

        let regexFilter;
        if (options?.regexFilter) {
            regexFilter = {
                title: { matches: options.regexFilter },
            };
        }

        let baseWhere = {
            published: true,
            id: {
                not: latestNews?.id,
            },
            ...searchFilter,
            ...regexFilter,
        };

        if (newsTags && Array.isArray(newsTags) && newsTags.length > 0) {
            baseWhere = {
                ...baseWhere,
                tags: {
                    some: { id: { in: newsTags } },
                },
            };
        }

        const totalNews = await prisma.news.count({ where: baseWhere });

        const news = await prisma.news.findMany({
            where: baseWhere,
            take,
            skip,
            orderBy: { [sortColumn]: sortDirection },
            include: { tags: true, media: true },
        });

        let injectionsPerPage;
        const settingsData = await getSettings();

        if (searchedPage === 'SEARCH') {
            injectionsPerPage = settingsData.searchInjections
                ? Number(settingsData.searchInjections)
                : 3;
        } else {
            injectionsPerPage = settingsData.listInjections
                ? Number(settingsData.listInjections)
                : 4;
        }

        const injections = await prisma.injection.findMany({
            where: {
                isDraft: false,
                OR: [
                    {
                        displayOn: searchedPage,
                    },
                    {
                        displayOn: 'BOTH',
                    },
                ],
            },
            orderBy: { priority: 'desc' },
            take: injectionsPerPage,
            skip: page > 1 ? injectionsPerPage * (page - 1) : 0,
            include: {
                news: {
                    include: {
                        tags: true,
                        media: true,
                    },
                },
            },
        });

        const mixedContent = [];
        const interval = Math.max(
            Math.floor(news.length / (injectionsPerPage || 1)),
            1
        );

        let newsIndex = 0;
        let injectionIndex = 0;

        for (let i = 0; i < news.length + injectionsPerPage; i++) {
            if (
                i % (interval + 1) === 1 &&
                injectionIndex < injectionsPerPage &&
                injectionIndex < injections.length
            ) {
                mixedContent.push(injections[injectionIndex]);
                injectionIndex++;
            } else if (newsIndex < news.length) {
                mixedContent.push(news[newsIndex]);
                newsIndex++;
            }
        }

        return {
            news: mixedContent,
            latestNews,
            totalNews,
            page,
            sortColumn,
            sortDirection,
            hasNextPage: totalNews - skip > take,
            hasPreviousPage: page > 1,
        };
    } catch (err) {
        throw new Error(`Error fetching all news: ${err}`);
    }
};

export const getNewsById = async (id: string): Promise<News | null> => {
    try {
        const newsData = await prisma.news.findUnique({
            where: { id },
            include: {
                tags: true,
                media: true,
            },
        });

        newsData.tagsData = newsData?.tags;
        newsData.tags = newsData?.tags?.map(({ id }) => id);

        return newsData;
    } catch (err) {
        throw new Error(`Error fetching single news: ${err}`);
    }
};

export const createNews = async (
    data: NewsCreate,
    newsTags: string[],
    media
): Promise<News> => {
    try {
        const newData = await prisma.news.create({
            data: {
                ...data,
                tags: {
                    connect: newsTags?.map((tagId) => ({ id: Number(tagId) })),
                },
            },
            include: {
                tags: true,
            },
        });

        let mediaData;

        if (media?.url) {
            mediaData = await prisma.media.create({
                data: {
                    ...media,
                    newsId: newData?.id,
                },
            });
        }

        return { ...newData, media: mediaData };
    } catch (err) {
        throw new Error(`Error creating news: ${err}`);
    }
};

export const updateNews = async (
    id: string,
    data: NewsUpdate,
    newsTags: string[],
    newMedia,
    oldMediaId: number
): Promise<News> => {
    try {
        if (newMedia?.url) {
            if (oldMediaId) {
                await prisma.media.update({
                    where: {
                        id: oldMediaId,
                    },
                    data: {
                        ...newMedia,
                    },
                });
            } else {
                await prisma.media.create({
                    data: {
                        ...newMedia,
                        newsId: id,
                    },
                });
            }
        }

        return prisma.news.update({
            where: { id },
            data: {
                ...data,
                tags: {
                    set: [], // Delete existing references
                    connect: newsTags?.map((tagId) => ({ id: Number(tagId) })), // Add new references
                },
            },
            include: {
                tags: true,
                media: true,
            },
        });
    } catch (err) {
        throw new Error(`Error updating news: ${err}`);
    }
};

export const deleteNews = async (
    id: string,
    newsTags: string[],
    oldMediaData
): Promise<News> => {
    try {
        await prisma.news.update({
            where: { id },
            data: {
                tags: {
                    disconnect: newsTags?.map((tagId) => ({
                        id: Number(tagId),
                    })),
                },
            },
        });

        if (oldMediaData?.mediaName && oldMediaData?.mediaId) {
            await deleteFile(oldMediaData.mediaName);

            await prisma.media.delete({
                where: { id: oldMediaData.mediaId },
            });
        }

        return prisma.news.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        // return prisma.news.delete({
        //   where: { id },
        // });
    } catch (err) {
        throw new Error(`Error deleting news: ${err}`);
    }
};

export const restoreNews = async (newsId: number): Promise<News> => {
    try {
        return prisma.news.update({
            where: { id: newsId },
            data: {
                deletedAt: null,
                published: false,
            },
        });
    } catch (err) {
        throw new Error(`Error restoring news: ${err}`);
    }
};
