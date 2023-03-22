import {
  Get,
  Query,
  Param,
  Controller,
  HttpException,
  UseGuards,
  Request,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { FileInterceptor } from '@nestjs/platform-express';
import SectionEntity from '@section/models/section.model';
import SectionService from '@section/services/section.service';
import ResponseObject from '@response/class/response-object';
import ResponseList from '@response/class/response-list';
import ReadSectionCourseDto from '@section/dto/read-section-course';
import ReadSectionTitleDto from '@section/dto/read-section-title';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import CreateSectionDto from '@section/dto/create-section';
import htmlOnlyPipe from '@file/pipe/html-only';
import UpdateSectionIDDto from '@section/dto/update-section-id';
import UpdateSectionContentDto from '@section/dto/update-section-content';
import DeleteSectionDto from '@section/dto/delete-section';

@Controller('section')
class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @ApiProperty({ description: 'Get Sections per Course' })
  @Get(':courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async getSectionsPerCourse(
    @Request() req: AuthRequest,
    @Param() param: ReadSectionCourseDto,
  ) {
    try {
      const { user } = req;
      const { courseId } = param;
      const studentId = user.role === UserRole.STUDENT ? user.id : undefined;

      const section = await this.sectionService.getSectionByCourse(
        courseId,
        studentId,
      );

      return new ResponseList<SectionEntity>(
        'Sections fetched successfully',
        section,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Search Sections by Title' })
  @Get(':courseId/search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async getSectionsByTitle(
    @Request() req: AuthRequest,
    @Param() param: ReadSectionCourseDto,
    @Query() query: ReadSectionTitleDto,
  ) {
    try {
      const { user } = req;
      const { courseId } = param;
      const { title } = query;
      const studentId = user.role === UserRole.STUDENT ? user.id : undefined;

      const sections = await this.sectionService.searchSectionsByTitle(
        courseId,
        title,
        studentId,
      );

      return new ResponseList<SectionEntity>(
        'Sections fetched successfully',
        sections,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Create Section' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createSection(
    @Request() req: AuthRequest,
    @Body() body: CreateSectionDto,
    @UploadedFile(htmlOnlyPipe) fileContent: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { title, objective, duration, courseId, quizContent } = body;
      const adminId = user.id;

      const section = await this.sectionService.create(
        title,
        objective,
        duration,
        courseId,
        adminId,
        fileContent,
        quizContent,
      );

      return new ResponseObject<SectionEntity>(
        'Section created successfully',
        section,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Edit Section' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async editSection(
    @Request() req: AuthRequest,
    @Param() param: UpdateSectionIDDto,
    @Body() body: UpdateSectionContentDto,
    @UploadedFile(htmlOnlyPipe) fileContent: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { id } = param;
      const { title, objective, duration, courseId, quizContent } = body;
      const adminId = user.id;

      const section = await this.sectionService.edit(
        id,
        title,
        objective,
        duration,
        courseId,
        adminId,
        fileContent,
        quizContent,
      );

      return new ResponseObject<SectionEntity>(
        'Section edited successfully',
        section,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Delete Section' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteSection(
    @Request() req: AuthRequest,
    @Param() param: DeleteSectionDto,
  ) {
    try {
      const { user } = req;
      const { id } = param;
      const adminId = user.id;

      const section = await this.sectionService.delete(id, adminId);

      return new ResponseObject<SectionEntity>(
        'Section deleted successfully',
        section,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default SectionController;
