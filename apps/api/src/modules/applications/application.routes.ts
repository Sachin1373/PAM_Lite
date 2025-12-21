import { Router } from "express";
import { addApplicationController, getApplicationsController, updateApplicationController, deleteApplicationController } from "./application.controller";
import { verify } from "../../middlewares/verify.middleware";
import { authorize } from "../../middlewares/authorize.middleware";
import { ROLES } from "../../constants";

import { validate } from "../../middlewares/validate.middleware";
import { createApplicationSchema, updateApplicationSchema } from "../../validations/application.schema";

const router = Router();

router.post('/create', verify, authorize(ROLES.ADMIN), validate(createApplicationSchema), addApplicationController);
router.get('/list', verify, authorize(ROLES.ADMIN, ROLES.APPROVER), getApplicationsController);
router.put('/update/:id', verify, authorize(ROLES.ADMIN), validate(updateApplicationSchema), updateApplicationController);
router.delete('/delete/:id', verify, authorize(ROLES.ADMIN), deleteApplicationController);

export default router;