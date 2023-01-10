import express, { Request, Response } from "express";
import { User, UserModel } from "../models/users";
import jwt from "jsonwebtoken"
import { verifyAuthAdminRole } from "../middelware/AuthToken";
import {  validationErrors } from "../middelware/validations";
import { check, validationResult } from "express-validator";
import config from "../utilities/config";

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
    const email = req.body.email as string
    const username = req.body.username as string || null
    const password = req.body.password as string
    try {
        const usernameExists: User | null = await UserModel.showByName(email)
        if (usernameExists)
            res.status(409).json({ data: {}, message: "can't create user ,email: " + email + " is already used" })
        else {
            const user: User = await UserModel.create(email, username, password)
            if (user) {
                const { password, username, ...userInPayload } = user
                const token = jwt.sign({ user: userInPayload }, config.TOKEN_SECRET as string)
                res.status(200).json({ data: { token: token }, message: "created user successfully with email=" + email })
            }
            !user && res.status(404).json({ data: {}, message: "can't create user with email=" + email })
        }
    
    } catch (error) {
        res.status(500).json({ message: "can't craete user! " + error })
    }
}
const login = async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email as string
    const password = req.body.password as string
    try {
        const user: User | null = await UserModel.authentiacte(email, password)
        if (user) {
            const { password, username, ...userInPayload } = user
            const token = jwt.sign({ user: userInPayload }, config.TOKEN_SECRET as string)
            res.status(200).json({ data: { token: token }, message: "user login with email=" + email })
        }
        else res.status(400).json({ data: {}, message: "Wrong email or password" })

    } catch (error) {
        res.status(500).json({ message: "can't login user! " + error })
    }
}
const destroy = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string
    try {
            const data: User = await UserModel.delete(id)
            data && res.status(200).json({ data: data, message: "Deleted user with id=" + id })
            !data && res.status(404).json({ data: {}, message: "There is no user with id=" + id })
    } catch (error) {
        res.status(500).json({ message: "can't delete user!" + error })
    }
}
const UserRoutes = (app: express.Application) => {
    app.get('/user', index)
    app.get('/user/:id',check('id').notEmpty().withMessage("Must provide a user id"),validationErrors, show)
    app.post('/user/login',check("email").notEmpty().withMessage("Must provide email").isEmail().withMessage("Email must match email format"),check('password').isLength({ min: 5 }).withMessage("password length must be more than 4"),  validationErrors, login)
    app.post('/user/add',check("email").notEmpty().withMessage("Must provide email").isEmail().withMessage("Email must match email format"),check('password').isLength({ min: 5 }).withMessage("password length must be more than 4"),  validationErrors,  create)
    app.delete('/user/:id', verifyAuthAdminRole,check('id').notEmpty().withMessage("Must provide a user id to delete"),validationErrors, destroy)
}
export default UserRoutes;