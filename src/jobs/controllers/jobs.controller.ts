import {
  Get,
  Post,
  Body,
  Controller,
  HttpException,
  Param,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import ResponseObject from '@response/class/response-object';
import JobsService from '@jobs/services/jobs.services';
import JobsEntity from '@jobs/models/jobs.model';
import RunCompilerDto from '@jobs/dto/run-compiler';
import ReadJobIDDto from '@jobs/dto/read-job-id';

@Controller('jobs')
class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiProperty({ description: 'Run Compiler' })
  @Post()
  async runJob(@Body() body: RunCompilerDto) {
    try {
      const { extension, code, input } = body;

      const createdJob = await this.jobsService.createJob(
        extension,
        code,
        input,
      );

      return new ResponseObject<JobsEntity>('Job Started', createdJob);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Get Job Status' })
  @Get(':id')
  async getJobStatus(@Param() param: ReadJobIDDto) {
    try {
      const { id } = param;

      const job = await this.jobsService.getJobById(id);

      return new ResponseObject<JobsEntity>('Job Status', job);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default JobsController;
