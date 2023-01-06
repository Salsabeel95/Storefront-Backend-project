import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken"
type tokenPayload = {
    user: {
      id: number;
      firstName: string;
      role: string;
    };
    iat: number;
  };
export const verifyAuthToken = (req: Request, res: Response, next:NextFunction) => {
    try {
        const authorizationHeader: string |undefined  = req.headers.authorization
        const token : string |undefined  = authorizationHeader?.split(' ')[1]
        const decoded :tokenPayload = jwt.verify(token as string, process.env.TOKEN_SECRET as Secret) as tokenPayload
       decoded && next()       
    } catch (error) {
        res.status(401).json({message:"Access denied, must login or have account first"})
    }
}
export const verifyAuthAdminRole = (req: Request, res: Response, next:NextFunction) => {
    try {
        const authorizationHeader: string |undefined  = req.headers.authorization
        const token : string |undefined  = authorizationHeader?.split(' ')[1]
       const decoded :tokenPayload= jwt.verify(token as string, process.env.TOKEN_SECRET as Secret) as tokenPayload
       if( decoded.user.role=="admin") next()
       else res.status(401).json({message:"Access denied, not authorized you must be an admin"})
      
    } catch (error) {
        res.status(401).json({message:"Access denied, not authorized you must be an admin"})
    }
} 