import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/auth/common/dto/pageination-query.dto';

export class FindPostsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: `Title serch cann't exceed 100 chracters` })
  title?: string;
}
