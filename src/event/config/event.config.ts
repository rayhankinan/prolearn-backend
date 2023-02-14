import { EventEmitterModuleOptions } from '@nestjs/event-emitter/dist/interfaces';

const eventOptions: EventEmitterModuleOptions = {
  wildcard: true,
  delimiter: '.',
  newListener: false,
  removeListener: false,
  maxListeners: 10,
  verboseMemoryLeak: false,
  ignoreErrors: false,
};

export default eventOptions;
