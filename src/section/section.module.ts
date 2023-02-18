import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionEntity from '@section/models/section.model';
import MaterialEntity from '@section/models/material.model';
import SectionService from './services/section.service';
import MaterialService from './services/material.service';
import LoggerModule from '@logger/logger.module';
import ResponseModule from '@response/response.module';
import StorageModule from '@storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SectionEntity, MaterialEntity]),
    LoggerModule,
    ResponseModule,
    StorageModule,
  ],
  providers: [SectionService, MaterialService],
  controllers: [],
})
class SectionModule {}

export default SectionModule;
