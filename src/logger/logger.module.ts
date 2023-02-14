import { Module } from '@nestjs/common';
import loggerProviders from '@logger/providers/logger.provider';

@Module({
  providers: [...loggerProviders],
  exports: [...loggerProviders],
})
class LoggerModule {}

export default LoggerModule;
