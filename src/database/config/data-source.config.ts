import { DataSourceOptions } from 'typeorm';
import CategoryEntity from '@category/models/category.model';
import CourseEntity from '@course/models/course.model';
import SectionEntity from '@section/models/section.model';
import UserEntity from '@user/models/user.model';
import FileEntity from '@file/models/file.model';
import QuizEntity from '@quiz/models/quiz.model';
import UserSubscriber from '@user/subscribers/user.subscriber';
import AdminSeeding from '@database/migrations/admin-migration';
import QuizUserEntity from '@quizuser/models/quiz-user.model';
import JobsEntity from '@jobs/models/jobs.model';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOSTNAME || 'localhost',
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  cache: {
    duration: +process.env.DATABASE_CACHE_DURATION || 1000,
  },
  synchronize: true,
  logging: true,
  entities: [
    CategoryEntity,
    CourseEntity,
    SectionEntity,
    UserEntity,
    FileEntity,
    QuizEntity,
    QuizUserEntity,
    JobsEntity
  ],
  subscribers: [UserSubscriber],
  migrations: [AdminSeeding],
};

export default dataSourceOptions;
