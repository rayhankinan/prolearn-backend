import { Get, Param, Controller, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import ResponseList from '@response/class/response-list';
import CourseEntity from '@course/models/course.model';
import RecommendationService from '@recommendation/services/recommendation.service';
import ContentFilteringDto from '@recommendation/dto/content-filtering-dto';

@Controller('recommendation')
class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @ApiProperty({ description: 'Content Filtering' })
  @Get('content/:courseId')
  async contentFiltering(@Param() param: ContentFilteringDto) {
    try {
      const { courseId } = param;

      const courses = await this.recommendationService.contentFiltering(
        courseId,
      );

      return new ResponseList<CourseEntity>('Courses retrieved', courses);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default RecommendationController;
