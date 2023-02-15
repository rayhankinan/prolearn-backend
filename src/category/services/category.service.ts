import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import CloudLogger from '@logger/cloud.logger';
import CategoryEntity from '@category/models/category.model';
import CreateCategoryDto from '@category/dto/create-category';
import DeleteCategoryDto from '@category/dto/delete-category';
import UpdateCategoryDto from '@category/dto/update-category';

@Injectable()
class CategoryService {
  private readonly cloudLogger: CloudLogger;

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    this.cloudLogger = new CloudLogger(CategoryEntity.name);
  }

  async getAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    return categories;
  }

  async getCategoriesByTitle(title: string): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find({
      where: { title: ILike(`%${title}%`) },
    });
    return categories;
  }

  async create(request: CreateCategoryDto): Promise<CategoryEntity> {
    const { title } = request;

    const category = new CategoryEntity();
    category.title = title;

    return await this.categoryRepository.save(category);
  }

  async delete(request: DeleteCategoryDto): Promise<CategoryEntity> {
    const { id } = request;

    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    return await this.categoryRepository.remove(category);
  }

  async update(request: UpdateCategoryDto): Promise<CategoryEntity> {
    const { id, title } = request;

    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    category.title = title;

    return await this.categoryRepository.save(category);
  }
}

export default CategoryService;
