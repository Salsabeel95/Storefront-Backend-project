import express, { Request,Response } from "express";
import UsersRoutes from "./handler/users";
import cors from "cors"
import morgan from "morgan";
import productRoutes from "./handler/products";
import orderRoutes from "./handler/orders";
import dashboardRoutes from "./handler/dashboard";
import config from "./shared/config";
const app:express.Application=express()
const {SERVER_PORT}=config
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
app.listen(SERVER_PORT ,()=>{
    console.log("server is connected to port "+SERVER_PORT);    
})

export default app