import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';

import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam} from '@nestjs/swagger';

import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto.';

import { JwtAuthGuard } from 'src/auth/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) {}

    @ApiOperation({ summary: 'Crear proveedor' })
    @ApiResponse({ status: 201 })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Post()
    create(@Body() body: CreateSupplierDto) {
        return this.suppliersService.create(body);
    }

    @ApiOperation({ summary: 'Obtener todos los proveedores' })
    @Get()
    findAll() {
        return this.suppliersService.findAll();
    }

    @ApiOperation({ summary: 'Obtener proveedor por ID' })
    @ApiParam({ name: 'id', example: 1 })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.suppliersService.findOne(Number(id));
    }

    @ApiOperation({ summary: 'Actualizar proveedor' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: UpdateSupplierDto,
    ) {
        return this.suppliersService.update(Number(id), body);
    }

    @ApiOperation({ summary: 'Eliminar proveedor (solo admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.suppliersService.remove(Number(id));
    }
}