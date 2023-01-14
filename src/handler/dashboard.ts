import express, { Request, Response } from "express";
import { verifyAuthAdminRole } from "../middelware/AuthToken";
import { Product } from "../models/product";
import { DashboardModel } from "../services/dashboard";

const mostPopular5Products = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data:{product_id:string,count:string}[] = await DashboardModel.popular5Products()
        data.length > 0 && res.status(200).json({ data: data, message: "got most 5 popular products" })
        data.length <= 0 && res.status(404).json({ data: [], message: "there is no products ordered yet !" })
    } catch (error) {
        res.status(500).json({ message: "can't get most 5 popular products !" + error })
    }
}
const mostPopular3category = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data:{category: string,rank: string}[] = await DashboardModel.popular3Category()
        data.length > 0 && res.status(200).json({ data: data, message: "got most 3 popular category" })
        data.length <= 0 && res.status(404).json({ data: [], message: "there is no category yet !" })
    } catch (error) {
        res.status(500).json({ message: "can't get most 3 popular category !" + error })
    }
}
const most3UsersOrdering = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data:{user_id: number,orders_count: string}[] = await DashboardModel.most3UsersOrders()
        data.length > 0 && res.status(200).json({ data: data, message: "got most 3 users made orders" })
        data.length <= 0 && res.status(404).json({ data: [], message: "there is no orders yet !" })
    } catch (error) {
        res.status(500).json({ message: "can't get most 3 users made orders !" + error })
    }
}
const showOrdersNumber = async (req: Request, res: Response): Promise<void> => {
    const days =req.query.days  as unknown as number || 0
    try {
        const data:{count: string} = await DashboardModel.staticsNumOrdersInLastDays(days)
        data.count  && res.status(200).json({ data: data, message: "got no. orders for "+(days!=0?"the last "+days+" days":'today') })
        !data.count  && res.status(404).json({ data: [], message: "there is orders !" })
    } catch (error) {
        res.status(500).json({ message: "can't get no orders for "+(days!=0?"the last "+days+" days":'today')+" !" + error })
    }
}
const showOrdersTotalIncome = async (req: Request, res: Response): Promise<void> => {
    const days =req.query.days  as unknown as number || 0
    try {
        const data:{total: string} = await DashboardModel.staticsTotalIncomeInLastDays(days)
        data.total  && res.status(200).json({ data: data, message: "got total income for "+(days!=0?"the last "+days+" days":'today') })
        !data.total && res.status(404).json({ data: [], message: "there is no income yet !" })
    } catch (error) {
        res.status(500).json({ message: "can't get total income for "+(days!=0?"the last "+days+" days":'today')+" !" + error })
    }
}

const dashboardRoutes = (app: express.Application) => {
    app.get('/products/top5',verifyAuthAdminRole, mostPopular5Products)
    app.get('/categories/top3',verifyAuthAdminRole, mostPopular3category)
    app.get('/users/top3',verifyAuthAdminRole, most3UsersOrdering)
    app.get('/statics/orders/',verifyAuthAdminRole, showOrdersNumber)
    app.get('/statics/income/',verifyAuthAdminRole, showOrdersTotalIncome)
}
export default dashboardRoutes;