import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import RatingEntity from '@rating/models/rating.model';
import RatingService from '@rating/services/rating.service';
import RatingController from '@rating/controllers/rating.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity]), LoggerModule],
  providers: [RatingService],
  controllers: [RatingController],
})
class RatingModule {}

export default RatingModule;
