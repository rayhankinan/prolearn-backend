import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import sshConfig from '@jobs/config/ssh.config';
import mountConfig from '@jobs/config/mount.config';
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

  async onModuleInit() {
    for (const extension in ExtensionType) {
      const { codeDirPath, inputDirPath, outputDirPath } =
        mountConfig[ExtensionType[extension]];
      const { hostname, username } = sshConfig;
      await execProm(
        `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "mkdir -p ${codeDirPath};mkdir -p ${inputDirPath};mkdir -p ${outputDirPath}"`,
      );
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
    const { codeDirPath, inputDirPath } = mountConfig[extension];
    const { hostname, username } = sshConfig;

    const job = new JobsEntity();
    job.extension = extension;

    const codeFileName = `${Date.now()}.${extension}`;
    const codeFilePath = join(codeDirPath, codeFileName);
    await execProm(
      `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "touch ${codeFilePath} ; echo '${code}' > ${codeFilePath}"`,
    );

    job.codePath = codeFilePath;

    if (input) {
      const inputFileName = `${Date.now()}.txt`;
      const inputFilePath = join(inputDirPath, inputFileName);
      await execProm(
        `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "touch ${inputFilePath} ; echo '${input}' > ${inputFilePath}"`,
      );

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
  async executeCpp(
    job: JobsEntity,
  ): Promise<{ result: string; isError: boolean }> {
    const { outputDirPath } = mountConfig[job.extension];
    const { hostname, username } = sshConfig;
    const outPath = join(outputDirPath, `${job.id}`);

    let isError = false;
    let result: string;

    try {
      if (job.inputPath) {
        const p = await execProm(
          `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "g++ ${job.codePath} -o ${outPath} ; cd ${outputDirPath} ; ./${job.id} < ${job.inputPath}"`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "g++ ${job.codePath} -o ${outPath} ; cd ${outputDirPath} ; ./${job.id}"`,
        );
        result = p.stdout;
      }
    } catch (error) {
      result = error.stderr as string;
      isError = true;
    }

    return { result, isError };
  }

  /* Execute C */
  async executeC(
    job: JobsEntity,
  ): Promise<{ result: string; isError: boolean }> {
    const { outputDirPath } = mountConfig[job.extension];
    const { hostname, username } = sshConfig;
    const outPath = join(outputDirPath, `${job.id}`);

    let isError = false;
    let result: string;

    try {
      if (job.inputPath) {
        const p = await execProm(
          `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "gcc ${job.codePath} -o ${outPath} ; cd ${outputDirPath} ; ./${job.id} < ${job.inputPath}"`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "gcc ${job.codePath} -o ${outPath} ; cd ${outputDirPath} ; ./${job.id}"`,
        );
        result = p.stdout;
      }
    } catch (error) {
      result = error.stderr as string;
      isError = true;
    }

    return { result, isError };
  }

  /* Execute Python */
  async executePy(
    job: JobsEntity,
  ): Promise<{ result: string; isError: boolean }> {
    const { hostname, username } = sshConfig;

    let isError = false;
    let result: string;

    try {
      if (job.inputPath) {
        const p = await execProm(
          `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "python3 ${job.codePath} < ${job.inputPath}"`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "python3 ${job.codePath}"`,
        );
        result = p.stdout;
      }
    } catch (error) {
      result = error.stderr as string;
      isError = true;
    }

    return { result, isError };
  }

  /* Execute JavaScript */
  async executeJs(
    job: JobsEntity,
  ): Promise<{ result: string; isError: boolean }> {
    const { hostname, username } = sshConfig;

    let isError = false;
    let result: string;

    try {
      if (job.inputPath) {
        const p = await execProm(
          `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "node ${job.codePath} < ${job.inputPath}"`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${username}@${hostname} "node ${job.codePath}"`,
        );
        result = p.stdout;
      }
    } catch (error) {
      result = error.stderr as string;
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
