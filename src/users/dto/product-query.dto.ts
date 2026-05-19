import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';

export class UsersQueryDto extends PaginationDto {

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sort?: 'asc' | 'desc';
}