import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CategoryEntity from '@category/models/category.model';
import CategoryService from '@category/services/category.service';
import CategoryController from '@category/controllers/category.controller';
import LoggerModule from '@logger/logger.module';
import UserEntity from '@user/models/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, UserEntity]),
    LoggerModule,
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
class CategoryModule {}

export default CategoryModule;
