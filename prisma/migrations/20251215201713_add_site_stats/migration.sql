-- CreateTable
CREATE TABLE "SiteStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);
