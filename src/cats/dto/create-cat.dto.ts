import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsInt({ message: 'Age must be an integer' })
  age: number;
}
