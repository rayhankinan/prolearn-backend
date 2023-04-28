const sshConfig: {
  hostname: string;
  username: string;
  timeout: string;
} = {
  hostname: process.env.SSHHOST,
  username: process.env.SSHUSER,
  timeout: process.env.SSHTIMEOUT,
};

export default sshConfig;
