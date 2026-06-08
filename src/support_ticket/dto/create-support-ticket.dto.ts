import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, MinLength } from 'class-validator';

export class CreateSupportTicketDto {

    @ApiProperty({example: 'El producto llegó dañado'})
    @IsString()
    @MinLength(10)
    message!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    orderId?: number;
}