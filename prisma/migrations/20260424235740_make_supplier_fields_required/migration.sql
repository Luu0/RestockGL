/*
  Warnings:

  - Made the column `email` on table `Supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Supplier` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
