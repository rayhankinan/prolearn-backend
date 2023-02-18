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
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CourseService from '@course/services/course.service';
import ResponseService from '@response/services/response.service';
import CreateCourseDto from '@course/dto/create-course';
import DeleteCourseDto from '@course/dto/delete-course';
import UpdateCategoryIDDto from '@category/dto/update-category-id';
import UpdateCourseContentDto from '@course/dto/update-course-content';
import ReadCourseIDDto from '@course/dto/read-course-id';
import FetchCourseDto from '@course/dto/fetch-course';
import CourseEntity from '@course/models/course.model';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import ResponsePagination from '@response/class/response-pagination';

@Controller('course')
export default class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiProperty({ description: 'Fetch Courses' })
  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async fetchCourse(
    @Request() req: AuthRequest,
    @Query() query: FetchCourseDto,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      const { categoryId, title, difficulty, limit, page } = query;
      const adminId = user.role === UserRole.ADMIN ? user.id : undefined;

      const courseList = await this.courseService.fetchCourse(
        categoryId,
        title,
        difficulty,
        limit,
        page,
        adminId,
      );

      this.responseService.json<ResponsePagination<CourseEntity>>(
        res,
        StatusCodes.OK,
        'Courses fetched successfully',
        courseList,
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
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async fetchCourseById(
    @Request() req: AuthRequest,
    @Param() params: ReadCourseIDDto,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const adminId = user.role === UserRole.ADMIN ? user.id : undefined;

      const course = await this.courseService.getCourseById(id, adminId);

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
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async createCourse(
    @Request() req: AuthRequest,
    @Body() createCourseDto: CreateCourseDto,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      const { title, description, difficulty, status, categoryIDs } =
        createCourseDto;
      const adminId = user.id;

      const course = await this.courseService.create(
        title,
        description,
        difficulty,
        status,
        categoryIDs,
        adminId,
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
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async updateCourse(
    @Request() req: AuthRequest,
    @Param() params: UpdateCategoryIDDto,
    @Body() updateCourseDto: UpdateCourseContentDto,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const { title, description, difficulty, status, categoryIDs } =
        updateCourseDto;
      const adminId = user.id;

      const course = await this.courseService.update(
        id,
        title,
        description,
        difficulty,
        status,
        categoryIDs,
        adminId,
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
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteCourse(
    @Request() req: AuthRequest,
    @Param() params: DeleteCourseDto,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const adminId = user.id;

      const course = await this.courseService.delete(id, adminId);

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
