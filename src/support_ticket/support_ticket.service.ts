import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';

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

    async findAll() {
        return this.prisma.supportTicket.findMany({
        include: {
            user: true,
            order: true,
        },
        });
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