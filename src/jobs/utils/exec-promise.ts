import { exec } from 'child_process';
import { promisify } from 'util';

const execProm = promisify(exec);

export default execProm;
