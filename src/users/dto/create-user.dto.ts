import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {

    @ApiProperty({ example: 'test@mail.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    password!: string;
    
}
