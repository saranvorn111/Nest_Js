import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = this.catRepository.create({
      name: createCatDto.name,
      age: createCatDto.age,
    });
    return this.catRepository.save(cat);
  }

  async findAll() {
    return this.catRepository.find();
  }

  async findOne(id: number) {
    const cat = await this.catRepository.findOne({
      where: { id },
    });

    if (!cat) {
      throw new NotFoundException(`cat is not fond wiht id ${id}`);
    }
    return cat;
  }

  async updateCat(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat not found with ${id}`);
    }
    for (const key in updateCatDto) {
      if (updateCatDto[key] !== undefined) {
        cat[key] = updateCatDto[key];
      }

      return this.catRepository.save(cat);
    }
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat not found with ${id}`);
    }
    return this.catRepository.remove(cat);
  }
}
