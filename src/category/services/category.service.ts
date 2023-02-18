import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import CategoryEntity from '@category/models/category.model';
import CreateCategoryDto from '@category/dto/create-category';
import DeleteCategoryDto from '@category/dto/delete-category';
import UpdateCategoryIDDto from '@category/dto/update-category-id';
import UpdateCategoryContentDto from '@category/dto/update-category-content';

@Injectable()
class CategoryService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    return categories;
  }

  async getCategoryByIds(IDs: Array<number>): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({ where: { id: In(IDs) } });
  }

  async searchCategoriesByTitle(title: string): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find({
      where: { title: ILike(`%${title}%`) },
    });

    return categories;
  }

  async create(title: string): Promise<CategoryEntity> {
    const category = new CategoryEntity();
    category.title = title;

    return await this.categoryRepository.save(category);
  }

  async delete(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    return await this.categoryRepository.softRemove(category);
  }

  async update(id: number, title: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    category.title = title;

    return await this.categoryRepository.save(category);
  }
}

export default CategoryService;
