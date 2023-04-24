import {
  Controller,
  HttpException,
  UseGuards,
  Request,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import ResponseObject from '@response/class/response-object';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import RatingService from '@rating/services/rating.service';

@Controller('rating')
class RatingController {
  constructor(private readonly ratingService: RatingService) {}
}

export default RatingController;
