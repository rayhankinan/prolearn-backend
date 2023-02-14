import { Provider } from '@nestjs/common';
import ProviderEnum from '@common/enum/provider-enum';
import CloudLogger from '@logger/models/cloud-logger';

const loggerProviders: Provider[] = [
  {
    provide: ProviderEnum.LOGGER,
    useClass: CloudLogger,
  },
];

export default loggerProviders;
