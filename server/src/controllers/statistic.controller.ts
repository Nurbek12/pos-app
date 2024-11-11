import { Order, Food, OrderItem } from '@prisma/client'
import { prisma } from '../config/prisma'
import { Request, Response } from 'express'

function countByDays(data: Order[]) {
    const counts: {[k: string]: number[]} = {}
    let k: string
    data.map((c) => {
        if(k == c.createdAt.toLocaleDateString()) {
            counts[k][0] += 1
            counts[k][1] += c.total
        }else{
            k = c.createdAt.toLocaleDateString()
            counts[k] = [1, c.total]
        }
    })
    return Object.entries(counts).map(([day, [quantity, total]]) => ({ day, quantity, total }))
}

function countFoods(data: (OrderItem & {food: Partial<Food>})[]) {
    const counts: { [k: string]: number } = {}
    let k: string
    data.map((c) => {
        if(k == c.food.name) {
            counts[k] += c.quantity
        }else{
            k = c.food.name!
            counts[k] = c.quantity
        }
    })
    return Object.entries(counts).map(([name, quantity]) => ({ name, quantity }))
}

const getDates = (gt?: string, lt?: string) => {
    const where: any = { createdAt: {} }
    if(gt) where.createdAt.gte = new Date(gt)
    if(lt) where.createdAt.lt = new Date(lt)
    return where
}

export const getOrders = async (req: Request, res: Response) => {
    try {
        const where = getDates(req.query.gt as string, req.query.lt as string)
        const result = await prisma.order.findMany({ where })
        res.json(countByDays(result))
    } catch (error) {
        console.log(error)
    }
}

export const getFoods = async (req: Request, res: Response) => {
    try {
        const where = getDates(req.query.gt as string, req.query.lt as string)
        const result = await prisma.orderItem.findMany({
            where,
            include: {
                food: {
                    select: {
                        id: true,
                        name: true,       
                    }
                }
            }
        })
        res.json(countFoods(result))
    } catch (error) {
        console.log(error)
    }
}