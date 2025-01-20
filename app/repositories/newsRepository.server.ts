import { prisma } from "~/db/prisma.server";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { News, PaginatedNews, NewsCreate, NewsUpdate } from "~/@types/news";
import type { Tag } from "~/@types/tag";

export const getNews = async (
  newsTags?: number[],
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

    let totalNews;
    let news;

    if (newsTags && Array.isArray(newsTags) && newsTags.length > 0) {
      const query = {
        where: {
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

export const getNewsById = async (id: string): Promise<News | null> => {
  try {
    return prisma.news.findUnique({
      where: { id },
      include: {
        tags: true,
        media: true,
      },
    });
  } catch (err) {
    throw new Error(`Error fetching single news: ${err}`);
  }
};

export const createNews = async (data: NewsCreate, newsTags: string[]): Promise<News> => {
  try {
    return prisma.news.create({
      data: {
        ...data,
        tags: {
          connect: newsTags.map((tagId) => ({ id: Number(tagId) }))
        },
      },
      include: {
        tags: true,
      },
    });
  } catch (err) {
    throw new Error(`Error creating news: ${err}`);
  }
};

export const updateNews = async (id: string, data: NewsUpdate, newsTags: string[]): Promise<News> => {
  try {
    return prisma.news.update({
      where: { id },
      data: {
        ...data,
        tags: {
          set: [], // Delete existing references
          connect: newsTags.map((tagId) => ({ id: Number(tagId) })), // Add new references
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

  // const news = await prisma.news.findUnique({ where: { id } });
  // if (!news) {
  //   throw new Error("News not found");
  // }
  //
  // return prisma.news.update({
  //   where: { id },
  //   data,
  // });
};

export const deleteNews = async (id: string, newsTags: string[]): Promise<News> => {
  try {
    await prisma.news.update({
      where: { id },
      data: {
        tags: {
          disconnect: newsTags.map((tagId) => ({ id: Number(tagId) })),
        },
      },
    });

    return prisma.news.delete({
      where: { id },
    });
  } catch (err) {
    throw new Error(`Error deleting news: ${err}`);
  }
};
