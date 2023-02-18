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
import UpdateCourseDto from '@course/dto/update-course';
import FetchCourseDto from '@course/dto/fetch-course';
import CourseEntity from '@course/models/course.model';
import CourseRO from '@course/interface/fetch-course.interface';

@Controller('course')
export default class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly responseService: ResponseService,
    private readonly categoryService: CategoryService,
  ) {}

  @ApiProperty({ description: 'Create a course' })
  @Post()
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Res() res: Response,
  ) {
    try {
      const category = await this.categoryService.getCategoryByIds(
        createCourseDto.category,
      );
      const course = await this.courseService.create(createCourseDto, category);
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

  @ApiProperty({ description: 'Fetch course' })
  @Get()
  async fetchCourse(@Query() query: FetchCourseDto, @Res() res: Response) {
    try {
      const { courses, coursesCount, currentPage, totalPage } =
        await this.courseService.fetchCourse(query);
      this.responseService.json<CourseRO>(
        res,
        StatusCodes.OK,
        'Courses fetched successfully',
        { courses, coursesCount, currentPage, totalPage },
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Get one course' })
  @Get(':id')
  async fetchCourseById(@Param('id') id: number, @Res() res: Response) {
    try {
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

  @ApiProperty({ description: 'Update course' })
  @Put(':id')
  async updateCourse(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @Res() res: Response,
  ) {
    try {
      const category = await this.categoryService.getCategoryByIds(
        updateCourseDto.category,
      );
      const course = await this.courseService.update(
        id,
        updateCourseDto,
        category,
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

  @ApiProperty({ description: 'Delete course' })
  @Delete(':id')
  async deleteCourse(@Param() id: DeleteCourseDto, @Res() res: Response) {
    try {
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
