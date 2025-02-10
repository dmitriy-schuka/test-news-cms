-- CreateEnum
CREATE TYPE "InjectionType" AS ENUM ('IMAGE', 'TEXT', 'NEWS');

-- CreateEnum
CREATE TYPE "DisplayOn" AS ENUM ('LIST', 'SEARCH', 'BOTH');

-- CreateTable
CREATE TABLE "Injection" (
    "id" SERIAL NOT NULL,
    "injectionType" "InjectionType" NOT NULL,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "text" TEXT,
    "newsId" INTEGER,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "priority" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "displayOn" "DisplayOn" NOT NULL,
    "regex" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Injection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Injection" ADD CONSTRAINT "Injection_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE SET NULL ON UPDATE CASCADE;
