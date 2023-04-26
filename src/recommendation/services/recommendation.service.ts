import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import RatingEntity from '@rating/models/rating.model';
import CourseEntity from '@course/models/course.model';
import jaccardIndex from '@recommendation/utils/jaccard-index';
import jaccardMap from '@recommendation/utils/jaccard-map';

@Injectable()
class RecommendationService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  /* TODO: BISA DIBUAT PAGINATION */
  async contentFiltering(
    courseId: number,
    studentId: number,
  ): Promise<CourseEntity[]> {
    const currentCourse = await this.courseRepository.findOneOrFail({
      where: { id: courseId },
    });

    const categories = await currentCourse.categories;
    const categoryIDs = categories.map((category) => category.id);

    const matchingCourses = await this.courseRepository.find({
      relations: {
        categories: true,
        thumbnail: true,
      },
      where: {
        subscribers: { id: Not(studentId) },
        categories: { id: In(categoryIDs) },
      },
      cache: true,
    });

    const jaccardTransforms = await jaccardMap(matchingCourses);
    jaccardTransforms.sort(
      (A, B) =>
        jaccardIndex(categoryIDs, A.categoryIDs) -
        jaccardIndex(categoryIDs, B.categoryIDs),
    );

    const recommendationIndices = jaccardTransforms.map(
      (jaccardTransform) => jaccardTransform.courseId,
    );

    matchingCourses.sort(
      (courseA, courseB) =>
        recommendationIndices.indexOf(courseA.id) -
        recommendationIndices.indexOf(courseB.id),
    );

    return matchingCourses;
  }
}

export default RecommendationService;
