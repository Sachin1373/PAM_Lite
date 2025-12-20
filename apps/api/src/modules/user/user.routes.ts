import { Router } from 'express';
import { addUserController, getUsersController } from './user.controller';
import { verify } from '../../middlewares/verify';

const router = Router();

router.post('/create', verify, addUserController);
router.get('/getusers', verify, getUsersController)

export default router;