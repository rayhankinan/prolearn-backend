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
import GetJobStatusDto from '@jobs/dto/get-job-status';

@Controller('jobs')
class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiProperty({ description: 'Run Compiler' })
  @Post('run')
  async runJob(@Body() body: RunCompilerDto) {
    try {
      const { extension, code, input } = body;

      const createdJob = await this.jobsService.createJob(
        extension,
        code,
        input,
      );
      const startedJob = await this.jobsService.startJob(createdJob);

      return new ResponseObject<JobsEntity>('Job Started', startedJob);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Get Job Status' })
  @Get('status/:id')
  async getJobStatus(@Param() param: GetJobStatusDto) {
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
