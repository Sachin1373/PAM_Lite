import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from "../modules/user/user.routes";
import applicationRoutes from "../modules/applications/application.routes";
import accessRequestRoutes from "../modules/access_request/access_req.routes";

import sessionRoutes from "../modules/sessions/session.routes";

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/application', applicationRoutes);
router.use('/access-req', accessRequestRoutes)
router.use('/session', sessionRoutes)

export default router;
