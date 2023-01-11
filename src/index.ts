import express, { Request,Response } from "express";
import UsersRoutes from "./handler/users";
import cors from "cors"
import morgan from "morgan";
import productRoutes from "./handler/products";
import orderRoutes from "./handler/orders";
import dashboardRoutes from "./handler/dashboard";
const app:express.Application=express()
const port=5200
app.use(morgan('dev'))
app.use(cors())
app.use(express.json());
app.get("/",(_req:Request,res:Response)=>{
    res.status(200).json("root route")
})

UsersRoutes(app)
productRoutes(app)
orderRoutes(app)
dashboardRoutes(app)
app.listen(port ,()=>{
    console.log("server is connected to port "+port);    
})

export default app