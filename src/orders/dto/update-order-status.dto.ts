import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {

    @Transform(({ value }) => value.toUpperCase())
    @IsEnum(OrderStatus)
    status!: OrderStatus;
}