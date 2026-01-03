import * as service from './application.service';
import { Request, Response } from 'express';


export const addApplicationController = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const result = await service.addApplicationService({ creator: req.user, payload: req.body });
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const getApplicationsController = async (req: Request, res: Response) => {
    try {
        const result = await service.getApplicationsService(req.user);
        res.status(200).json(result.applications);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateApplicationController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await service.updateApplicationService(req.user, id, req.body);
        res.status(200).json(result.application);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteApplicationController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await service.deleteApplicationService(req.user, id);
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};