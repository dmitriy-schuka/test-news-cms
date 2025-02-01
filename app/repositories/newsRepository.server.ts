import { prisma } from "~/db/prisma.server";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { News, PaginatedNews, NewsCreate, NewsUpdate } from "~/@types/news";
import type { Tag } from "~/@types/tag";
import { deleteFile } from "~/services/minio.server";

export const getNews = async (_,
  options?: {
    sortColumn?: string;
    page?: number;
    sortOrder?: Prisma.SortOrder;
  },
  userId?: number[],
): Promise<PaginatedNews | null> => {
  try {
    const page = options?.page ?? 1;
    const sortDirection = options?.sortOrder ?? "desc";
    const sortColumn = options?.sortColumn ?? "id";
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
  },
): Promise<PaginatedNews | null> => {
  try {
    const page = options?.page ?? 1;
    const sortDirection = options?.sortOrder ?? "desc";
    const sortColumn = options?.sortColumn ?? "id";
    const take = 8;
    const skip = page > 1 ? take * (page - 1) : 0;

    const latestNews = await prisma.news.findFirst({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tags: true,
        media: true,
      },
    });

    let totalNews;
    let news;

    if (newsTags && Array.isArray(newsTags) && newsTags.length > 0) {
      const query = {
        where: {
          published: true,
          tags: {
            some: {
              id: {
                in: newsTags,
              },
            },
          },
        },
      };

      totalNews = await prisma.news.count(query);

      news = await prisma.news.findMany({
        where: query.where,
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
    } else {
      totalNews = await prisma.news.count();

      news = await prisma.news.findMany({
        where: {
          published: true,
          id: {
            not: latestNews?.id,
          },
        },
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
    }

    return {
      news,
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

    newsData.tags = newsData?.tags?.map(({id}) => id);

    return newsData;
  } catch (err) {
    throw new Error(`Error fetching single news: ${err}`);
  }
};

export const createNews = async (data: NewsCreate, newsTags: string[], media): Promise<News> => {
  try {
    const newData = await prisma.news.create({
      data: {
        ...data,
        tags: {
          connect: newsTags?.map((tagId) => ({ id: Number(tagId) }))
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

export const updateNews = async (id: string, data: NewsUpdate, newsTags: string[], newMedia, oldMediaId: number): Promise<News> => {
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

export const deleteNews = async (id: string, newsTags: string[], oldMediaData): Promise<News> => {
  try {
    await prisma.news.update({
      where: { id },
      data: {
        tags: {
          disconnect: newsTags?.map((tagId) => ({ id: Number(tagId) })),
        },
      },
    });

    if (oldMediaData?.mediaName && oldMediaData?.mediaId) {
      await deleteFile(oldMediaData.mediaName);

      await prisma.media.delete({
        where: { id: oldMediaData.mediaId },
      });
    }

    return prisma.news.delete({
      where: { id },
    });
  } catch (err) {
    throw new Error(`Error deleting news: ${err}`);
  }
};
