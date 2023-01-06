import express, { Request, Response } from "express";
import { User, UserModel } from "../models/users";
import jwt from "jsonwebtoken"
import { verifyAuthAdminRole } from "../middelware/AuthToken";
import { validateUserInfo } from "../middelware/validations";

const index = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data: User[] = await UserModel.index()
        data.length && res.status(200).json({ data: data, message: "got users" })
        !data.length && res.status(404).json({ data: [], message: "There is no user!" })
    } catch (error) {
        res.status(500).json({ message: "can't get users !" + error })
    }
}
const show = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string
    try {
        const data: User | null = await UserModel.show(id)
        data && res.status(200).json({ data: data, message: "got user" })
        !data && res.status(404).json({ data: [], message: "There is no user with id=" + id + " !" })
    } catch (error) {
        res.status(500).json({ message: "can't get users !" + error })
    }
}
const create = async (req: Request, res: Response): Promise<void> => {
    const firstname = req.body.firstname as string
    const lastname = req.body.lastname as string || null
    const password = req.body.password as string
    try {
        const usernameExists: User | null = await UserModel.showByName(firstname)
        if (usernameExists)
            res.status(409).json({ data: {}, message: "can't create user ,first name: " + firstname + " is already used" })
        else {
            const user: User = await UserModel.create(firstname, lastname, password)
            if (user) {
                const { password, lastName, ...userInPayload } = user
                const token = jwt.sign({ user: userInPayload }, process.env.TOKEN_SECRET as string)
                res.status(200).json({ data: { token: token }, message: "created user successfully with name=" + firstname })
            }
            !user && res.status(404).json({ data: {}, message: "can't create user with name=" + firstname })
        }
    } catch (error) {
        res.status(500).json({ message: "can't craete user! " + error })
    }
}
const login = async (req: Request, res: Response): Promise<void> => {
    const firstname = req.body.firstname as string
    const password = req.body.password as string
    try {
        const user: User | null = await UserModel.authentiacte(firstname, password)
        if (user) {
            const { password, lastName, ...userInPayload } = user
            const token = jwt.sign({ user: userInPayload }, process.env.TOKEN_SECRET as string)
            res.status(200).json({ data: { token: token }, message: "user login with name=" + firstname })
        }
        else res.status(400).json({ data: {}, message: "Wrong name or password" })

    } catch (error) {
        res.status(500).json({ message: "can't login user! " + error })
    }
}
const destroy = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string
    try {
        if (id) {
            const data: User = await UserModel.delete(id)
            data && res.status(200).json({ data: data, message: "Deleted user with id=" + id })
            !data && res.status(404).json({ data: {}, message: "There is no user with id=" + id })
        }
    } catch (error) {
        res.status(500).json({ message: "can't delete user!" + error })
    }
}
const UserRoutes = (app: express.Application) => {
    app.get('/user', index)
    app.get('/user/:id', show)
    app.post('/user/login', validateUserInfo, login)
    app.post('/user/add', validateUserInfo, create)
    app.delete('/user/:id', verifyAuthAdminRole, destroy)
}
export default UserRoutes;