import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { JwtAuthGuard } from 'src/auth/common/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Crear orden' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @ApiOperation({ summary: 'Listar órdenes' })
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }


  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Cancelar orden por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @Delete(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(Number(id));
  }
}