import { NextFunction, Request, Response } from "express";
export const validateUserInfo = (req: Request, res: Response, next: NextFunction) => {
    const firstname = req.body.firstname
    const password = req.body.password 
    if (!firstname || !password) {
        res.status(403).json({ data: {}, message: "Must provide firstname and password" })
    }
    else next()
}
export const validatProductInfo = (req: Request, res: Response, next: NextFunction) => {
    const name  = req.body.name 
    const price = req.body.price
    if (!name || !price ) {
        res.status(403).json({ data: {}, message: "Must provide name and price" })
    }
    else next()
}