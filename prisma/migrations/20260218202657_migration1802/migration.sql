/*
  Warnings:

  - You are about to drop the column `businessId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Business` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `localId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_businessId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `businessId`,
    ADD COLUMN `localId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Business`;

-- CreateTable
CREATE TABLE `Local` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proveedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `localId` INTEGER NOT NULL,

    UNIQUE INDEX `Proveedores_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `precio_compra` DOUBLE NOT NULL,
    `precio_venta` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL,
    `proveedorId` INTEGER NOT NULL,
    `localId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `localId` INTEGER NOT NULL,

    UNIQUE INDEX `Clientes_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ventas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `precio_venta` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clienteId` INTEGER NOT NULL,
    `inventarioId` INTEGER NOT NULL,
    `localId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `Local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proveedores` ADD CONSTRAINT `Proveedores_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `Local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventario` ADD CONSTRAINT `Inventario_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventario` ADD CONSTRAINT `Inventario_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `Local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `Local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ventas` ADD CONSTRAINT `Ventas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ventas` ADD CONSTRAINT `Ventas_inventarioId_fkey` FOREIGN KEY (`inventarioId`) REFERENCES `Inventario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ventas` ADD CONSTRAINT `Ventas_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `Local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
