import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import VideoEntity from '@section/models/video.model';
import CourseEntity from '@course/models/course.model';
import SectionEntity from '@section/models/section.model';
import StorageType from '@storage/enum/storage-type';
import FileService from '@file/services/file.service';

@Injectable()
class VideoService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly fileService: FileService,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: TreeRepository<SectionEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async render(videoId: number): Promise<Buffer> {
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
    });

    const file = await video.file;
    const [buffer] = await this.fileService.render(file.id, StorageType.VIDEO);

    return buffer;
  }

  async create(
    title: string,
    objective: string,
    duration: number,
    parentId: number,
    courseId: number,
    adminId: number,
    isAncestor: boolean,
    content: Express.Multer.File,
  ): Promise<VideoEntity> {
    const video = new VideoEntity();
    video.title = title;
    video.objective = objective;
    video.duration = duration;

    const parent = await this.sectionRepository.findOne({
      where: { id: parentId },
    });
    video.parent = Promise.resolve(parent);

    const course = await this.courseRepository.findOne({
      where: { id: courseId, admin: { id: adminId } },
    });
    video.adjoinedCourse = isAncestor ? Promise.resolve(course) : undefined;

    const file = await this.fileService.create(
      adminId,
      StorageType.VIDEO,
      content,
    );
    video.file = Promise.resolve(file);

    return await this.videoRepository.save(video);
  }

  async edit(
    id: number,
    title: string,
    objective: string,
    duration: number,
    parentId: number,
    courseId: number,
    adminId: number,
    isAncestor: boolean,
    content: Express.Multer.File,
  ): Promise<VideoEntity> {
    const video = await this.videoRepository.findOne({
      where: { id },
    });
    video.title = title;
    video.objective = objective;
    video.duration = duration;

    const parent = await this.sectionRepository.findOne({
      where: { id: parentId },
    });
    video.parent = Promise.resolve(parent);

    const course = await this.courseRepository.findOne({
      where: { id: courseId, admin: { id: adminId } },
    });
    video.adjoinedCourse = isAncestor ? Promise.resolve(course) : undefined;

    if (content) {
      const file = await video.file;

      if (file) {
        const editedFile = await this.fileService.edit(
          file.id,
          adminId,
          StorageType.VIDEO,
          content,
        );
        video.file = Promise.resolve(editedFile);
      } else {
        const newFile = await this.fileService.create(
          adminId,
          StorageType.VIDEO,
          content,
        );
        video.file = Promise.resolve(newFile);
      }
    }

    return await this.videoRepository.save(video);
  }

  async delete(id: number, adminId: number): Promise<VideoEntity> {
    const video = await this.videoRepository.findOne({
      where: { id },
    });
    const file = await video.file;

    if (file) {
      await this.fileService.delete(file.id, adminId, StorageType.VIDEO);
    }

    return await this.videoRepository.softRemove(video);
  }
}

export default VideoService;
