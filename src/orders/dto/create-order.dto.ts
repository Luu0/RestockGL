import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

class OrderItemDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    productId!: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    quantity!: number;
    }

export class CreateOrderDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    userId!: number;

    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    items!: OrderItemDto[];
}