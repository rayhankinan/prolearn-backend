import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  Res,
  Controller,
  HttpException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import CategoryService from '@category/services/category.service';
import ResponseService from '@response/response.service';
import CreateCategoryDto from '@category/dto/create-category';
import DeleteCategoryDto from '@category/dto/delete-category';
import UpdateCategoryDto from '@category/dto/update-category';

@Controller({ path: 'category', version: '1' })
class CategoryController {
  private readonly responseService: ResponseService;

  constructor(private readonly categoryService: CategoryService) {
    this.responseService = new ResponseService();
  }

  @ApiProperty({ description: 'Get all categories' })
  @Get()
  async getAllCategories(@Res() res: Response): Promise<any> {
    try {
      const categories = await this.categoryService.getAllCategories();
      this.responseService.json(
        res,
        StatusCodes.OK,
        'Categories fetched successfully',
        categories,
      );
    } catch (error) {
      throw new HttpException(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiProperty({ description: 'Get categories by title' })
  @Get()
  async getCategoriesByTitle(
    @Query('title') title: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const categories = await this.categoryService.getCategoriesByTitle(title);
      this.responseService.json(
        res,
        StatusCodes.OK,
        'Categories fetched successfully',
        categories,
      );
    } catch (error) {
      throw new HttpException(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiProperty({ description: 'Create category' })
  @Post()
  async createCategory(
    @Body() body: CreateCategoryDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const category = await this.categoryService.create(body);
      this.responseService.json(
        res,
        StatusCodes.CREATED,
        'Category created successfully',
        category,
      );
    } catch (error) {
      throw new HttpException(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiProperty({ description: 'Delete category' })
  @Delete(':id')
  async deleteCategory(
    @Param() params: DeleteCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const category = await this.categoryService.delete(params);
      this.responseService.json(
        res,
        StatusCodes.OK,
        'Category deleted successfully',
        category,
      );
    } catch (error) {
      throw new HttpException(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiProperty({ description: 'Update category' })
  @Put(':id')
  async updateCategory(
    @Param() params: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const category = await this.categoryService.update(params);
      this.responseService.json(
        res,
        StatusCodes.OK,
        'Category updated successfully',
        category,
      );
    } catch (error) {
      throw new HttpException(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export default CategoryController;
