import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto.';

@Injectable()
export class SuppliersService {
    constructor(private prisma: PrismaService) {}

    create(data: CreateSupplierDto) {
        return this.prisma.supplier.create({ data });
    }

    findAll() {
        return this.prisma.supplier.findMany({
        include: { products: true },
        });
    }

    async findOne(id: number) {
        const supplier = await this.prisma.supplier.findUnique({
        where: { id },
        include: { products: true },
        });

        if (!supplier) throw new NotFoundException('Proveedor no encontrado');

        return supplier;
    }

    async update(id: number, data: UpdateSupplierDto) {
        return this.prisma.supplier.update({
        where: { id },
        data,
        });
    }

    async remove(id: number) {
        return this.prisma.supplier.delete({
        where: { id },
        });
    }
}