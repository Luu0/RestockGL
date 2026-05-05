import {Body, Controller, Get, Post, Patch, Delete, Param, UseGuards, Req} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import { Request } from 'express';

import { SupportTicketsService } from './support_ticket.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';

import { JwtAuthGuard } from 'src/auth/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@ApiTags('SupportTickets')
@Controller('support-tickets')
export class SupportTicketsController {
    constructor(private readonly service: SupportTicketsService) {}

    @ApiOperation({ summary: 'Crear ticket' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: CreateSupportTicketDto, @Req() req: Request) {
        return this.service.create(body, req.user);
    }

    @ApiOperation({ summary: 'Mis tickets' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    findMine(@Req() req: Request) {
        return this.service.findMyTickets(req.user);
    }

    @ApiOperation({ summary: 'Todos los tickets (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @ApiOperation({ summary: 'Ver ticket por ID' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: Request) {
        return this.service.findOne(Number(id), req.user);
    }

    @ApiOperation({ summary: 'Actualizar estado (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: UpdateSupportTicketDto) {
        return this.service.update(Number(id), body);
    }

    @ApiOperation({ summary: 'Eliminar ticket (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(Number(id));
    }
}