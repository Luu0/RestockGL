import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'Teclado mecánico' })
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty({ example: 15000 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price!: number;

    @ApiProperty({ example: 10 })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    stock!: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsInt()
    supplierId!: number;
}