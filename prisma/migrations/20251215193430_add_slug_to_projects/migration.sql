/*
  Warnings:

  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "projectUrl" TEXT NOT NULL,
    "videoUrl" TEXT,
    "gallery" TEXT,
    "tags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("createdAt", "description", "gallery", "id", "imageUrl", "projectUrl", "tags", "title", "updatedAt", "videoUrl", "slug") 
SELECT "createdAt", "description", "gallery", "id", "imageUrl", "projectUrl", "tags", "title", "updatedAt", "videoUrl", 
  lower(
    replace(
      replace(
        replace(
          replace(
            replace(
              replace(
                replace(
                  replace(
                    replace(
                      replace(trim("title"), ' ', '-'),
                      'á', 'a'
                    ), 'é', 'e'
                  ), 'í', 'i'
                ), 'ó', 'o'
              ), 'ú', 'u'
            ), 'ñ', 'n'
          ), '.', ''
        ), ',', ''
      ), ':', ''
    )
  ) as slug
FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE INDEX "Project_slug_idx" ON "Project"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
