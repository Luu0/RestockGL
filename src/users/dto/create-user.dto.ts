import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {

    @ApiProperty({ example: 'test@mail.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @MinLength(6)
    password!: string;
    
}
