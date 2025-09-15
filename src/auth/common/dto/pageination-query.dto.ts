import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, MinLength } from 'class-validator';

// posts?page=1@limit=10
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Page must be at least 1' })
  @IsInt({ message: 'Page must be an interger' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Limit must be at least 1' })
  @IsInt({ message: 'Limit must be an interger' })
  @Max(100, { message: `Limit can't exceed 100` })
  limit?: number = 10;
}
