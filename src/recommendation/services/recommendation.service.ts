import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Not, Repository } from 'typeorm';
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
  async contentFiltering(courseId: number): Promise<CourseEntity[]> {
    const currentCourse = await this.courseRepository.findOneOrFail({
      where: { id: courseId },
    });

    const categories = await currentCourse.categories;
    const categoryIDs = categories.map((category) => category.id);

    const matchingCourses = await this.courseRepository.find({
      relations: {
        categories: true,
      },
      where: {
        categories: { id: In(categoryIDs) },
      },
      cache: true,
    });

    const matchingCourseIDs = matchingCourses.map((course) => course.id);

    const recommendedCourses = await this.courseRepository.find({
      relations: {
        thumbnail: true,
        categories: true,
      },
      where: {
        id: In(matchingCourseIDs),
      },
      cache: true,
    });

    const jaccardTransforms = await jaccardMap(recommendedCourses);
    jaccardTransforms.sort(
      (A, B) =>
        jaccardIndex(categoryIDs, A.categoryIDs) -
        jaccardIndex(categoryIDs, B.categoryIDs),
    );

    const recommendationIndices = jaccardTransforms.map(
      (jaccardTransform) => jaccardTransform.courseId,
    );

    recommendedCourses.sort(
      (courseA, courseB) =>
        recommendationIndices.indexOf(courseB.id) -
        recommendationIndices.indexOf(courseA.id),
    );

    return recommendedCourses;
  }
}

export default RecommendationService;
