import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PassThrough } from 'stream';
import CloudLogger from '@logger/class/cloud-logger';
import VideoEntity from '@section/models/video.model';
import CourseEntity from '@course/models/course.model';
import SectionEntity from '@section/models/section.model';
import StorageService from '@storage/services/storage.service';
import StorageType from '@storage/enum/storage-type';

@Injectable()
class VideoService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly storageService: StorageService,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: TreeRepository<SectionEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async render(videoId: number): Promise<PassThrough> {
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
    });

    const passThrough = await this.storageService.streamingDownload(
      video.uuid,
      StorageType.VIDEO,
    );

    return passThrough;
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

    const uuid = uuidv4();
    await this.storageService.streamingUpload(
      uuid,
      StorageType.VIDEO,
      content,
    ); /* TO DO: Masukkan ini ke queue */
    video.uuid = uuid;

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

    /* Soft Deletion in Object Storage */
    await this.storageService.delete(
      video.uuid,
      StorageType.VIDEO,
    ); /* TO DO: Masukkan ini ke queue */

    const uuid = uuidv4();
    await this.storageService.streamingUpload(
      uuid,
      StorageType.VIDEO,
      content,
    ); /* TO DO: Masukkan ini ke queue */
    video.uuid = uuid;

    return await this.videoRepository.save(video);
  }

  async delete(id: number, adminId: number): Promise<VideoEntity> {
    /* TO DO: Cek adminId */
    const video = await this.videoRepository.findOne({
      where: { id },
    });

    /* Soft Deletion in Object Storage */
    await this.storageService.delete(
      video.uuid,
      StorageType.VIDEO,
    ); /* TO DO: Masukkan ini ke queue */

    return await this.videoRepository.remove(video);
  }
}

export default VideoService;
