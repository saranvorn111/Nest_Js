import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';


@Injectable()
export class CatsService {

  private cats = [
    { id: 1, name: 'Whiskers', age: 3 },
    { id: 2, name: 'Tom', age: 5 },
    { id: 3, name: 'Felix', age: 2 },
  ];

  create(createCatDto: CreateCatDto) {
    const newCat = { id: Date.now(), ...createCatDto };
    this.cats.push(newCat);
    return newCat;
  }

  findAll() {
    return this.cats;
  }

  findOne(id: number) {
    const cat = this.cats.find(cat => cat.id === id);
    if (!cat) {
      throw new Error();
    }
    return cat;
  }

  updateCat(id: number, updateCatDto: UpdateCatDto) {
    const cat = this.findOne(id);
    if(!cat){
      throw new Error('Cat not found');
    }
    Object.assign(cat, updateCatDto);
    return cat;
  }

  removeCat(id: number) {
    const cat = this.findOne(id);
    if (cat) {
      this.cats = this.cats.filter(c => c.id !== id);
    }
    return cat;
  }
}
