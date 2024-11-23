import { prisma } from '../config/prisma'
import { Request, Response } from 'express'

export const findFoods = async (req: Request, res: Response) => {
    try {
        const result = await prisma.food.findMany({})
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

export const createFood = async (req: Request, res: Response) => {
    try {
        if(req.file) req.body.image = req.file.filename
        if(req.body.price) req.body.price = +req.body.price
        const result = await prisma.food.create({
            data: req.body
        })
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

export const updateFood =  async (req: Request, res: Response) => {
    try {
        if(req.body.price) req.body.price = +req.body.price
        const result = await prisma.food.update({ where: { id: +req.params.id }, data: req.body})
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

export const deleteFood =  async (req: Request, res: Response) => {
    try {
        await prisma.food.delete({ where: { id: +req.params.id } })
        res.json(true)
    } catch (error) {
        console.log(error)
    }
}