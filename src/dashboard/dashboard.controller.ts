import { Controller, Get, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';

import { JwtAuthGuard } from 'src/auth/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
    ) {}

    @ApiOperation({
        summary: 'Obtener estadísticas generales del sistema',
    })
    @ApiResponse({
        status: 200,
        description: 'Estadísticas obtenidas correctamente',
    })
    @Get('stats')
    getStats() {
        return this.dashboardService.getStats();
    }


    @ApiOperation({
    summary: 'Obtener las últimas órdenes',
    })
    @ApiResponse({
    status: 200,
    description: 'Últimas órdenes obtenidas correctamente',
    })
    @Get('recent-orders')
    getRecentOrders() {
        return this.dashboardService.getRecentOrders();
    }


    @ApiOperation({
        summary: 'Obtener productos con bajo stock',
    })
    @ApiResponse({
    status: 200,
        description: 'Productos con bajo stock obtenidos correctamente',
    })
    @Get('low-stock-products')
    getLowStockProducts() {
    return this.dashboardService.getLowStockProducts();
    } 
    
    @ApiOperation({
        summary: 'Obtener los productos más vendidos',
    })
    @ApiResponse({
        status: 200,
        description: 'Productos más vendidos obtenidos correctamente',
    })
    @Get('top-products')
    getTopProducts() {
        return this.dashboardService.getTopProducts();
    }

    @ApiOperation({
    summary: 'Obtener las ventas mensuales',
    })
    @ApiResponse({
    status: 200,
    description: 'Ventas mensuales obtenidas correctamente',
    })
    @Get('monthly-sales')
    getMonthlySales() {
    return this.dashboardService.getMonthlySales();
    }
}