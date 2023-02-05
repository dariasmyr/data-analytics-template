-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "broadcaster_name" TEXT NOT NULL,
    "broadcaster_language" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "gameId" TEXT,
    CONSTRAINT "Channel_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rating" REAL,
    "slug" TEXT
);

-- CreateTable
CREATE TABLE "Tag" (
    "value" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Genre" (
    "value" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "_ChannelToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ChannelToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ChannelToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("value") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GameToGenre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GameToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GameToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre" ("value") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToTag_AB_unique" ON "_ChannelToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToTag_B_index" ON "_ChannelToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GameToGenre_AB_unique" ON "_GameToGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToGenre_B_index" ON "_GameToGenre"("B");
