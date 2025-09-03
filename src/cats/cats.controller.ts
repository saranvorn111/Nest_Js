import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Put,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { HttpExceptionFilter } from 'src/auth/exception-filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  async findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.catsService.findOne(id);
    } catch (error) {
      throw new NotFoundException('Some thing not found', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    try {
      return this.catsService.updateCat(+id, updateCatDto);
    } catch (error) {
      throw new NotFoundException('Cat not found');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.catsService.removeCat(+id);
    } catch (error) {
      throw new NotFoundException('Cat not found');
    }
  }
}
