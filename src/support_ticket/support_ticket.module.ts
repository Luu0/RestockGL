import { Module } from '@nestjs/common';
import { SupportTicketsController } from './support_ticket.controller';
import { SupportTicketsService } from './support_ticket.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService]
})
export class SupportTicketModule {}
