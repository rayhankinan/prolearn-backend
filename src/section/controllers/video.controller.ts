import {
  Post,
  Put,
  Delete,
  Request,
  Param,
  Body,
  Controller,
  HttpException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import VideoService from '@section/services/video.service';
import VideoEntity from '@section/models/video.model';
import ResponseObject from '@response/class/response-object';
import CreateSectionDto from '@section/dto/create-section';
import UpdateSectionIDDto from '@section/dto/update-section-id';
import UpdateSectionContentDto from '@section/dto/update-section-content';
import DeleteSectionDto from '@section/dto/delete-section';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import mp4OnlyPipe from '@file/pipe/mp4-only';

@Controller('video')
class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiProperty({ description: 'Create Video' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createVideo(
    @Request() req: AuthRequest,
    @Body() body: CreateSectionDto,
    @UploadedFile(mp4OnlyPipe) content: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { title, objective, duration, parentId, courseId, isAncestor } =
        body;
      const adminId = user.id;

      const video = await this.videoService.create(
        title,
        objective,
        duration,
        parentId,
        courseId,
        adminId,
        isAncestor,
        content,
      );

      return new ResponseObject<VideoEntity>(
        'Video created successfully',
        video,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Edit Video' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async editVideo(
    @Request() req: AuthRequest,
    @Param() param: UpdateSectionIDDto,
    @Body() body: UpdateSectionContentDto,
    @UploadedFile(mp4OnlyPipe) content: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { id } = param;
      const { title, objective, duration, parentId, courseId, isAncestor } =
        body;
      const adminId = user.id;

      const video = await this.videoService.edit(
        id,
        title,
        objective,
        duration,
        parentId,
        courseId,
        adminId,
        isAncestor,
        content,
      );

      return new ResponseObject<VideoEntity>(
        'Video edited successfully',
        video,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Delete Video' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteVideo(
    @Request() req: AuthRequest,
    @Param() param: DeleteSectionDto,
  ) {
    try {
      const { user } = req;
      const { id } = param;
      const adminId = user.id;

      const video = await this.videoService.delete(id, adminId);

      return new ResponseObject<VideoEntity>(
        'Video deleted successfully',
        video,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default VideoController;
