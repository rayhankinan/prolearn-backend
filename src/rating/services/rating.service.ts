import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import RatingEntity from '@rating/models/rating.model';
import CourseEntity from '@course/models/course.model';
import UserEntity from '@user/models/user.model';

@Injectable()
class RatingService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getRating(courseId: number, userId: number): Promise<RatingEntity> {
    const rating = await this.ratingRepository.findOne({
      where: { course: { id: courseId }, user: { id: userId } }
    });

    return rating;
  }

  async getAverageRating(courseId: number): Promise<number> {
    const ratings = await this.ratingRepository.find({
      where: {
        course: {
          id: courseId,
        },
      },
    });
    let averageRating = 0;
    if (ratings.length !== 0) {
      let totalRating = 0;
      ratings.forEach((rating) => {
        totalRating += rating.rating;
      });

      averageRating = totalRating / ratings.length;
    }

    return averageRating;
  }

  async createRating(
    rating: number,
    courseId: number,
    userId: number,
  ): Promise<RatingEntity> {
    let ratingUser = await this.ratingRepository.findOne({
      where: { course: { id: courseId }, user: { id: userId } },
      relations: { course: true }
    });

    if (!ratingUser) {
      ratingUser = new RatingEntity();
      ratingUser.rating = rating;
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });
      ratingUser.course = Promise.resolve(course);

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      ratingUser.user = Promise.resolve(user);
    }

    ratingUser.rating = rating;

    return await this.ratingRepository.save(ratingUser);
  }
}

export default RatingService;


