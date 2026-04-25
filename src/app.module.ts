import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      ProductsModule, UsersModule, PrismaModule, AuthModule, SuppliersModule
    ],
    providers: [],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
