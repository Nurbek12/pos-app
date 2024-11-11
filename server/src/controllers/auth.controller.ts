import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { prisma } from '../config/prisma'
import { Request, Response } from 'express'

export const login = async (req: Request, res: Response) => {
    try {
        const userData = await prisma.admin.findFirst({ where: { login: req.body.login } })
        if(!userData) return res.status(400).json({ message: "Login or Password incorrect!" })

        const { password, ...user } = userData
        const isMatch = await bcrypt.compare(req.body.password, password)
        if(!isMatch) return res.status(400).json({ message: "Login or Password incorrect!" })
        
        const options = {}
        if(user.role === "admin") Object.assign(options, { expiresIn: "1d" })

        const token = jwt.sign(user, "secret", options)
        return res.json({ token, user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.admin.findMany({
            select: {
                id: true,
                role: true,
                login: true,
            }
        })
        return res.json(users)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10)
        const user = await prisma.admin.create({ data: req.body })
        return res.json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        if(req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10)
        const user = await prisma.admin.update({ where: { id: +req.params.id }, data: req.body })
        return res.json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}