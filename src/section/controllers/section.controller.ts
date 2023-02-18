import {
  Get,
  Query,
  Param,
  Controller,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
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

@Controller('section')
class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @ApiProperty({ description: 'Get Sections per Course' })
  @Get(':courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async getSectionsPerCourse(@Param() param: ReadSectionCourseDto) {
    try {
      const { courseId } = param;

      const section = await this.sectionService.getSectionByCourse(courseId);

      return new ResponseObject<SectionEntity>(
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
  @Get('search/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async getSectionsByTitle(
    @Param() param: ReadSectionCourseDto,
    @Query() query: ReadSectionTitleDto,
  ) {
    try {
      const { courseId } = param;
      const { title } = query;

      const sections = await this.sectionService.searchSectionsByTitle(
        courseId,
        title,
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
}

export default SectionController;
