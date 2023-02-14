import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import ProviderEnum from '@common/enum/provider-enum';
import CloudLogger from '@logger/models/cloud-logger';
import CategoryEntity from '@category/models/category.model';

@Injectable()
class CategoryService {
  private readonly cloudLogger: CloudLogger;

  constructor(
    @Inject(ProviderEnum.CATEGORY_REPOSITORY)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    this.cloudLogger = new CloudLogger(CategoryEntity.name);
  }
}

export default CategoryService;
