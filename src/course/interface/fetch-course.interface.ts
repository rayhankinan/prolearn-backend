import CourseEntity from '@course/models/course.model';

export interface CourseRO {
  courses: CourseEntity[];
  coursesCount: number;
  currentPage: number;
  totalPage: number;
}