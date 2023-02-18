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
import { StatusCodes } from 'http-status-codes';
import CourseService from '@course/services/course.service';
import ResponseService from '@response/services/response.service';
import CategoryService from '@category/services/category.service';
import CreateCourseDto from '@course/dto/create-course';
import DeleteCourseDto from '@course/dto/delete-course';
import UpdateCategoryIDDto from '@category/dto/update-category-id';
import UpdateCourseContentDto from '@course/dto/update-course-content';
import ReadCourseIDDto from '@course/dto/read-course-id';
import FetchCourseDto from '@course/dto/fetch-course';
import CourseEntity from '@course/models/course.model';
import CourseRO from '@course/interface/fetch-course.interface';

@Controller('course')
export default class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiProperty({ description: 'Fetch Courses' })
  @Get()
  async fetchCourse(@Query() query: FetchCourseDto, @Res() res: Response) {
    try {
      const { categoryId, title, difficulty, limit, page } = query;
      const courseRO = await this.courseService.fetchCourse(
        categoryId,
        title,
        difficulty,
        limit,
        page,
      );

      this.responseService.json<CourseRO>(
        res,
        StatusCodes.OK,
        'Courses fetched successfully',
        courseRO,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Get One Course' })
  @Get(':id')
  async fetchCourseById(
    @Param() params: ReadCourseIDDto,
    @Res() res: Response,
  ) {
    try {
      const { id } = params;
      const course = await this.courseService.getCourseById(id);

      this.responseService.json<CourseEntity>(
        res,
        StatusCodes.OK,
        'Course fetched successfully',
        course,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Create A Course' })
  @Post()
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Res() res: Response,
  ) {
    try {
      const { title, description, difficulty, categoryIDs, status } =
        createCourseDto;
      const course = await this.courseService.create(
        title,
        description,
        difficulty,
        categoryIDs,
        status,
      );

      this.responseService.json<CourseEntity>(
        res,
        StatusCodes.CREATED,
        'Course created successfully',
        course,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Update Course' })
  @Put(':id')
  async updateCourse(
    @Param() params: UpdateCategoryIDDto,
    @Body() updateCourseDto: UpdateCourseContentDto,
    @Res() res: Response,
  ) {
    try {
      const { id } = params;
      const { title, description, difficulty, categoryIDs, status } =
        updateCourseDto;
      const course = await this.courseService.update(
        id,
        title,
        description,
        difficulty,
        categoryIDs,
        status,
      );

      this.responseService.json<CourseEntity>(
        res,
        StatusCodes.OK,
        'Course updated successfully',
        course,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Delete Course' })
  @Delete(':id')
  async deleteCourse(@Param() params: DeleteCourseDto, @Res() res: Response) {
    try {
      const { id } = params;
      const course = await this.courseService.delete(id);

      this.responseService.json<CourseEntity>(
        res,
        StatusCodes.OK,
        'Course deleted successfully',
        course,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}
