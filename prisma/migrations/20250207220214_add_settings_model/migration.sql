-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "listInjections" INTEGER NOT NULL DEFAULT 4,
    "searchInjections" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
