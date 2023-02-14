import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import ProviderEnum from '@common/enum/provider-enum';
import CloudLogger from '@logger/models/cloud-logger';
import CategoryEntity from '@category/models/category.model';

@Injectable()
class CategoryService {
  constructor(
    @Inject(ProviderEnum.CATEGORY_REPOSITORY)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject(ProviderEnum.CATEGORY_LOGGER)
    private readonly cloudLogger: CloudLogger,
  ) {}
}

export default CategoryService;
