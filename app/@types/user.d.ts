import type { Prisma, User as PrismaUser } from "@prisma/client";

export type User = PrismaUser;
export type UserCreate = Prisma.UserCreateInput;
export type UserUpdate = Prisma.UserUpdateInput;