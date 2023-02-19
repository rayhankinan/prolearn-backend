import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  Controller,
  HttpException,
  UseGuards,
  Request,
  UploadedFile,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import CourseService from '@course/services/course.service';
import ResponseObject from '@response/class/response-object';
import ResponsePagination from '@response/class/response-pagination';
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
import RolesGuard from '@user/guard/roles.guard';

@Controller('course')
export default class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiProperty({ description: 'Fetch Courses' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async fetchCourse(
    @Request() req: AuthRequest,
    @Query() query: FetchCourseDto,
  ) {
    try {
      const { user } = req;
      const { categoryId, title, difficulty, limit, page } = query;
      const adminId = user.role === UserRole.ADMIN ? user.id : undefined;

      console.log(typeof page);

      const { courses, count, currentPage, totalPage } =
        await this.courseService.fetchCourse(
          categoryId,
          title,
          difficulty,
          limit,
          page,
          adminId,
        );

      return new ResponsePagination<CourseEntity>(
        'Courses fetched successfully',
        courses,
        count,
        currentPage,
        totalPage,
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async fetchCourseById(
    @Request() req: AuthRequest,
    @Param() params: ReadCourseIDDto,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const adminId = user.role === UserRole.ADMIN ? user.id : undefined;

      const course = await this.courseService.getCourseById(id, adminId);

      return new ResponseObject<CourseEntity>(
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCourse(
    @Request() req: AuthRequest,
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() content: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { title, description, difficulty, status, categoryIDs } =
        createCourseDto;
      const adminId = user.id;
      content = content ? content : null;

      const course = await this.courseService.create(
        title,
        description,
        difficulty,
        status,
        categoryIDs,
        adminId,
        content,
      );

      return new ResponseObject<CourseEntity>(
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateCourse(
    @Request() req: AuthRequest,
    @Param() params: UpdateCategoryIDDto,
    @Body() updateCourseDto: UpdateCourseContentDto,
    @UploadedFile() content: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const { title, description, difficulty, status, categoryIDs } =
        updateCourseDto;
      const adminId = user.id;
      content = content ? content : null;

      const course = await this.courseService.update(
        id,
        title,
        description,
        difficulty,
        status,
        categoryIDs,
        adminId,
        content,
      );

      return new ResponseObject<CourseEntity>(
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCourse(
    @Request() req: AuthRequest,
    @Param() params: DeleteCourseDto,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const adminId = user.id;

      const course = await this.courseService.delete(id, adminId);

      return new ResponseObject<CourseEntity>(
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
