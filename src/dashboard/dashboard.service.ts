import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getStats() {
        const [
        users,
        products,
        suppliers,

        orders,
        pendingOrders,
        completedOrders,
        cancelledOrders,

        supportTickets,

        lowStockProducts,

        revenue,
        ] = await Promise.all([

        this.prisma.user.count(),

        this.prisma.product.count(),

        this.prisma.supplier.count(),

        this.prisma.order.count(),

        this.prisma.order.count({
            where: {
            status: 'PENDIENTE',
            },
        }),

        this.prisma.order.count({
            where: {
            status: "COMPLETADO",
            },
        }),

        this.prisma.order.count({
            where: {
            status: 'CANCELADO',
            },
        }),

        this.prisma.supportTicket.count(),

        this.prisma.product.count({
            where: {
            stock: {
                lte: 5,
            },
            },
        }),

        this.prisma.order.aggregate({
            _sum: {
            total: true,
            },
            where: {
            status: "COMPLETADO",
            },
        }),
        ]);

        return {
        users,
        products,
        suppliers,

        orders,
        pendingOrders,
        completedOrders,
        cancelledOrders,

        supportTickets,

        lowStockProducts,

        totalRevenue: revenue._sum.total ?? 0,
        };
    }

    async getRecentOrders() {
        return this.prisma.order.findMany({
        take: 5,
        orderBy: {
            date: 'desc',
        },

        include: {
            user: {
                select: {
                id: true,
                email: true,
                },
            },

            items: {
                include: {
                product: true,
                },
            },
        },
        });
    }

    async getLowStockProducts() {
        return this.prisma.product.findMany({
        where: {
        stock: {
            lte: 5,
        },
        },

        orderBy: {
        stock: 'asc',
        },

        select: {
        id: true,
        name: true,
        stock: true,

        supplier: {
            select: {
            id: true,
            name: true,
            },
        },
        },
    });
    }

    async getTopProducts() {
    const grouped = await this.prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: {
        quantity: true,
    },
    orderBy: {
        _sum: {
        quantity: 'desc',
        },
    },
    take: 5,
    });

    const products = await this.prisma.product.findMany({
    where: {
        id: {
        in: grouped.map(g => g.productId),
        },
    },
    select: {
        id: true,
        name: true,
    },
    });

    return grouped.map(g => ({
        productId: g.productId,
        name: products.find(p => p.id === g.productId)?.name,
        totalSold: g._sum.quantity ?? 0,
    }));
    }

    async getMonthlySales() {
    const orders = await this.prisma.order.findMany({
        where: {
        status: 'COMPLETADO',
        },
        select: {
        date: true,
        total: true,
        },
        orderBy: {
        date: 'asc',
        },
    });

    const monthlySales = new Map<
        string,
        {
        month: string;
        orders: number;
        revenue: number;
        }
    >();

    for (const order of orders) {
        const month = order.date.toISOString().slice(0, 7);

        if (!monthlySales.has(month)) {
        monthlySales.set(month, {
            month,
            orders: 0,
            revenue: 0,
        });
        }

        const current = monthlySales.get(month)!;

        current.orders += 1;
        current.revenue += order.total;
    }

    return Array.from(monthlySales.values());
    }
}