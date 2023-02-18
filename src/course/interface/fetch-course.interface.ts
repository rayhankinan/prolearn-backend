import CourseEntity from '@course/models/course.model';

interface CourseRO {
  courses: CourseEntity[];
  coursesCount: number;
  currentPage: number;
  totalPage: number;
}

export default CourseRO;
