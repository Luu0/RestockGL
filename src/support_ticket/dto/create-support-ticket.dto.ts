import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateSupportTicketDto {

    @ApiProperty({example: 'El producto llegó dañado'})
    @IsString()
    message!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    orderId?: number;
}