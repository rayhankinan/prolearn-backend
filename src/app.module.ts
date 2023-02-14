import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import CategoryModule from '@category/category.module';

/* TODO: ADD CACHING LAYER */

@Module({
  imports: [EventEmitterModule.forRoot(), CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
