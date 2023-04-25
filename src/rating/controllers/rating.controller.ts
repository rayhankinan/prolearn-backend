import {
  Controller,
  HttpException,
  UseGuards,
  Request,
  Post,
  Get,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import ResponseObject from '@response/class/response-object';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import RatingService from '@rating/services/rating.service';
import CreateRatingDto from '@rating/dto/create-rating-dto';
import ReadRatingDto from '@rating/dto/read-rating-dto';
import RatingEntity from '@rating/models/rating.model';

@Controller('rating')
class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiProperty({description: 'Average Rating'})
  @Get(':courseId/average')
  async getAverageRating(
    @Param() params: ReadRatingDto,
  ) {
    try {
      const { courseId } = params;

      const averageRating = await this.ratingService.getAverageRating(
        courseId,
      );

      return new ResponseObject<number>(
        'Get Average Rating',
        averageRating,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({description: 'Create Rating'})
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async createRating(
    @Request() req: AuthRequest,
    @Body() body: CreateRatingDto,
  ) {
    try {
      const { user } = req;
      const { courseId, rating } = body;
      const userId = user.id;

      const newRating = await this.ratingService.createRating(
        rating,
        courseId,
        userId,
      );

      return new ResponseObject<RatingEntity>(
        'Rating Created',
        newRating,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Get Rating' })
  @Get(':courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async getRating(
    @Request() req: AuthRequest,
    @Param() params: ReadRatingDto,
  ) {
    try {
      const { user } = req;
      const { courseId } = params;
      const userId = user.id;

      const rating = await this.ratingService.getRating(courseId, userId);

      return new ResponseObject<RatingEntity>(
        'Rating retrieved successfully',
        rating,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default RatingController;
