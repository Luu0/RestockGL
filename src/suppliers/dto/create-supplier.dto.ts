import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSupplierDto {
    @ApiProperty({ example: 'Proveedor S.A.' })
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty({ example: 'proveedor@mail.com' })
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '123456789'})
    @IsNotEmpty()
    @IsString()
    phone!: string;
}