import { Router } from 'express';
import { addUserController, getUsersController, updateUserController, deleteUserController } from './user.controller';
import { verify } from '../../middlewares/verify';

const router = Router();

router.post('/create', verify, addUserController);
router.get('/getusers', verify, getUsersController);
router.put('/update/:id', verify, updateUserController);
router.delete('/delete/:id', verify, deleteUserController);

export default router;