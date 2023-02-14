import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CloudLogger from '@logger/cloud.logger';
import CategoryEntity from '@category/models/category.model';

@Injectable()
class CategoryService {
  private readonly cloudLogger: CloudLogger;

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    this.cloudLogger = new CloudLogger(CategoryEntity.name);
  }
}

export default CategoryService;
