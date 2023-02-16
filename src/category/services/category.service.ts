import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import CategoryEntity from '@category/models/category.model';
import CreateCategoryDto from '@category/dto/create-category';
import DeleteCategoryDto from '@category/dto/delete-category';
import UpdateCategoryIDDto from '@category/dto/update-category-id';
import UpdateCategoryTitleDto from '@category/dto/update-category-title';

@Injectable()
class CategoryService {
  constructor(
    private readonly cloudLogger: CloudLogger,
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

  async getCategoryByTitle(title: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { title },
    });

    return category;
  }

  async getCategoryByIds(ids: Array<number>): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({ where: { id: In(ids) }});
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

    return await this.categoryRepository.softRemove(category);
  }

  async update(param: UpdateCategoryIDDto, request: UpdateCategoryTitleDto): Promise<CategoryEntity> {
    const { title } = request;
    const { id } = param;

    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    category.title = title;

    return await this.categoryRepository.save(category);
  }
}

export default CategoryService;
