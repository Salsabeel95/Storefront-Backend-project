import express, { Request, Response } from "express";
import { Order, OrderModel, productsInOrder } from "../models/order";
import { verifyAuthToken, verifyAuthAdminRole } from "../middelware/AuthToken";
import { validatUserIdInOrder, validatOrderProductsInfo,  validationErrors } from "../middelware/validations";
import { calculateTotalForOrder, decodedToken } from "../utilities/utilities";
import { check } from "express-validator";

const index = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data: Order[] = await OrderModel.index()
        data.length > 0 && res.status(200).json({ data: data, message: "got orders" })
        data.length <= 0 && res.status(404).json({ data: [], message: "orders is empty !" })
    } catch (error) {
        res.status(500).json({ message: "can't get orders !" + error })
    }
}

const create = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.body.userId
    try {
            const isTherePendingOrder = await OrderModel.checkIfUserHasPendingOrder(userId)
            if (isTherePendingOrder) {
                res.status(403).json({ data: {}, message: "Could not create new order before delivering user current order" })
            } else {
                const data: Order = await OrderModel.create(userId)
                data && res.status(200).json({ data: data, message: "created Order with id=" + data.id })
                !data && res.status(404).json({ data: {}, message: "can't create Order with user id=" + userId })
            }

    } catch (error) {
        res.status(500).json({ message: "can't craete Order! " + error })
    }
}
const addToOrder = async (req: Request, res: Response): Promise<void> => {
    const productId: string = req.body.productId
    const orderId: string = req.params.id
    const quantity: number = req.body.quantity
    try {
        const data: {
            id: number;
            order_id: number;
        product_id: number;
        quantity: number;
        } = await OrderModel.addProduct(orderId, productId, quantity)
        data && res.status(200).json({ data: data, message: "created order with that product with id=" + data.id })
        !data && res.status(404).json({ data: {}, message: "can't create order with product id=" + productId })

    } catch (error) {
        res.status(500).json({ message: "can't add this product to your order! " + error })
    }
}
const deliverOrder = async (req: Request, res: Response): Promise<void> => {
    const orderId: string | undefined = req.params.id
    try {
            const data: Order = await OrderModel.deliverOrder(orderId)
            data && res.status(200).json({ data, message: "order id=" + orderId + " has been delivered" })
            !data && res.status(404).json({ data: {}, message: "Couldn't deliver order with id=" + orderId })
       
    } catch (error) {
        res.status(500).json({ message: "can't get order products in this order! " + error })
    }
}
const showOrderProducts = async (req: Request, res: Response): Promise<void> => {
    const orderId: string = req.params.id
    try {
            const products: productsInOrder[] = await OrderModel.indexProducts(orderId)
            if (products.length) {
                const user = decodedToken(req);
                const total = calculateTotalForOrder(products)
                const resData = { user_id: user.id, order_id: +orderId, products, total }
                res.status(200).json({ data: resData, message: "got order products with id=" + orderId })
            }
            else res.status(404).json({ data: {}, message: "There are no products in order with id=" + orderId })
    } catch (error) {
        res.status(500).json({ message: "can't get order products in this order! " + error })
    }
}
const showByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.params.id
    try {
        const order = await OrderModel.showUserCurrentOrder(userId)
        const products: productsInOrder[] = await OrderModel.indexProducts(order.id as unknown as string)
        if (order && products.length) {
            const total = calculateTotalForOrder(products)
            const resData = { ...order, products, total }
            res.status(200).json({ data: resData, message: "got order products for user id=" + userId })
        }
        else res.status(404).json({ data: {}, message: "There are no orders or products for user id=" + userId })
    } catch (error) {
        res.status(500).json({ message: "can't current order! " + error })
    }
}
const showCompletedByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.params.id
    try {
        const orders = await OrderModel.showUserCompletedOrders(userId)
        if (orders.length) {
            const completedOrders = orders.map(async ord => {
                const products: productsInOrder[] = await OrderModel.indexProducts(ord.id as unknown as string)
                const total = calculateTotalForOrder(products)
                return { ...ord, products, total }
            })
            res.status(200).json({ data: await Promise.all(completedOrders), message: "got order products for user id=" + userId })
        }
        else res.status(404).json({ data: [], message: "There are no completed orders for user id=" + userId })

    } catch (error) {
        res.status(500).json({ message: "can't current order! " + error })
    }
}

const destroy = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id as string
    try {
            const data: Order = await OrderModel.delete(id)
            data && res.status(200).json({ data: data, message: "deleted order with id=" + id })
            !data && res.status(404).json({ data: {}, message: "can't delete order with id=" + id })
    } catch (error) {
        res.status(500).json({ message: "can't delete orders!" + error })
    }
}
const orderRoutes = (app: express.Application) => {
    app.get('/order', index)
    app.get('/user/:id/order',verifyAuthToken,check('id').notEmpty().withMessage("Must provide a user id"), validationErrors, showByUserId)
    app.get('/user/:id/order-completed',verifyAuthToken,  check('id').notEmpty().withMessage("Must provide a user id"), validationErrors, showCompletedByUserId)
    app.post('/order/add', verifyAuthToken,  check('userId').notEmpty().withMessage("Must provide a user id"), validationErrors, create)
    app.post('/order/:id/products', verifyAuthToken,check('id').notEmpty().withMessage("Must provide a order id"), check('productId').notEmpty().withMessage("Must provide a product id"), check('quantity').notEmpty().withMessage("Must provide a product quantity"), validationErrors, addToOrder)
    app.get('/order/:id/products', verifyAuthToken,check('id').notEmpty().withMessage("Must provide a order id to show products in"),validationErrors, showOrderProducts)
    app.put('/order/:id', verifyAuthAdminRole,check('id').notEmpty().withMessage("Must provide a order id to deliver it"),validationErrors, deliverOrder)
    app.delete('/order', verifyAuthAdminRole,check('id').notEmpty().withMessage("Must provide a order id"),validationErrors, destroy)
}
export default orderRoutes;