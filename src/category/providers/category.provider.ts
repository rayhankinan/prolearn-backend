import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import ProviderEnum from '@common/enum/provider-enum';
import CategoryEntity from '@category/models/category.model';

const categoryProviders: Provider[] = [
  {
    provide: ProviderEnum.CATEGORY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CategoryEntity),
    inject: [ProviderEnum.DATA_SOURCE],
  },
];

export default categoryProviders;
