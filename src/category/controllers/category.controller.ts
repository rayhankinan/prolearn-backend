import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Request,
  Query,
  Param,
  Controller,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import CategoryEntity from '@category/models/category.model';
import CategoryService from '@category/services/category.service';
import ResponseObject from '@response/class/response-object';
import ResponseList from '@response/class/response-list';
import ReadCategoryTitleDto from '@category/dto/read-category-title';
import CreateCategoryDto from '@category/dto/create-category';
import ReadCategoryIDDto from '@category/dto/read-category-id';
import UpdateCategoryTitleDto from '@category/dto/update-category-content';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';

@Controller('category')
class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiProperty({ description: 'Get All Categories' })
  @Get('all')
  async getAllCategories() {
    try {
      const categories = await this.categoryService.getAllCategories();

      return new ResponseList<CategoryEntity>(
        'Categories fetched successfully',
        categories,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Get Category By Subscribed' })
  @Get('subscribed')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  async getCategoriesBySubscribed(@Request() req: AuthRequest) {
    try {
      const { user } = req;
      const userId = user.id;

      const categories = await this.categoryService.getCategoriesBySubscribed(
        userId,
      );

      return new ResponseList<CategoryEntity>(
        'Categories fetched successfully',
        categories,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Search Categories using Query' })
  @Get()
  async getCategoriesByTitle(@Query() query: ReadCategoryTitleDto) {
    try {
      const { title } = query;

      const categories = await this.categoryService.searchCategoriesByTitle(
        title,
      );

      return new ResponseList<CategoryEntity>(
        'Categories searched successfully',
        categories,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Create Category' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCategory(
    @Request() req: AuthRequest,
    @Body() body: CreateCategoryDto,
  ) {
    try {
      const { user } = req;
      const { title } = body;
      const adminId = user.id;

      const category = await this.categoryService.create(title, adminId);

      return new ResponseObject<CategoryEntity>(
        'Category created successfully',
        category,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Update Category' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateCategory(
    @Request() req: AuthRequest,
    @Param() params: ReadCategoryIDDto,
    @Body() body: UpdateCategoryTitleDto,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const { title } = body;
      const adminId = user.id;

      const category = await this.categoryService.update(id, title, adminId);

      return new ResponseObject<CategoryEntity>(
        'Category updated successfully',
        category,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Delete Category' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCategory(
    @Request() req: AuthRequest,
    @Param() params: ReadCategoryIDDto,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const adminId = user.id;

      const category = await this.categoryService.delete(id, adminId);

      return new ResponseObject('Category deleted successfully', category);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default CategoryController;
