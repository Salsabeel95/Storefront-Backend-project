import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";
export const  validationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array().map(err=>err.msg).join(" ,") });
      }
    else next()
}
export const validatUserIdInOrder = (req: Request, res: Response, next: NextFunction) => {
    const userId  = req.body.userId 
    if (!userId ) {
        res.status(403).json({ data: {}, message: "Must provide user id whome order belongs to" })
    }
    else next()
}
export const validatOrderProductsInfo = (req: Request, res: Response, next: NextFunction) => {
    const productId :number= req.body.productId 
    const orderId :number = req.params.id as unknown as number 
    const quantity :string = req.body.quantity  
        if (!productId || !orderId || !quantity) {
        res.status(403).json({ data: {}, message: "Must provide order id , product id to add and its quantity" })
    }
    else next()
}