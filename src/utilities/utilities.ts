import jwt, { Secret } from "jsonwebtoken"
import { Request } from "express";
import { User } from "../models/users";
import { Product } from "../models/product";

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
    const decoded: tokenPayload = jwt.verify(token as string, process.env.TOKEN_SECRET as Secret) as tokenPayload
    return decoded.user
}

export const calculateTotalForOrder = (products: {
    id: number,
    price: number,
    name: string,
    category: string,
    quantity: number
}[]): number => {
    return products.reduce((acc, curr) => acc + curr.price*curr.quantity, 0)
}