import Payload from '@auth/type/payload';

type AuthRequest = Request & { payload: Payload };

export default AuthRequest;
