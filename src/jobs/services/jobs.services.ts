import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { exec } from 'child_process';
import * as util from 'util';
import JobsEntity from '@jobs/models/jobs.model';
import CloudLogger from '@logger/class/cloud-logger';
import EXTENSION from '@jobs/enum/extension.enum';
import STATUS from '@jobs/enum/status.enum';

const execProm = util.promisify(exec);

const codeDirPath = join(__dirname, 'codes');
const outputDirPath = join(__dirname, 'outputs');
const inputDirPath = join(__dirname, 'inputs');

if (!existsSync(outputDirPath)) {
  mkdirSync(outputDirPath, { recursive: true });
}
if (!existsSync(codeDirPath)) {
  mkdirSync(codeDirPath, { recursive: true });
}
if (!existsSync(inputDirPath)) {
  mkdirSync(inputDirPath, { recursive: true });
}

@Injectable()
export class JobsService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(JobsEntity)
    private readonly jobsRepository: Repository<JobsEntity>,
  ) {
    this.cloudLogger = new CloudLogger(JobsEntity.name);
  }

  async getAllJobs(): Promise<JobsEntity[]> {
    return await this.jobsRepository.find();
  }

  async getJobById(id: number): Promise<JobsEntity> {
    return await this.jobsRepository.findOne(
      { where: { id } },
    )
  }

  async createJob(
    extension: EXTENSION,
    code: string,
    input: string,
  ): Promise<JobsEntity> {
    const job = new JobsEntity();
    job.extension = extension;

    // create code file and save do codeDirPath
    const codeFileName = `${Date.now()}.${extension}`;
    const codeFilePath = join(codeDirPath, codeFileName);
    writeFileSync(codeFilePath, code);

    let inputFilePath = '';
    if (input) {
      const inputFileName = `${Date.now()}.txt`;
      inputFilePath = join(inputDirPath, inputFileName);
      writeFileSync(inputFilePath, input);
    }

    job.codePath = codeFilePath;
    job.inputPath = inputFilePath;

    return await this.jobsRepository.save(job);
  }

  async startJob(job: JobsEntity): Promise<JobsEntity> {
    job.startAt = new Date();
    let output: { result: string; isError: boolean };

    if (job.extension === 'cpp') {
      output = await this.executeCpp(job);
    } else if (job.extension === 'c') {
      output = await this.executeC(job);
    } else if (job.extension === 'py') {
      output = await this.executePy(job);
    } else if (job.extension === 'js') {
      output = await this.executeJs(job);
    }

    job.endAt = new Date();
    job.output = output.result;
    if (output.isError) job.status = STATUS.FAILED;
    else job.status = STATUS.SUCCESS;

    return await this.updateJob(job);
  }

  async updateJob(job: JobsEntity): Promise<JobsEntity> {
    return await this.jobsRepository.save(job);
  }

  async executeCpp(job: JobsEntity): Promise<{ result: string; isError: boolean }> {
    const jobId = job.id;
    const outPath = join(outputDirPath, `${jobId}`);
    let isError = false;
    let result;
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

  async executeC(job: JobsEntity): Promise<{ result: string; isError: boolean }> {
    const jobId = job.id;
    const outPath = join(outputDirPath, `${jobId}`);
    let isError = false;
    let result;
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

  async executePy(job: JobsEntity): Promise<{ result: string; isError: boolean }> {
    let isError = false;
    let result;
    try {
      if (job.inputPath) {
        const p = await execProm(
          `python3 ${job.codePath} < ${job.inputPath}`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `python3 ${job.codePath}`,
        );
        result = p.stdout;
      }
    } catch (ex) {
      result = ex.stderr;
      isError = true;
    }
    return { result, isError };
  }

  async executeJs(job: JobsEntity): Promise<{ result: string; isError: boolean }> {
    let isError = false;
    let result;
    try {
      if (job.inputPath) {
        const p = await execProm(
          `node ${job.codePath} < ${job.inputPath}`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `node ${job.codePath}`,
        );
        result = p.stdout;
      }
    } catch (ex) {
      result = ex.stderr;
      isError = true;
    }
    return { result, isError };
  }
}
