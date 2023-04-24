import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import RatingEntity from '@rating/models/rating.model';
import RatingService from '@rating/services/rating.service';
import RatingController from '@rating/controllers/rating.controller';
import CourseEntity from '@course/models/course.model';
import UserEntity from '@user/models/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([RatingEntity, CourseEntity, UserEntity]), 
    LoggerModule
  ],
  providers: [RatingService],
  controllers: [RatingController],
})
class RatingModule {}

export default RatingModule;
