import { Request, Response, NextFunction } from "express";
import { ROLES } from "../constants";


export const authorize =
  (...allowedRoles: ROLES[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
};