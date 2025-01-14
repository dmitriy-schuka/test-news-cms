import { prisma } from "~/db/prisma.server";
import type { User, UserCreate, UserUpdate } from "~/@types/user";

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (data: UserCreate): Promise<User> => {
  return prisma.user.create({
    data,
  });
};

export const updateUser = async (id: string, data: UserUpdate): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};

export const findOrCreateUser = async (
  uniqueField: Partial<User>,
  createData: UserCreate
): Promise<User> => {
  return prisma.user.upsert({
    where: uniqueField,
    update: {},                     // Set empty object as there is no need to update.
    create: createData,
  });
};
