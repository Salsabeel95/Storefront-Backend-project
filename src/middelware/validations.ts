import { NextFunction, Request, Response } from "express";
export const validateUserInfo = (req: Request, res: Response, next: NextFunction) => {
    const firstname = req.body.firstname as string
    const password = req.body.password as string
    if (!firstname || !password) {
        res.status(403).json({ data: {}, message: "Must provide firstname and password" })
    }
    else next()
}