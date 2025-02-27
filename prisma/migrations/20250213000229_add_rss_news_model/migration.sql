-- CreateTable
CREATE TABLE "RssNews" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "mediaUrl" TEXT,
    "rssLink" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "rssSourceId" INTEGER,
    "publicatedDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RssNews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RssNews" ADD CONSTRAINT "RssNews_rssSourceId_fkey" FOREIGN KEY ("rssSourceId") REFERENCES "RssSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
