import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Prisma } from '@prisma/client';

import { buildMeta } from 'src/common/utils/meta';
import { getPagination } from 'src/common/utils/pagination';
import { buildSort } from 'src/common/utils/sort';
import { OrdersQueryDto } from './dto/orders-query.dto';

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

  async findAll(query: OrdersQueryDto) {

    const pagination = getPagination(
      query.page,
      query.limit,
    );

    const orderBy = buildSort(
      'createdAt',
      query.sort,
    );

    const where = query.status
      ? {
          status: query.status,
        }
      : {};

    const orders = await this.prisma.order.findMany({
      ...pagination,
      where,
      orderBy,

      include: {
        items: {
          include: {
            product: true,
          },
        },

        user: true,
      },
    });

    const total = await this.prisma.order.count({
      where,
    });

    return {
      data: orders,

      meta: buildMeta(
        total,
        query.page,
        query.limit,
      ),
    };
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

      if (order.status === 'CANCELADO') {
        throw new BadRequestException('La orden ya está cancelada');
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

      return tx.order.update({
        where: { id },
        data: {
          status: 'CANCELADO',
        },
        include: {
          items: true,
        },
      });
    });
  }

  async updateStatus(id: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}