import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import RatingEntity from '@rating/models/rating.model';
import CourseEntity from '@course/models/course.model';

@EventSubscriber()
class RatingSubscriber implements EntitySubscriberInterface<RatingEntity> {
  listenTo() {
    return RatingEntity;
  }

  async afterInsert(event: InsertEvent<RatingEntity>) {
    const { entity, manager } = event;

    const course = await entity.course;
    const ratingRepository = manager.getRepository(RatingEntity);
    const courseRepository = manager.getRepository(CourseEntity);

    const ratings = await ratingRepository.find({
      where: { course: { id: course.id } },
    });

    const averageRating =
      ratings.length !== 0
        ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length
        : 0;

    course.rating_avg = averageRating;

    await courseRepository.save(course);
  }

  async afterUpdate(event: UpdateEvent<RatingEntity>) {
    const { entity, manager } = event;

    const course = await entity.course;
    const ratingRepository = manager.getRepository(RatingEntity);
    const courseRepository = manager.getRepository(CourseEntity);

    const ratings = await ratingRepository.find({
      where: { course: { id: course.id } },
    });

    const averageRating =
      ratings.length !== 0
        ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length
        : 0;

    course.rating_avg = averageRating;

    await courseRepository.save(course);
  }
}

export default RatingSubscriber;
