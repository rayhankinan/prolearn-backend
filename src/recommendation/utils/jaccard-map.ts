import CourseEntity from '@course/models/course.model';
import JaccardTransform from '@recommendation/type/jaccard-transform';

const jaccardMap = async (
  courses: CourseEntity[],
): Promise<JaccardTransform[]> => {
  const jaccardTransforms: JaccardTransform[] = await Promise.all(
    courses.map(async (course) => {
      const categories = await course.categories;
      const categoryIDs = categories.map((category) => category.id);
      const jaccardTransform: JaccardTransform = {
        courseId: course.id,
        categoryIDs: categoryIDs,
      };

      return jaccardTransform;
    }),
  );

  return jaccardTransforms;
};

export default jaccardMap;
