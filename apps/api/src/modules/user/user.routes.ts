import { Router } from 'express';
import { addUserController, getUsersController, updateUserController, deleteUserController } from './user.controller';
import { verify } from '../../middlewares/verify.middleware';
import { authorize } from '../../middlewares/authorize.middleware';
import { ROLES } from '../../constants';
import { validate } from '../../middlewares/validate.middleware';
import { createUserSchema, updateUserSchema } from '../../validations/user.schema';

const router = Router();

router.post('/create', verify, authorize(ROLES.ADMIN), validate(createUserSchema), addUserController);
router.get('/getusers', verify, authorize(ROLES.ADMIN, ROLES.APPROVER), getUsersController);
router.put('/update/:id', verify, authorize(ROLES.ADMIN), validate(updateUserSchema), updateUserController);
router.delete('/delete/:id', verify, authorize(ROLES.ADMIN), deleteUserController);

export default router;