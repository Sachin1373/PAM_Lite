import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from "../modules/user/user.routes";
import applicationRoutes from "../modules/applications/application.routes";

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/application', applicationRoutes);

export default router;
