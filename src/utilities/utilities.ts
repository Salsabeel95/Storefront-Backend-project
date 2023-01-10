import jwt, { Secret } from "jsonwebtoken"
import { Request } from "express";
import { productsInOrder } from "../models/order";
import config from "./config";

type tokenPayload = {
    user: {
        id: number;
        email: string;
        role: string;
    };
    iat: number;
};
export const decodedToken = (req: Request): {
    id: number;
    email: string;
    role: string;
} => {
    const authorizationHeader: string | undefined = req.headers.authorization
    const token: string | undefined = authorizationHeader?.split(' ')[1]
    const decoded: tokenPayload = jwt.verify(token as string, config.TOKEN_SECRET as Secret) as tokenPayload
    return decoded.user
}

export const calculateTotalForOrder = (products: productsInOrder[]): number => {
    return products.reduce((acc, curr) => acc + curr.price*curr.quantity, 0)
}