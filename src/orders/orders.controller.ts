import { Body, Controller, Delete, Get, Param, Post, UseGuards, Req, Patch} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { JwtAuthGuard } from 'src/auth/common/jwt-auth.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Crear orden' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
      @Body() body: CreateOrderDto,
      @Req() req: Request
    ) {
    return this.ordersService.create(body, req.user);
  }

  @ApiOperation({ summary: 'Listar órdenes Admin' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyOrders(@Req() req: Request) {
    return this.ordersService.findMyOrders(
      (req.user as any).sub
    );
  }

  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Cancelar orden por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(Number(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      Number(id),
      body.status.toLocaleUpperCase() as any,
  );
  }


}