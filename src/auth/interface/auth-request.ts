import Payload from '@auth/type/payload';

type AuthRequest = Request & { user: Payload };

export default AuthRequest;
