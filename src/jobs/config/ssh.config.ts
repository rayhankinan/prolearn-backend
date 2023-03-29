const sshConfig: {
  hostname: string;
  username: string;
} = {
  hostname: process.env.SSHHOST,
  username: process.env.SSHUSER,
};

export default sshConfig;
