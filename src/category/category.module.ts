import { Module } from '@nestjs/common';
import DatabaseModule from '@database/database.module';
import LoggerModule from '@logger/logger.module';
import categoryProviders from './providers/category.provider';
import CategoryService from './services/category.service';

@Module({
  imports: [DatabaseModule, LoggerModule],
  providers: [...categoryProviders, CategoryService],
})
class CategoryModule {}

export default CategoryModule;
