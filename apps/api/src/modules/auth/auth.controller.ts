import { Request, Response } from "express";
import * as service from './auth.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await service.register(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await service.login(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

