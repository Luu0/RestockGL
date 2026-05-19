import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { ProductsQueryDto } from './dto/productsquery.dto';
import { getPagination } from 'src/common/utils/pagination';
import { buildSearch } from 'src/common/utils/search';
import { buildSort } from 'src/common/utils/sort';
import { buildMeta } from 'src/common/utils/meta';


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

    async findAll(query: ProductsQueryDto) {

        const pagination = getPagination(
            query.page,
            query.limit,
        );

        const where = buildSearch(
            query.search,
            ['name'],
        );

        const orderBy = buildSort(
            'price',
            query.sort,
        );

        const products = await this.prisma.product.findMany({
            ...pagination,
            where,
            orderBy,

            include: {
            supplier: true,
            },
        });

        const total = await this.prisma.product.count({
            where,
        });

        return {
            data: products,
            meta: buildMeta(
            total,
            query.page,
            query.limit,
            ),
        };
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
