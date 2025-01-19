import type { Prisma, Tag as PrismaTag } from "@prisma/client";

export type Tag = PrismaTag;
export type TagCreate = Prisma.TagCreateInput;
export type TagUpdate = Prisma.TagUpdateInput;