const initialAdminOptions: {
  username: string;
  password: string;
} = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};

export default initialAdminOptions;
