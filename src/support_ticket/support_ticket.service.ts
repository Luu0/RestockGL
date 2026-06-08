import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';
import { SupportTicketsQueryDto } from './dto/support-tickets-query.dto';
import { getPagination } from 'src/common/utils/pagination';
import { buildSearch } from 'src/common/utils/search';
import { buildSort } from 'src/common/utils/sort';
import { buildMeta } from 'src/common/utils/meta';

@Injectable()
export class SupportTicketsService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateSupportTicketDto, user: any) {
        if (data.orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: data.orderId },
        });

        if (!order) {
            throw new NotFoundException('Orden no encontrada');
        }
        }

        return this.prisma.supportTicket.create({
        data: {
            message: data.message,
            orderId: data.orderId,
            userId: user.sub,
        },
        });
    }

    async findAll(query: SupportTicketsQueryDto) {

        const pagination = getPagination(
            query.page,
            query.limit,
        );

        const where = {
            ...buildSearch(query.search, ['message']),

            ...(query.status && {
            status: query.status,
            }),
        };

        const orderBy = buildSort(
            'createdAt',
            query.sort,
        )

        const tickets = await this.prisma.supportTicket.findMany({
        ...pagination,
        where,
        orderBy,

        include: {
            user: true,
            order: true,
        },
        });

        const total = await this.prisma.supportTicket.count({
            where,
        })

        return{
            data: tickets,
            meta: buildMeta(
            total,
            query.page,
            query.limit,
            )
        }
    }

    async findMyTickets(user: any) {
        return this.prisma.supportTicket.findMany({
        where: { userId: user.sub },
        include: {
            order: true,
        },
        });
    }

    async findOne(id: number, user: any) {
        const ticket = await this.prisma.supportTicket.findUnique({
        where: { id },
        include: {
            user: true,
            order: true,
        },
        });

        if (!ticket) {
        throw new NotFoundException('Ticket no encontrado');
        }

        if (ticket.userId !== user.sub && user.role !== 'admin') {
        throw new ForbiddenException();
        }

        return ticket;
    }

    async update(id: number, data: UpdateSupportTicketDto) {
        return this.prisma.supportTicket.update({
        where: { id },
        data
        });
    }

    async remove(id: number) {
        return this.prisma.supportTicket.delete({
        where: { id },
        });
    }
}