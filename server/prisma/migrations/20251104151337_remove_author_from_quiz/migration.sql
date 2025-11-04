/*
  Warnings:

  - You are about to drop the column `authorId` on the `quizzes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `quizzes` DROP FOREIGN KEY `quizzes_authorId_fkey`;

-- DropIndex
DROP INDEX `quizzes_authorId_fkey` ON `quizzes`;

-- AlterTable
ALTER TABLE `quizzes` DROP COLUMN `authorId`;
