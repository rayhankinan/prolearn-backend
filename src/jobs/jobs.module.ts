import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import StorageModule from '@storage/storage.module';
import JobsEntity from '@jobs/models/jobs.model';
import JobsService from '@jobs/services/jobs.services';
import JobsController from '@jobs/controllers/jobs.controller';

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
