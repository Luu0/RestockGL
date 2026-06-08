import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { TicketStatus } from '@prisma/client';

export class SupportTicketsQueryDto extends PaginationDto {

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsIn([
        'ABIERTO',
        'EN_PROGRESO',
        'CERRADO',
    ])
    status?: TicketStatus;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sort?: 'asc' | 'desc';

}