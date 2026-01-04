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

export const validateSession = async (req: Request, res: Response) => {
  // console.log("golang req :", req)
  try {
    let token = req.query.token as string;
    if (!token && req.body.token) {
      token = req.body.token;
    }

    console.log(`validateSession: Received token (len=${token?.length || 0}):`, token);

    if (!token) {
      return res.status(400).json({ error: "Session token is required" });
    }

    const session = await service.validateSessionService(token);
    console.log("validateSession: Service result:", session ? "Valid" : "Invalid");

    if (!session) {
      return res.status(401).json({ error: "invalid or expired Session token" });
    }

    // Session valid → respond with user info or success
    console.log("sending sessiondata to go :", session)
    return res.status(200).json({ status: "ok", session: session });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
};
