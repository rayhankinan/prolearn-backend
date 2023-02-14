import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import ProviderEnum from '@common/enum/provider-enum';
import CourseEntity from '@course/models/course.model';
import CloudLogger from '@logger/models/cloud-logger';

const courseProviders: Provider[] = [
  {
    provide: ProviderEnum.COURSE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CourseEntity),
    inject: [ProviderEnum.DATA_SOURCE],
  },
  {
    provide: ProviderEnum.COURSE_LOGGER,
    useFactory: () => new CloudLogger(CourseEntity.name),
    inject: [ProviderEnum.LOGGER],
  },
];

export default courseProviders;
