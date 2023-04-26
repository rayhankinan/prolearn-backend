import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import CourseEntity from '@course/models/course.model';
import RatingEntity from '@rating/models/rating.model';
import RecommendationService from '@recommendation/services/recommendation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity, RatingEntity]),
    LoggerModule,
  ],
  providers: [RecommendationService],
  controllers: [],
})
class RecommendationModule {}

export default RecommendationModule;
