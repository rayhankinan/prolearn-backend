import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import StorageModule from '@storage/storage.module';
import JobsEntity from './models/jobs.model';
import { JobsService } from './services/jobs.services';
import JobsController from './controllers/jobs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobsEntity]),
    LoggerModule,
    StorageModule,
  ],
  providers: [JobsService],
  controllers: [JobsController],
  exports: [JobsService],
})
class JobsModule {}

export default JobsModule;
