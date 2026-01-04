import { Router } from "express";
import { createSessionController, validateSession } from "./session.controller";
import { verify } from "../../middlewares/verify.middleware";

const router = Router();

router.post('/create', verify, createSessionController);
router.post('/validate', validateSession)

export default router;
