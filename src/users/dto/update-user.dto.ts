import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {

    @ApiProperty({ example: 'newtest@mail.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: 'newpassword123' })
    @IsOptional()
    @MinLength(6)
    password?: string;
}