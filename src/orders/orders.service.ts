import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderDto, user: any) {
    const userId = user.sub;

    return this.prisma.$transaction(async (tx) => {

      let total = 0; 

      const itemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error('Producto no existe');
        }

        if (product.stock < item.quantity) {
          throw new Error('Stock insuficiente');
        }

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });

        total += product.price * item.quantity;

        itemsData.push({
          product: {
            connect: { id: product.id },
          },
          quantity: item.quantity,
          price: product.price,
        });
      }

      return tx.order.create({
        data: {
          userId,
          total, 
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });
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