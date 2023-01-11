import jwt, { Secret } from "jsonwebtoken"
import { Request } from "express";
import { productsInOrder } from "../models/order";
import config from "./config";
import client from "../database";

export type tokenPayload = {
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


export const truncateOrdersTable=async():Promise<void>=>{
  try {
      const conn = await client.connect()
      const sql = `DELETE FROM orders`
       await conn.query(sql)
      conn.release()
    } catch (err) {
      throw new Error(`Could not delete orders. ${err}`)
    }
}
export const truncateProductsTable=async():Promise<void>=>{
  try {
      const conn = await client.connect()
      const sql = `DELETE FROM products`
       await conn.query(sql)
      conn.release()
    } catch (err) {
      throw new Error(`Could not delete products. ${err}`)
    }
}
export const truncateUsersTable=async():Promise<void>=>{
  try {
      const conn = await client.connect()
      const sql = `DELETE FROM users`
       await conn.query(sql)
      conn.release()
    } catch (err) {
      throw new Error(`Could not delete users. ${err}`)
    }
}