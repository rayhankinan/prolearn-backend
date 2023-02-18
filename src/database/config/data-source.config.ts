import { DataSourceOptions } from 'typeorm';
import CategoryEntity from '@category/models/category.model';
import CourseEntity from '@course/models/course.model';
import SectionEntity from '@section/models/section.model';
import MaterialEntity from '@section/models/material.model';
import ProjectEntity from '@section/models/project.model';
import QuizEntity from '@section/models/quiz.model';
import UserEntity from '@user/models/user.model';
import AdminEntity from '@user/models/admin.model';
import StudentEntity from '@user/models/student.model';
import FileEntity from '@file/models/file.model';
import UserSubscriber from '@user/subscribers/user.subscriber';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOSTNAME || 'localhost',
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  cache: {
    type: 'redis',
    options: {
      socket: {
        host: process.env.DATABASE_CACHE_HOSTNAME || 'localhost',
        port: +process.env.DATABASE_CACHE_PORT || 6379,
      },
    },
  },
  synchronize: true,
  logging: true,
  entities: [
    CategoryEntity,
    CourseEntity,
    SectionEntity,
    MaterialEntity,
    ProjectEntity,
    QuizEntity,
    UserEntity,
    AdminEntity,
    StudentEntity,
    FileEntity,
  ],
  subscribers: [UserSubscriber],
  migrations: [],
};

export default dataSourceOptions;
