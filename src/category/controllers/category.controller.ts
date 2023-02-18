import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Request,
  Query,
  Param,
  Res,
  Controller,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CategoryService from '@category/services/category.service';
import ResponseService from '@response/services/response.service';
import CreateCategoryDto from '@category/dto/create-category';
import DeleteCategoryDto from '@category/dto/delete-category';
import UpdateCategoryIDDto from '@category/dto/update-category-id';
import UpdateCategoryTitleDto from '@category/dto/update-category-content';
import CategoryEntity from '@category/models/category.model';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';

@Controller('category')
class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiProperty({ description: 'Get All Categories' })
  @Get('list')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async getAllCategories(@Res() res: Response) {
    try {
      const categories = await this.categoryService.getAllCategories();
      this.responseService.json<CategoryEntity[]>(
        res,
        StatusCodes.OK,
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
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async getCategoriesByTitle(
    @Query('title') title: string,
    @Res() res: Response,
  ) {
    try {
      const categories = await this.categoryService.searchCategoriesByTitle(
        title,
      );
      this.responseService.json<CategoryEntity[]>(
        res,
        StatusCodes.OK,
        'Search result fetched successfully',
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
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async createCategory(
    @Request() req: AuthRequest,
    @Body() body: CreateCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      const { title } = body;
      const adminId = user.id;

      const category = await this.categoryService.create(title, adminId);

      this.responseService.json<CategoryEntity>(
        res,
        StatusCodes.CREATED,
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
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async updateCategory(
    @Request() req: AuthRequest,
    @Param() params: UpdateCategoryIDDto,
    @Body() body: UpdateCategoryTitleDto,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const { title } = body;
      const adminId = user.id;

      const category = await this.categoryService.update(id, title, adminId);

      this.responseService.json<CategoryEntity>(
        res,
        StatusCodes.OK,
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
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteCategory(
    @Request() req: AuthRequest,
    @Param() params: DeleteCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const adminId = user.id;

      const category = await this.categoryService.delete(id, adminId);

      this.responseService.json<CategoryEntity>(
        res,
        StatusCodes.OK,
        'Category deleted successfully',
        category,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default CategoryController;
