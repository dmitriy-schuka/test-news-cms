import { prisma } from "~/db/prisma.server";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { Tag, TagCreate, TagUpdate } from "~/@types/tag";

export const getTags = async (options?: {
  sortColumn?: string;
  page?: number;
  sortOrder?: Prisma.SortOrder;
}): Promise<Tag | null> => {
  try {
    const page = options?.page ?? 1;
    const sortDirection = options?.sortOrder ?? "desc";
    const sortColumn = options?.sortColumn ?? "id";
    const take = 10;
    const skip = page > 1 ? take * (page - 1) : 0;

    const count = await prisma.tag.count();
    const tags = await prisma.tag.findMany({
      take,
      skip,
      orderBy: {
        [sortColumn]: sortDirection,
      },
    });

    return {
      tags,
      count,
      page,
      sortColumn,
      sortDirection,
      hasNextPage: count - skip > take,
      hasPreviousPage: page > 1,
    };
  } catch (err) {
    throw new Error(`Error fetching tags: ${err}`);
  }
};

export const getTagById = async (id: string): Promise<Tag | null> => {
  try {
    return prisma.tag.findUnique({
      where: { id },
    });
  } catch (err) {
    throw new Error(`Error fetching single tag: ${err}`);
  }
};

export const getTagByName = async (name: string): Promise<Tag | null> => {
  try {
    return prisma.tag.findUnique({
      where: { name },
    });
  } catch (err) {
    throw new Error(`Error fetching single tag by name: ${err}`);
  }
};

export const createTag = async (data: TagCreate): Promise<Tag> => {
  try {
    return prisma.tag.create({
      data,
    });
  } catch (err) {
    throw new Error(`Error creating tag: ${err}`);
  }
};

export const updateTag = async (id: string, data: TagUpdate): Promise<Tag> => {
  try {
    return prisma.tag.update({
      where: { id },
      data,
    });
  } catch (err) {
    throw new Error(`Error updating tag: ${err}`);
  }
};

export const deleteTag = async (id: string): Promise<Tag> => {
  try {
    return prisma.tag.delete({
      where: { id },
    });
  } catch (err) {
    throw new Error(`Error deleting tag: ${err}`);
  }
};

export const findOrCreateTag = async (
  uniqueField: Partial<Tag>,
  createData: TagCreate
): Promise<Tag> => {
  return prisma.tag.upsert({
    where: uniqueField,
    update: {},                     // Set empty object as there is no need to update.
    create: createData,
  });
};
