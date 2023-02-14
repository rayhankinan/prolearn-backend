import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CategoryEntity from '@category/models/category.model';
import CategoryService from '@category/services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoryService],
  controllers: [],
})
class CategoryModule {}

export default CategoryModule;
