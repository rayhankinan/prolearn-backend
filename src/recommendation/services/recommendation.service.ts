import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as _ from 'lodash';
import CloudLogger from '@logger/class/cloud-logger';
import RatingEntity from '@rating/models/rating.model';
import CourseEntity from '@course/models/course.model';
import UserEntity from '@user/models/user.model';
import jaccardIndex from '@recommendation/utils/jaccard-index';
import jaccardMap from '@recommendation/utils/jaccard-map';
import pearsonMap from '@recommendation/utils/pearson-map';
import pearsonCorrelation from '@recommendation/utils/pearson-correlation';

@Injectable()
class RecommendationService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /* TODO: BISA DIBUAT PAGINATION DAN FETCH DATABASE DIEFISIENKAN */
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

    const recommendationIndices = jaccardTransforms
      .map((jaccardTransform) => jaccardTransform.courseId)
      .filter((recommendationIndex) => recommendationIndex !== courseId);

    recommendedCourses.sort(
      (courseA, courseB) =>
        recommendationIndices.indexOf(courseB.id) -
        recommendationIndices.indexOf(courseA.id),
    );

    return recommendedCourses;
  }

  /* TODO: BISA DIBUAT PAGINATION DAN FETCH DATABASE DIEFISIENKAN */
  async collaborativeFiltering(studentId: number): Promise<CourseEntity[]> {
    const currentRatings = await this.ratingRepository.find({
      cache: true,
    });

    const similarityMatrix = await pearsonMap(currentRatings);

    const currentUsers = await this.userRepository.find({
      select: {
        id: true,
      },
      cache: true,
    });

    const currentUserIDs = currentUsers
      .map((user) => user.id)
      .filter((userId) => userId !== studentId);

    const mostSimilarUserID = currentUserIDs.reduce((previous, current) => {
      const previousCorrelation = pearsonCorrelation(
        similarityMatrix[studentId],
        similarityMatrix[previous],
      );

      const currentCorrelation = pearsonCorrelation(
        similarityMatrix[studentId],
        similarityMatrix[current],
      );

      return currentCorrelation > previousCorrelation ? current : previous;
    });

    const currentSubsribedCourse = await this.courseRepository.find({
      where: { subscribers: { id: studentId } },
      cache: true,
    });
    const recommendedSubscribedCourse = await this.courseRepository.find({
      where: { subscribers: { id: mostSimilarUserID } },
      cache: true,
    });

    return _.difference(recommendedSubscribedCourse, currentSubsribedCourse);
  }
}

export default RecommendationService;
