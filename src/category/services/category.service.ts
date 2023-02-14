import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CloudLogger from '@logger/cloud.logger';
import CategoryEntity from '@category/models/category.model';
import { CreateCategoryDto } from '@category/dto/create-category';
import { DeleteCategoryDto } from '@category/dto/delete-category';
import { UpdateCategoryDto } from '@category/dto/update-category';

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
    // this.cloudLogger.log('Getting all categories');
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async GetCategoriesByTitle(title: string): Promise<CategoryEntity[]> {
    // this.cloudLogger.log('Getting all categories');
    const db = this.categoryRepository
    .createQueryBuilder('category');
    db.where('category.title LIKE :title', { title: `%${title}%` });
    const categories = await db.getMany();
    return categories;
  }

  async create(request: CreateCategoryDto): Promise<CategoryEntity> {
    // this.cloudLogger.log('Creating category');
    const newCategory = new CategoryEntity();
    newCategory.title = request.title;
    const category = await this.categoryRepository.findOne({
      where: { title: request.title },
    });
    if (category) {
      throw new BadRequestException('Category already exists');
    }
    return this.categoryRepository.save(newCategory);
  }

  async delete(category: DeleteCategoryDto): Promise<CategoryEntity> {
    // this.cloudLogger.log('Deleting category');
    const deleted = await this.categoryRepository.softDelete({ id: category.id });
    if (deleted.affected === 0) {
      throw new NotFoundException('Category not found');
    }
    return deleted.raw[0];
  }

  async update(category: UpdateCategoryDto): Promise<CategoryEntity> {
    // this.cloudLogger.log('Updating category');
    const updated = await this.categoryRepository.update(
      { id: category.id },
      { title: category.title },
    );
    if (updated.affected === 0) {
      throw new NotFoundException('Category not found');
    }
    return updated.raw[0];
  }
}

export default CategoryService;