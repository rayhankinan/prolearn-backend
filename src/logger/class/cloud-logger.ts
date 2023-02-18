import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
class CloudLogger extends ConsoleLogger {
  /* TODO: Ubah behaviour logger disini untuk melakukan logging di GCP */
}

export default CloudLogger;
