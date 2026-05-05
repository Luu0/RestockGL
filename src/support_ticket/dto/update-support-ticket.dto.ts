import { IsEnum, IsOptional } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class UpdateSupportTicketDto {
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}