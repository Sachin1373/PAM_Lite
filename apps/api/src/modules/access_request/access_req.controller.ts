import * as service from './access_req.service';
import { Request, Response } from 'express';


export const createAccessRequestController = async (req: Request, res: Response) => {
    try {
        const result = await service.createAccessRequestService({ creator: req.user, payload: req.body });
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}


export const getAccessRequestsController = async (req: Request, res: Response) => {
    try {
        const result = await service.getAccessRequestsService({ actor: req.user });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const approveAccessRequestController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await service.approveAccessRequestService({
            actor: req.user,
            access_request_id: id
        });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const getUserAccessRequestsController = async (req: Request, res: Response) => {
    try {
        const result = await service.getUserAccessRequestsService({ actor: req.user });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
