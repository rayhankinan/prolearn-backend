import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import CourseEntity from '@course/models/course.model';
import RatingEntity from '@rating/models/rating.model';
import RecommendationService from '@recommendation/services/recommendation.service';
import RecommendationController from './controllers/recommendation.controller';
import UserEntity from '@user/models/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([RatingEntity, CourseEntity, UserEntity]),
    LoggerModule,
  ],
  providers: [RecommendationService],
  controllers: [RecommendationController],
})
class RecommendationModule {}

export default RecommendationModule;
