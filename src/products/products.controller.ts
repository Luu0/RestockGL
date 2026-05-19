import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth,ApiParam} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { JwtAuthGuard } from 'src/auth/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
// import { PaginationDto } from 'src/common/pagination.dto';
import { ProductsQueryDto } from './dto/productsquery.dto';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @ApiOperation({ summary: 'Crear producto (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Post()
    create(@Body() body: CreateProductDto) {
        return this.productsService.create(body);
    }

    @ApiOperation({ summary: 'Obtener todos los productos' })
    @Get()
    findAll(@Query() query: ProductsQueryDto) {
    return this.productsService.findAll(query);
    }


    @ApiOperation({ summary: 'Obtener producto por ID' })
    @ApiParam({ name: 'id', example: 1 })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(Number(id));
    }

    @ApiOperation({ summary: 'Actualizar producto (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: UpdateProductDto,
    ) {
        return this.productsService.update(Number(id), body);
    }

    @ApiOperation({ summary: 'Eliminar producto (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(Number(id));
    }
}
