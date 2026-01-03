import { Request, Response } from 'express';
import * as service from './session.service';

export const createSessionController = async (req: Request, res: Response) => {
    try {
        // userId and tenantId from authenticated token (req.user)
        const { userId, tenantId } = req.user;
        const payload = req.body;

        const session = await service.createSessionService(userId, tenantId, payload);
        res.status(201).json(session);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
