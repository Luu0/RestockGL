import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

async create(data: CreateOrderDto) {
  return this.prisma.$transaction(async (tx) => {

    const user = await tx.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

  const itemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Producto ${item.productId} no existe`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para ${product.name}`);
      }

      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: product.stock - item.quantity,
        },
      });

      itemsData.push({
        product: {
          connect: { id: product.id },
        },
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await tx.order.create({
      data: {
        userId: data.userId,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  });
}

  findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
      user: true,
    },
    });

    if (!order) {
    throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }


  async cancel(id: number) {
  return this.prisma.$transaction(async (tx) => {

    const order = await tx.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    await tx.orderItem.deleteMany({
      where: { orderId: id },
    });

    return tx.order.delete({
      where: { id },
    });
  });
}
}