/*
  Warnings:

  - You are about to alter the column `position` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `Real` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "position" SET DATA TYPE INTEGER;
