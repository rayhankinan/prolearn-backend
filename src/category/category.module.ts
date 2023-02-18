import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CategoryEntity from '@category/models/category.model';
import CategoryService from '@category/services/category.service';
import CategoryController from '@category/controllers/category.controller';
import LoggerModule from '@logger/logger.module';
import ResponseModule from '@response/response.module';
import AdminEntity from '@user/models/admin.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, AdminEntity]),
    LoggerModule,
    ResponseModule,
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
class CategoryModule {}

export default CategoryModule;
