import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { codeDirPath, outputDirPath, inputDirPath } from '@jobs/temp-file/path';
import JobsEntity from '@jobs/models/jobs.model';
import JobsEvent from '@jobs/enum/event';
import execProm from '@jobs/utils/exec-promise';
import CloudLogger from '@logger/class/cloud-logger';
import ExtensionType from '@jobs/enum/extension-type';
import StatusType from '@jobs/enum/status-type';

@Injectable()
class JobsService implements OnModuleInit {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(JobsEntity)
    private readonly jobsRepository: Repository<JobsEntity>,
  ) {
    this.cloudLogger = new CloudLogger(JobsEntity.name);
  }

  onModuleInit() {
    if (!existsSync(outputDirPath)) {
      mkdirSync(outputDirPath, { recursive: true });
    }
    if (!existsSync(codeDirPath)) {
      mkdirSync(codeDirPath, { recursive: true });
    }
    if (!existsSync(inputDirPath)) {
      mkdirSync(inputDirPath, { recursive: true });
    }
  }

  async getJobById(id: number): Promise<JobsEntity> {
    return await this.jobsRepository.findOne({ where: { id } });
  }

  async createJob(
    extension: ExtensionType,
    code: string,
    input?: string,
  ): Promise<JobsEntity> {
    const job = new JobsEntity();
    job.extension = extension;

    const codeFileName = `${Date.now()}.${extension}`;
    const codeFilePath = join(codeDirPath, codeFileName);
    writeFileSync(codeFilePath, code);

    job.codePath = codeFilePath;

    if (input) {
      const inputFileName = `${Date.now()}.txt`;
      const inputFilePath = join(inputDirPath, inputFileName);
      writeFileSync(inputFilePath, input);

      job.inputPath = inputFilePath;
    }

    await this.eventEmitter.emitAsync(JobsEvent.CREATED, job);

    return await this.jobsRepository.save(job);
  }

  @OnEvent(JobsEvent.CREATED, { async: true })
  async startJob(job: JobsEntity): Promise<void> {
    job.startAt = new Date();

    let output: { result: string; isError: boolean };
    switch (job.extension) {
      case ExtensionType.CPP:
        output = await this.executeCpp(job);
        break;
      case ExtensionType.C:
        output = await this.executeC(job);
        break;
      case ExtensionType.PYTHON:
        output = await this.executePy(job);
        break;
      case ExtensionType.JAVASCRIPT:
        output = await this.executeJs(job);
        break;
      default:
        throw new Error('Invalid Extension');
    }

    job.endAt = new Date();
    job.output = output.result;
    job.status = output.isError ? StatusType.FAILED : StatusType.SUCCESS;

    await this.jobsRepository.save(job);
  }

  /* Execute C++ */
  /* TODO: MASIH AMAT SANGAT GAK AMAN (SOLUSI: RUN INI MENGGUNAKAN COMMAND EXECUTION OVER SSH KE CONTAINER LAIN) */
  async executeCpp(
    job: JobsEntity,
  ): Promise<{ result: string; isError: boolean }> {
    const jobId = job.id;
    const outPath = join(outputDirPath, `${jobId}`);
    let isError = false;
    let result: string;

    try {
      if (job.inputPath) {
        const p = await execProm(
          `g++ ${job.codePath} -o ${outPath} && cd ${outputDirPath} && ./${jobId} < ${job.inputPath}`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `g++ ${job.codePath} -o ${outPath} && cd ${outputDirPath} && ./${jobId}`,
        );
        result = p.stdout;
      }
    } catch (ex) {
      result = ex.stderr;
      isError = true;
    }
    return { result, isError };
  }

  /* Execute C */
  /* TODO: MASIH AMAT SANGAT GAK AMAN (SOLUSI: RUN INI MENGGUNAKAN COMMAND EXECUTION OVER SSH KE CONTAINER LAIN) */
  async executeC(
    job: JobsEntity,
  ): Promise<{ result: string; isError: boolean }> {
    const jobId = job.id;
    const outPath = join(outputDirPath, `${jobId}`);
    let isError = false;
    let result: string;

    try {
      if (job.inputPath) {
        const p = await execProm(
          `gcc ${job.codePath} -o ${outPath}  &&  ls && cd ${outputDirPath} && ./${jobId} < ${job.inputPath}`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `gcc ${job.codePath} -o ${outPath} && cd ${outputDirPath} && ./${jobId}`,
        );
        result = p.stdout;
      }
    } catch (ex) {
      result = ex.stderr;
      isError = true;
    }
    return { result, isError };
  }

  /* Execute Python */
  /* TODO: MASIH AMAT SANGAT GAK AMAN (SOLUSI: RUN INI MENGGUNAKAN COMMAND EXECUTION OVER SSH KE CONTAINER LAIN) */
  async executePy(
    job: JobsEntity,
  ): Promise<{ result: string; isError: boolean }> {
    let isError = false;
    let result: string;

    try {
      if (job.inputPath) {
        const p = await execProm(`python3 ${job.codePath} < ${job.inputPath}`);
        result = p.stdout;
      } else {
        const p = await execProm(`python3 ${job.codePath}`);
        result = p.stdout;
      }
    } catch (ex) {
      result = ex.stderr;
      isError = true;
    }
    return { result, isError };
  }

  /* Execute JavaScript */
  /* TODO: MASIH AMAT SANGAT GAK AMAN (SOLUSI: RUN INI MENGGUNAKAN COMMAND EXECUTION OVER SSH KE CONTAINER LAIN) */
  async executeJs(
    job: JobsEntity,
  ): Promise<{ result: string; isError: boolean }> {
    let isError = false;
    let result: string;

    try {
      if (job.inputPath) {
        const p = await execProm(`node ${job.codePath} < ${job.inputPath}`);
        result = p.stdout;
      } else {
        const p = await execProm(`node ${job.codePath}`);
        result = p.stdout;
      }
    } catch (ex) {
      result = ex.stderr;
      isError = true;
    }
    return { result, isError };
  }

  @OnEvent(JobsEvent.DELETED, { async: true })
  async deleteJob(job: JobsEntity): Promise<void> {
    /* TODO: IMPLEMENTASIKAN INI */
  }
}

export default JobsService;
