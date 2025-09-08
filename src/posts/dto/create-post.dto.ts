import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @Optional()
  @IsNotEmpty({ message: 'Title should not be empty' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(50, { message: 'Title must be at most 50 characters long' })
  title: string;

  @Optional()
  @IsNotEmpty({ message: 'Content should not be empty' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(5, { message: 'Content must be at least 5 characters long' })
  content?: string;

  @Optional()
  @IsNotEmpty({ message: 'Author name should not be empty' })
  @IsString({ message: 'Author name must be a string' })
  @MinLength(2, { message: 'Author name must be at least 2 characters long' })
  @MaxLength(25, { message: 'Author name must be at most 25 characters long' })
  authorName?: string;
}
