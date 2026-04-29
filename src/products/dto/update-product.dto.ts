import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsInt()
    supplierId?: number;
}