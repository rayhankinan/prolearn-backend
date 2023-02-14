import { Module } from '@nestjs/common';
import DatabaseModule from '@database/database.module';
import LoggerModule from '@logger/logger.module';
import categoryProviders from './providers/category.provider';
import CategoryService from './services/category.service';
import CategoryController from './controllers/category.controller';

@Module({
  imports: [DatabaseModule, LoggerModule],
  providers: [...categoryProviders, CategoryService],
  controllers: [CategoryController],
})
class CategoryModule {}

export default CategoryModule;
