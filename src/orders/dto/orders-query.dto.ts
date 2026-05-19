import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { OrderStatus } from '@prisma/client';

export class OrdersQueryDto extends PaginationDto {
    
    @IsOptional()
    @IsIn([
        'PENDIENTE',
        'FINALIZADA',
        'CANCELADO',
        'REEMBOLSADO',
    ])
    status?: OrderStatus;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sort?: 'asc' | 'desc';
}