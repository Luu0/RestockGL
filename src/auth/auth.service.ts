import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    async login (email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            throw new Error('Invalid password');
        }

        const payload = { sub: user.id, email: user.email, role: user.role.name };
        return {
            access_token: this.jwt.sign(payload),
        };
    }
}