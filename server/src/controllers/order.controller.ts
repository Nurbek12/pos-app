import { prisma } from '../config/prisma'
import { Request, Response } from 'express'
// import { printAdmin, printChef } from '../config/printer'

async function getNextDailyNum() {
    const currentDate = new Date().toISOString().split('T')[0];
    const lastOrder = await prisma.order.findFirst({
      where: {
        createdAt: {
          gte: new Date(currentDate),
          lt: new Date(currentDate + 'T23:59:59.999Z'),
        },
      },
      orderBy: {
        dailyNum: 'desc',
      },
    });
  
    return lastOrder ? lastOrder.dailyNum + 1 : 1;
}

export const findOrders = async (req: Request, res: Response) => {
    try {
        const where = {}
        const page = Number(req.query?.page) || 1
        const limit = Number(req.query?.limit) || 20
        const ids = req.query.ids
        const status = req.query.status

        if(ids && ids.length) Object.assign(where, { id: { in: ids } })
        if(status) Object.assign(where, { status })

        const [total,result] = await prisma.$transaction([
            prisma.order.count({ where }),
            prisma.order.findMany({ 
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: +limit,
                include: {
                    orderItems: {
                        include: {
                            food: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    category: true,
                                }
                            }
                        }
                    }
                }
            }),
        ])

        res.json({result, total})
    } catch (error) {
        console.log(error)
    }
}

export const createOrder = async (req: Request, res: Response) => {
    try {
        let orderId
        let order
        const hasOrder = await prisma.order.findFirst({ where: { AND: [{ type: "TABLE", address: req.body.address, status: "CREATED" }] } })

        const { items, ...data } = req.body

        if(!hasOrder?.id) {
            const dailyNum = await getNextDailyNum()
            order = await prisma.order.create({ data: {
                dailyNum,
                ...data,
            } })
            orderId = order.id
        } else {
            order = await prisma.order.update({ where: { id: hasOrder.id }, data: {
                serviceCharge: { increment: req.body.serviceCharge },
                total: { increment: req.body.total },
            } })
            orderId = hasOrder.id
        }

        const orderItems = await Promise.all(items.map(async (item: any) => {
            return await prisma.orderItem.create({
                data: {
                    foodId: item.foodId,
                    quantity: item.quantity,
                    orderId
                },
                include: {
                    food: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        }
                    }
                }
            })
        }))
        // printChef({ ...order, orderItems })
        res.json({ ...order, orderItems })
    } catch (error) {
        console.log(error);
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const order = await prisma.order.update({ where: {
            id: +req.params.id}, 
            data: req.body,
            include: {
                orderItems: {
                    include: {
                        food: true
                    }
                }
            }
        })
        if(req.body.stauts === "COMPLETED") {
            // printChef(order)
        }
        res.json(true)
    } catch (error) {
        console.log(error)
    }
}