import type { User, UserCreate, UserUpdate } from '~/@types/user';
import { prisma } from '~/db/prisma.server';

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        return prisma.user.findUnique({
            where: { id },
        });
    } catch (err) {
        throw new Error(`Error fetching user: ${err}`);
    }
};

export const createUser = async (data: UserCreate): Promise<User> => {
    try {
        return prisma.user.create({
            data,
        });
    } catch (err) {
        throw new Error(`Error creating user: ${err}`);
    }
};

export const updateUser = async (
    id: string,
    data: UserUpdate
): Promise<User> => {
    try {
        return prisma.user.update({
            where: { id },
            data,
        });
    } catch (err) {
        throw new Error(`Error updating user: ${e}`);
    }
};

export const deleteUser = async (id: string): Promise<User> => {
    try {
        return prisma.user.delete({
            where: { id },
        });
    } catch (err) {
        throw new Error(`Error deleting user: ${err}`);
    }
};

export const findOrCreateUser = async (
    uniqueField: Partial<User>,
    createData: UserCreate
): Promise<User> => {
    try {
        return prisma.user.upsert({
            where: uniqueField,
            update: {}, // Set empty object as there is no need to update.
            create: createData,
        });
    } catch (err) {
        throw new Error(`Error finding user: ${err}`);
    }
};
