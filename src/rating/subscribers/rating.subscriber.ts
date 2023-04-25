import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import RatingEntity from '@rating/models/rating.model';
import CourseEntity from '@course/models/course.model';
import RatingService from '@rating/services/rating.service';

@EventSubscriber()
class RatingSubscriber implements EntitySubscriberInterface<RatingEntity> {

  listenTo() {
    return RatingEntity;
  }

  async beforeInsert(event: InsertEvent<RatingEntity>) {
    const { entity, manager } = event;
    const courseId = (await entity.course).id;
    const ratingRepository = manager.getRepository(RatingEntity);
    const courseRepository = manager.getRepository(CourseEntity);

    const ratings = await ratingRepository.find({
      where: { course: { id: courseId } }
    });
    let averageRating = 0;
    if (ratings.length !== 0) {
      let totalRating = 0;
      ratings.forEach((rating) => {
        totalRating += rating.rating;
      });
      averageRating = totalRating / ratings.length;
    }

    const course = await courseRepository.findOne({
      where: { id: courseId }
    });
    course.rating_avg = averageRating;

    await courseRepository.save(course);
  }

  async beforeUpdate(event: UpdateEvent<RatingEntity>) {
    const { entity, manager } = event;
    const courseId = (await entity.course).id;
    const ratingRepository = manager.getRepository(RatingEntity);
    const courseRepository = manager.getRepository(CourseEntity);

    const ratings = await ratingRepository.find({
      where: { course: { id: courseId } }
    });
    let averageRating = 0;
    if (ratings.length !== 0) {
      let totalRating = 0;
      ratings.forEach((rating) => {
        totalRating += rating.rating;
      });
      averageRating = totalRating / ratings.length;
    }

    const course = await courseRepository.findOne({
      where: { id: courseId }
    });
    course.rating_avg = averageRating;

    await courseRepository.save(course);
  }
}

export default RatingSubscriber;