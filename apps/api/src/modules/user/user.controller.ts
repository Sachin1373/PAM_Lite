import * as service from "./user.service";
import { Request, Response } from "express";

export const addUserController = async (req: Request, res: Response) => {
  try {
    const result = await service.addUserService({ actor: req.user, payload: req.body });
    res.status(201).json(result.user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


export const getUsersController = async (req: Request, res: Response) => {
  try {
    const result = await service.getUserService(req.user?.tenantId)
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await service.updateUserService(req.user, id, req.body);
    res.status(200).json(result.user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.deleteUserService(req.user, id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};