import { prisma } from "~/db/prisma.server";
import type { Settings, SettingsCreate, SettingsUpdate } from "~/@types/settings";

export const getSettings = async (): Promise<Settings | null> => {
  try {
    return prisma.settings.findFirst();
  } catch (err) {
    throw new Error(`Error fetching settings: ${err}`);
  }
};

export const createUpdateSettings = async (
  id: string,
  data: SettingsCreate | SettingsUpdate,
): Promise<Settings | null> => {
  try {
    return prisma.settings.upsert({
      where: {
        id
      },
      update: data,
      create: data,
    });
  } catch (err) {
    throw new Error(`Error creating/updating settings: ${err}`);
  }
};
