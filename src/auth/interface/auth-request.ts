import UserEntity from '@user/models/user.model';

type AuthRequest = Request & { user: UserEntity };

export default AuthRequest;
