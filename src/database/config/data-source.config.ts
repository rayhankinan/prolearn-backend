import { DataSourceOptions } from 'typeorm';
import CategoryEntity from '@category/models/category.model';
import CourseEntity from '@course/models/course.model';
import SectionEntity from '@section/models/section.model';
import MaterialEntity from '@section/models/material.model';
import ProjectEntity from '@section/models/project.model';
import QuizEntity from '@section/models/quiz.model';
import UserEntity from '@user/models/user.model';
import FileEntity from '@file/models/file.model';
import UserSubscriber from '@user/subscribers/user.subscriber';
import AdminSeeding from '@database/migrations/admin-migration';
import VideoEntity from '@section/models/video.model';

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
    MaterialEntity,
    VideoEntity,
    ProjectEntity,
    QuizEntity,
    UserEntity,
    FileEntity,
  ],
  subscribers: [UserSubscriber],
  migrations: [AdminSeeding],
};

export default dataSourceOptions;
