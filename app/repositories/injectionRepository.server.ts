import type { Prisma, PrismaClient } from '@prisma/client';

import type {
    Injection,
    InjectionCreate,
    InjectionUpdate,
} from '~/@types/injection';
import { prisma } from '~/db/prisma.server';

export const createInjection = async (
    data: InjectionCreate
): Promise<Injection> => {
    try {
        return prisma.injection.create({
            data,
        });
    } catch (err) {
        throw new Error(`Error creating injection: ${err}`);
    }
};

export const getInjectionById = async (
    id: number
): Promise<Injection | null> => {
    try {
        return prisma.injection.findUnique({
            where: { id },
        });
    } catch (err) {
        throw new Error(`Error fetching single injection: ${err}`);
    }
};

export const updateInjection = async (
    id: number,
    data: InjectionUpdate
): Promise<Injection> => {
    try {
        return prisma.injection.update({
            where: { id },
            data,
        });
    } catch (err) {
        throw new Error(`Error updating injection: ${err}`);
    }
};

export const deleteInjection = async (id: number): Promise<Injection> => {
    try {
        return prisma.injection.delete({
            where: { id },
        });
    } catch (err) {
        throw new Error(`Error deleting injection: ${err}`);
    }
};

export const getInjections = async ({
    displayOn,
    isDraft,
}: {
    displayOn?: DisplayOn;
    isDraft?: boolean;
}): Promise<Injection[] | null> => {
    return prisma.injection.findMany({
        where: {
            displayOn,
            isDraft,
        },
        orderBy: { priority: 'desc' },
    });
};

export const getAllInjections = async (options?: {
    sortColumn?: string;
    page?: number;
    sortOrder?: Prisma.SortOrder;
}): Promise<Injection[] | null> => {
    try {
        const page = options?.page ?? 1;
        const sortDirection = options?.sortOrder ?? 'desc';
        const sortColumn = options?.sortColumn ?? 'id';
        const take = 10;
        const skip = page > 1 ? take * (page - 1) : 0;

        const count = await prisma.injection.count();
        const injections = await prisma.injection.findMany({
            take,
            skip,
            orderBy: {
                [sortColumn]: sortDirection,
            },
        });

        return {
            injections,
            count,
            page,
            sortColumn,
            sortDirection,
            hasNextPage: count - skip > take,
            hasPreviousPage: page > 1,
        };
    } catch (err) {
        throw new Error(`Error fetching all injections: ${err}`);
    }
};
