import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import CategoryEntity from '@category/models/category.model';
import UserEntity from '@user/models/user.model';

@Injectable()
class CategoryService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.courses', 'course')
      .select('category.id', 'id')
      .addSelect('category.title', 'title')
      .addSelect('COUNT(course.id)', 'total_course')
      .groupBy('category.id')
      .cache(true)
      .getRawMany();

    return categories;
  }

  async getCategoriesBySubscribed(userId: number): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository
    // select * from course_user where userId = userId
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.courses', 'course')
      .leftJoinAndSelect('course.subscribers', 'user')
      .select('category.id', 'id')
      .addSelect('category.title', 'title')
      .addSelect('COUNT(course.id)', 'total_course')
      .where('user.id = :userId', { userId })
      .groupBy('category.id')
      .cache(true)
      .getRawMany();

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

    const admin = await this.userRepository.findOneOrFail({
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
    const category = await this.categoryRepository.findOneOrFail({
      where: { id, admin: { id: adminId } },
    });
    category.title = title;

    return await this.categoryRepository.save(category);
  }

  async delete(id: number, adminId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOneOrFail({
      where: { id, admin: { id: adminId } },
    });

    return await this.categoryRepository.softRemove(category);
  }
}

export default CategoryService;
