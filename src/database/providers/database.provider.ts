import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import dataSourceOptions from '@database/config/data-source.config';
import ProviderEnum from '@common/enum/provider-enum';

const databaseProviders: Provider[] = [
  {
    provide: ProviderEnum.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource(dataSourceOptions);
      return dataSource.initialize();
    },
  },
];

export default databaseProviders;
