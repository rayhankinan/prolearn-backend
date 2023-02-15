import { Module } from '@nestjs/common';
import ResponseService from './services/response.service';

@Module({
  providers: [ResponseService],
  exports: [ResponseService],
})
class ResponseModule {}

export default ResponseModule;
