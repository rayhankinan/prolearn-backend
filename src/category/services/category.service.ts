import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import CategoryEntity from '@category/models/category.model';
import AdminEntity from '@user/models/admin.model';

@Injectable()
class CategoryService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find({
      cache: true,
    });

    return categories;
  }

  async searchCategoriesByTitle(title: string): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find({
      where: { title: title ? ILike(`%${title}%`) : undefined },
      cache: true,
    });

    return categories;
  }

  async create(title: string, adminId: number): Promise<CategoryEntity> {
    const category = new CategoryEntity();
    category.title = title;

    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });
    category.admin = Promise.resolve(admin);

    return await this.categoryRepository.save(category);
  }

  async update(
    id: number,
    title: string,
    adminId: number,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id, admin: { id: adminId } },
    });
    category.title = title;

    return await this.categoryRepository.save(category);
  }

  async delete(id: number, adminId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id, admin: { id: adminId } },
    });

    return await this.categoryRepository.softRemove(category);
  }
}

export default CategoryService;
