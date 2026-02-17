/*
  Warnings:

  - A unique constraint covering the columns `[masterId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_masterId_key` ON `User`(`masterId`);
