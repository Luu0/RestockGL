import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { OrdersModule } from './orders/orders.module';
import { SupportTicketModule } from './support_ticket/support_ticket.module';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      ProductsModule, UsersModule, PrismaModule, AuthModule, SuppliersModule, OrdersModule, SupportTicketModule
    ],
    providers: [],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
