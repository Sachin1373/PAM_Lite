import { Router } from "express";
import { createSessionController } from "./session.controller";
import { verify } from "../../middlewares/verify.middleware";

const router = Router();

router.post('/create', verify, createSessionController);

export default router;
