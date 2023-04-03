import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
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
        `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "mkdir -p ${codeDirPath};mkdir -p ${inputDirPath};mkdir -p ${outputDirPath}"`,
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

    const codeFileName = `${uuidv4()}.${extension}`;
    const codeFilePath = join(codeDirPath, codeFileName);
    const cleanedCode = code.replace(/"/g, '\\"').replace(/'/g, "\\'");

    await execProm(
      `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "touch ${codeFilePath} ; echo '${cleanedCode}' > ${codeFilePath}"`,
    );

    if (input) {
      const inputFileName = `${uuidv4()}.txt`;
      const inputFilePath = join(inputDirPath, inputFileName);
      const cleanedInput = input.replace(/"/g, '\\"').replace(/'/g, "\\'");
      await execProm(
        `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "touch ${inputFilePath} ; echo '${cleanedInput}' > ${inputFilePath}"`,
      );

      await this.eventEmitter.emitAsync(
        JobsEvent.CREATED,
        job,
        codeFilePath,
        inputFilePath,
      );
    } else {
      await this.eventEmitter.emitAsync(JobsEvent.CREATED, job, codeFilePath);
    }

    return await this.jobsRepository.save(job);
  }

  /* Execute C++ */
  async executeCpp(
    codeFilePath: string,
    outputFileName: string,
    inputFilePath?: string,
  ): Promise<{ result: string; isError: boolean }> {
    const { hostname, username, timeout } = sshConfig;
    const { outputDirPath } = mountConfig[ExtensionType.CPP];
    const outFilePath = join(outputDirPath, `${outputFileName}`);

    let isError = false;
    let result: string;

    try {
      if (inputFilePath) {
        const p = await execProm(
          `timeout ${timeout} sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "g++ ${codeFilePath} -o ${outFilePath} ; cd ${outputDirPath} ; ./${outputFileName} < ${inputFilePath}"`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `timeout ${timeout} sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "g++ ${codeFilePath} -o ${outFilePath} ; cd ${outputDirPath} ; ./${outputFileName}"`,
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
    codeFilePath: string,
    outputFileName: string,
    inputFilePath?: string,
  ): Promise<{ result: string; isError: boolean }> {
    const { hostname, username, timeout } = sshConfig;
    const { outputDirPath } = mountConfig[ExtensionType.C];
    const outFilePath = join(outputDirPath, `${outputFileName}`);

    let isError = false;
    let result: string;

    try {
      if (inputFilePath) {
        const p = await execProm(
          `timeout ${timeout} sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "gcc ${codeFilePath} -o ${outFilePath} ; cd ${outputDirPath} ; ./${outputFileName} < ${inputFilePath}"`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `timeout ${timeout} sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "gcc ${codeFilePath} -o ${outFilePath} ; cd ${outputDirPath} ; ./${outputFileName}"`,
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
    codeFilePath: string,
    inputFilePath?: string,
  ): Promise<{ result: string; isError: boolean }> {
    const { hostname, username, timeout } = sshConfig;

    let isError = false;
    let result: string;

    try {
      if (inputFilePath) {
        const p = await execProm(
          `timeout ${timeout} sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "python3 ${codeFilePath} < ${inputFilePath}"`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `timeout ${timeout} sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "python3 ${codeFilePath}"`,
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
    codeFilePath: string,
    inputFilePath?: string,
  ): Promise<{ result: string; isError: boolean }> {
    const { hostname, username, timeout } = sshConfig;

    let isError = false;
    let result: string;

    try {
      if (inputFilePath) {
        const p = await execProm(
          `timeout ${timeout} sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "node ${codeFilePath} < ${inputFilePath}"`,
        );
        result = p.stdout;
      } else {
        const p = await execProm(
          `timeout ${timeout} sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "node ${codeFilePath}"`,
        );
        result = p.stdout;
      }
    } catch (error) {
      result = error.stderr as string;
      isError = true;
    }

    return { result, isError };
  }

  @OnEvent(JobsEvent.CREATED, { async: true })
  async startJob(
    job: JobsEntity,
    codeFilePath: string,
    inputFilePath?: string,
  ): Promise<void> {
    const outputFileName = uuidv4();
    let output: { result: string; isError: boolean };

    job.startAt = new Date();

    switch (job.extension) {
      case ExtensionType.CPP:
        output = await this.executeCpp(
          codeFilePath,
          outputFileName,
          inputFilePath,
        );
        break;
      case ExtensionType.C:
        output = await this.executeC(
          codeFilePath,
          outputFileName,
          inputFilePath,
        );
        break;
      case ExtensionType.PYTHON:
        output = await this.executePy(codeFilePath, inputFilePath);
        break;
      case ExtensionType.JAVASCRIPT:
        output = await this.executeJs(codeFilePath, inputFilePath);
        break;
      default:
        throw new Error('Invalid Extension');
    }

    job.endAt = new Date();
    job.output = output.result;
    job.status = output.isError ? StatusType.FAILED : StatusType.SUCCESS;

    await this.eventEmitter.emitAsync(
      JobsEvent.DELETED,
      job,
      codeFilePath,
      outputFileName,
      inputFilePath,
    );
  }

  @OnEvent(JobsEvent.DELETED, { async: true })
  async deleteJob(
    job: JobsEntity,
    codeFilePath: string,
    outputFileName: string,
    inputFilePath?: string,
  ): Promise<void> {
    const { hostname, username } = sshConfig;

    const { outputDirPath } = mountConfig[job.extension];
    const outFilePath = join(outputDirPath, `${outputFileName}`);

    await execProm(
      `sshpass -e ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "LogLevel=ERROR" ${username}@${hostname} "rm -rf ${codeFilePath} ; rm -rf ${outFilePath} ; rm -rf ${inputFilePath}"`,
    );

    await this.jobsRepository.save(job);
  }
}

export default JobsService;
