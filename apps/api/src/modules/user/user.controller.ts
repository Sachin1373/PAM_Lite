import * as service from "./user.service";
import { Request, Response } from "express";

export const addUserController = async(req: Request, res: Response) => {
   try {
     const result = await service.addUserService({actor: req.user, payload:req.body});
     res.status(201).json(result.user);
   } catch (error: any) {
     res.status(400).json({ error: error.message });
   }
}

export const getUsersController = async(req: Request, res: Response) => {
    try {
        const result = await service.getUserService(req.user?.tenantId)
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}