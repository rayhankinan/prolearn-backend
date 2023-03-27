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
import { JobsService } from '@jobs/services/jobs.services';
import JobsEntity from '@jobs/models/jobs.model';
@Controller('jobs')
class JobsController {
  constructor(private readonly jobsService: JobsService) {}
  
  @ApiProperty({ description: 'Run Compiler' })
  @Post('run')
  async runJob(
    @Body() body,
  ) {
    try {
      let result = await this.jobsService.createJob(
        body.extension,
        body.code,
        body.input,
      );
      await this.jobsService.startJob(result);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Get Job Status' })
  @Get('/status/:id')
  async getJobStatus(@Param ('id') id: number) {
    const job = await this.jobsService.getJobById(id);

    return new ResponseObject<JobsEntity>(
      'Job Status',
      job,
    );
  }
}

export default JobsController;
