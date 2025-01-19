import type { Prisma, News as PrismaNews } from "@prisma/client";

export type News = PrismaNews;
export type NewsCreate = Prisma.NewsCreateInput;
export type NewsUpdate = Prisma.NewsUpdateInput;