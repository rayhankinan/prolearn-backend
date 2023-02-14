import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import ProviderEnum from '@common/enum/provider-enum';
import CategoryEntity from '@category/models/category.model';
import CloudLogger from '@logger/models/cloud-logger';

const categoryProviders: Provider[] = [
  {
    provide: ProviderEnum.CATEGORY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CategoryEntity),
    inject: [ProviderEnum.DATA_SOURCE],
  },
  {
    provide: ProviderEnum.CATEGORY_LOGGER,
    useFactory: () => new CloudLogger(CategoryEntity.name),
    inject: [ProviderEnum.LOGGER],
  },
];

export default categoryProviders;
