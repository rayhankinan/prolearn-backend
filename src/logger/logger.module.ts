import { Module } from '@nestjs/common';
import CloudLogger from '@logger/class/cloud-logger';

@Module({
  providers: [CloudLogger],
  exports: [CloudLogger],
})
class LoggerModule {}

export default LoggerModule;
