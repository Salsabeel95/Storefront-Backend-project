import { NextFunction, Request, Response } from "express";
export const validateUserInfo = (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email
    const password = req.body.password 
    if (!email || !password) {
        res.status(403).json({ data: {}, message: "Must provide email and password" })
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