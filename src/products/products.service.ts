import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateProductDto) {
        const supplier = await this.prisma.supplier.findUnique({
        where: { id: data.supplierId },
        });

        if (!supplier) {
        throw new NotFoundException('Proveedor no encontrado');
        }

        return this.prisma.product.create({
        data,
        include: { supplier: true },
        });
    }

    findAll() {
        return this.prisma.product.findMany({
        include: { supplier: true },
        });
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
        where: { id },
        include: { supplier: true },
        });

        if (!product) {
        throw new NotFoundException('Producto no encontrado');
        }

        return product;
    }

    async update(id: number, data: UpdateProductDto) {
    try {
        return this.prisma.product.update({
            where: { id },
            data,
            include: { supplier: true },
        });
    }catch (error) {
        throw new NotFoundException('Producto no encontrado');
    }
    }

    async remove(id: number) {
        return this.prisma.product.delete({
        where: { id },
        });
    }
}

// async update(id: number, updateProductDto: UpdateProductDto) {
//   try {
//     return await this.prisma.product.update({
//       where: { id },
//       data: updateProductDto
//     });
//   } catch (error) {
//     throw new NotFoundException('Product not found');
//   }