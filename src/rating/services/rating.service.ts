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
    const subscribedCourse = await this.courseRepository.findOneOrFail({
      where: { id: courseId, subscribers: { id: userId } },
    });

    const rating = await this.ratingRepository.findOneOrFail({
      where: { course: { id: subscribedCourse.id }, user: { id: userId } },
    });

    return rating;
  }

  async createRating(
    rating: number,
    courseId: number,
    userId: number,
  ): Promise<RatingEntity> {
    const subscribedCourse = await this.courseRepository.findOneOrFail({
      where: { id: courseId, subscribers: { id: userId } },
    });

    let ratingUser = await this.ratingRepository.findOne({
      where: { course: { id: subscribedCourse.id }, user: { id: userId } },
    });

    if (!ratingUser) {
      ratingUser = new RatingEntity();
      ratingUser.rating = rating;
      const course = await this.courseRepository.findOneOrFail({
        where: { id: subscribedCourse.id },
      });
      ratingUser.course = Promise.resolve(course);

      const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });
      ratingUser.user = Promise.resolve(user);
    }

    ratingUser.rating = rating;

    return await this.ratingRepository.save(ratingUser);
  }
}

export default RatingService;
