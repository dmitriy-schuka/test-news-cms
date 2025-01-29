import type { Prisma, News as PrismaNews } from "@prisma/client";

export type PaginatedNews = {
  news: PrismaNews[];
  count: number;
  page: number;
  sortColumn: string;
  sortDirection: Prisma.SortOrder;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type News = PrismaNews;
export type NewsCreate = Prisma.NewsCreateInput;
export type NewsUpdate = Prisma.NewsUpdateInput;