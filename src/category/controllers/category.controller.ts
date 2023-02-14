import { 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Query, 
  Param,
  Res,
  Req,
  Controller } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import CategoryService  from '@category/services/category.service';
import { ResponseService } from '@response/response.service';
import { CreateCategoryDto } from '@category/dto/create-category';
import { DeleteCategoryDto } from '@category/dto/delete-category';
import { UpdateCategoryDto } from '@category/dto/update-category';

@Controller({ path: 'category', version: '1' })
class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly ResponseService: ResponseService,
    ) {}

  @ApiProperty({ description: 'Get all categories' })
  @Get()
  async getAllCategories(@Res() res): Promise<any> {
    try {
      const categories = await this.categoryService.getAllCategories();
      this.ResponseService.json(res, 200, 'Categories fetched successfully', categories);
    } catch (error) {
      this.ResponseService.json(res, error);
    }
  }

  @ApiProperty({ description: 'Get categories by title' })
  @Get()
  async getCategoriesByTitle(@Query('title') title: string, @Res() res): Promise<any> {
    try {
      const categories = await this.categoryService.GetCategoriesByTitle(title);
      this.ResponseService.json(res, 200, 'Categories fetched successfully', categories);
    } catch (error) {
      this.ResponseService.json(res, error);
    }
  }

  @ApiProperty({ description: 'Create category' })
  @Post()
  async createCategory(@Body() body: CreateCategoryDto, @Res() res): Promise<any> {
    try {
      const category = await this.categoryService.create(body);
      this.ResponseService.json(res, 201, 'Category created successfully', category);
    } catch (error) {
      this.ResponseService.json(res, error);
    }
  }

  @ApiProperty({ description: 'Delete category' })
  @Delete(':id/delete')
  async deleteCategory(@Param() params: DeleteCategoryDto, @Res() res): Promise<any> {
    try {
      const category = await this.categoryService.delete(params);
      this.ResponseService.json(res, 200, 'Category deleted successfully', category);
    } catch (error) {
      this.ResponseService.json(res, error);
    }
  }

  @ApiProperty({ description: 'Update category' })
  @Put(':id/update')
  async updateCategory(@Param() params: UpdateCategoryDto, @Res() res): Promise<any> {
    try {
      const category = await this.categoryService.update(params);
      this.ResponseService.json(res, 200, 'Category updated successfully', category);
    } catch (error) {
      this.ResponseService.json(res, error);
    }
  }  
}

export default CategoryController;