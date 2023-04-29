const sshConfig: {
  hostname: string;
  username: string;
  timeout: number;
  port: number;
} = {
  hostname: process.env.SSHHOST,
  username: process.env.SSHUSER,
  timeout: +process.env.SSHTIMEOUT,
  port: +process.env.SSHPORT,
};

export default sshConfig;
