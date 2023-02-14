import { Test, TestingModule } from '@nestjs/testing';
import CategoryController from '@category/controllers/category.controller';
import CategoryService from '@category/services/category.service';

describe('CategoryController', () => {
  let categoryController: CategoryController;

  beforeEach(async () => {
    const categoryTestingModule: TestingModule = await Test.createTestingModule(
      {
        controllers: [CategoryController],
        providers: [CategoryService],
      },
    ).compile();

    categoryController =
      categoryTestingModule.get<CategoryController>(CategoryController);
  });
});
