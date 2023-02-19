import {
  Get,
  Post,
  Put,
  Delete,
  Request,
  Res,
  Param,
  Controller,
  HttpException,
  UseGuards,
  StreamableFile,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { lookup } from 'mime-types';
import MaterialEntity from '@section/models/material.model';
import MaterialService from '@section/services/material.service';
import ResponseObject from '@response/class/response-object';
import RenderMaterialDto from '@section/dto/material/render-material';
import CreateMaterialDto from '@section/dto/material/create-material';
import UpdateSectionIDDto from '@section/dto/update-section-id';
import UpdateMaterialContentDto from '@section/dto/material/update-material-content';
import DeleteSectionDto from '@section/dto/delete-section';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import markdownOnlyPipe from '@file/pipe/markdown-only';

@Controller('material')
class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @ApiProperty({ description: 'Render Material' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async renderMaterial(
    @Param() param: RenderMaterialDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { id } = param;

      const buffer = await this.materialService.render(id);
      const contentType = lookup('.md') as string;
      res.set({
        'Content-Type': contentType,
      });

      return new StreamableFile(buffer);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Create Material' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createMaterial(
    @Request() req: AuthRequest,
    @Body() body: CreateMaterialDto,
    @UploadedFile(markdownOnlyPipe) content: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { title, objective, duration, parentId, courseId, isAncestor } =
        body;
      const adminId = user.id;

      const material = await this.materialService.create(
        title,
        objective,
        duration,
        parentId,
        courseId,
        adminId,
        isAncestor,
        content,
      );

      return new ResponseObject<MaterialEntity>(
        'Material created successfully',
        material,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Edit Material' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async editMaterial(
    @Request() req: AuthRequest,
    @Param() param: UpdateSectionIDDto,
    @Body() body: UpdateMaterialContentDto,
    @UploadedFile(markdownOnlyPipe) content: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { id } = param;
      const { title, objective, duration, parentId, courseId, isAncestor } =
        body;
      const adminId = user.id;

      const material = await this.materialService.edit(
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

      return new ResponseObject<MaterialEntity>(
        'Material edited successfully',
        material,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Delete Material' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteMaterial(
    @Request() req: AuthRequest,
    @Param() param: DeleteSectionDto,
  ) {
    try {
      const { user } = req;
      const { id } = param;
      const adminId = user.id;

      const material = await this.materialService.delete(id, adminId);

      return new ResponseObject<MaterialEntity>(
        'Material deleted successfully',
        material,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default MaterialController;
