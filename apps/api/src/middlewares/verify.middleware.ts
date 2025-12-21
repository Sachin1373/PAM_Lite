import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config";


declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verify = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
     return res.status(401).json({ message: 'Invalid Authorization format' });
    }

    try {
        const decode = jwt.verify(
            token,
            config.auth.jwtSecret
        )
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

}