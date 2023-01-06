import express, { Request,Response } from "express";
import UsersRoutes from "./handler/users";
import cors from "cors"
const app:express.Application=express()
const port=5200
app.use(cors())
app.use(express.json());
app.get("/",(req:Request,res:Response)=>{
    res.json("root route")
})

// UsersRoutes(app)
app.listen(port ,()=>{
    console.log("server is connected to port "+port);    
})