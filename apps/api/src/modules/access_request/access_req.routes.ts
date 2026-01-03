import { Router } from "express";
import { createAccessRequestController, getAccessRequestsController, approveAccessRequestController, getUserAccessRequestsController } from "./access_req.controller";
import { verify } from "../../middlewares/verify.middleware";
import { authorize } from "../../middlewares/authorize.middleware";
import { ROLES } from "../../constants";

const router = Router();

router.post('/create', verify, authorize(ROLES.USER), createAccessRequestController);
router.get('/', verify, authorize(ROLES.USER, ROLES.APPROVER), getAccessRequestsController);
router.get('/my-requests', verify, authorize(ROLES.USER), getUserAccessRequestsController);
router.patch('/:id/approve', verify, authorize(ROLES.APPROVER), approveAccessRequestController);

export default router;