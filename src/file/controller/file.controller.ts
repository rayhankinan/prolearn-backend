import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Request,
  Query,
  Param,
  Res,
  Controller,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FileEntity from '@file/models/file.model';
import FileService from '@file/services/file.service';
import CreateFileDto from '@file/dto/create-file';
import DeleteFileDto from '@file/dto/delete-file';
import RenderFileDto from '@file/dto/render-file';
import UpdateFileIDDto from '@file/dto/update-file-id';
import UpdateFileNameDto from '@file/dto/update-file-name';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import ResponseObject from '@response/class/response-object';

@Controller('file')
class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiProperty({ description: 'Get All Files' })
  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllFiles(@Request() req: AuthRequest, @Res() res: Response) {
    try {
      const { user } = req;
      const adminId = user.id;

      const files = await this.fileService.getAllFiles(adminId);

      return new ResponseObject<FileEntity[]>(
        'Files fetched successfully',
        files,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}
