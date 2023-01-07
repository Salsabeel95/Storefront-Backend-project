import express, { Request, Response } from "express";
import { Product, ProductModel } from "../models/product";
import { verifyAuthToken, verifyAuthAdminRole } from "../middelware/AuthToken";
import { validatProductInfo } from "../middelware/validations";


const index = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data: Product[] = await ProductModel.index()
        data.length > 0 && res.status(200).json({ data: data, message: "got Products" })
        data.length <= 0 && res.status(404).json({ data: [], message: "Products is empty !" })
    } catch (error) {
        res.status(500).json({ message: "can't get Products !" + error })
    }
}
const show = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string
    try {
        const data: Product | null = await ProductModel.show(id)
        data && res.status(200).json({ data: data, message: "got product" })
        !data && res.status(404).json({ data: [], message: "There is no product with id=" + id + " !" })
    } catch (error) {
        res.status(500).json({ message: "can't get products !" + error })
    }
}
const showByCategory = async (req: Request, res: Response): Promise<void> => {
    const category = req.params.category as string 
    try {
        if (!category) {
            res.status(404).json({ data: [], message: "Must provide category !" })
        }else{
            const data: Product[] | null = await ProductModel.showByCategory(category)
            data && res.status(200).json({ data: data, message: "got product" })
            !data && res.status(404).json({ data: [], message: "There is no product with category: " + category + " !" })
        }
    } catch (error) {
        res.status(500).json({ message: "can't get products !" + error })
    }
}
const create = async (req: Request, res: Response): Promise<void> => {
    const name = req.body.name
    const price  = req.body.price
    const category = req.body.category
    try {
        const data: Product = await ProductModel.create(name, category,price)
        data && res.status(200).json({ data: data, message: "created Product with name=" + name})
        !data && res.status(404).json({ data: {}, message: "can't create Product with name=" + name })
    } catch (error) {
        res.status(500).json({ message: "can't craete Product! " + error })
    }
}
const destroy = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string
    try {
        if (id) {
            const data: Product = await ProductModel.delete(id)
            data && res.status(200).json({ data: data, message: "Deleted product with id=" + id })
            !data && res.status(404).json({ data: {}, message: "There is no product with id=" + id })
        }
    } catch (error) {
        res.status(500).json({ message: "Can't delete products!" + error })
    }
}
const productRoutes = (app: express.Application) => {
    app.get('/product', index)
    app.post('/product/add',verifyAuthToken, validatProductInfo, create)
    app.get('/product/:id', show)
    app.get('/product/category/:category', showByCategory)
    app.delete('/product/:id', verifyAuthAdminRole, destroy)
}
export default productRoutes;