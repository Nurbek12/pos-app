import { printAdmin, printChef } from '../config/printer';
import { prisma } from '../config/prisma'
import { Request, Response } from 'express'

const getNextDailyNum = async () => {
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
    })
  
    return lastOrder ? lastOrder.dailyNum + 1 : 1;
}

const handleDeleteOrder = async (id: number) => {
    await prisma.orderItem.deleteMany({ where: { orderId: id } })
    await prisma.order.delete({ where: { id } })
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
                    creator: {
                        select: {
                            id: true,
                            login: true,
                        }
                    },
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
        let order
        let orderId
        console.log((req as any).user.id);
        
        const hasOrder = await prisma.order.findFirst({ where: { AND: [{ type: "TABLE", address: req.body.address, status: "CREATED" }] } })

        const { items, ...data } = req.body

        if(!hasOrder?.id) {
            const dailyNum = await getNextDailyNum()
            order = await prisma.order.create({
                data: {
                    creatorId: (req as any).user.id,
                    dailyNum,
                    ...data,
                },
                include: {
                    creator: {
                        select: {
                            id: true,
                            login: true,
                        }
                    },
                }
            })
            orderId = order.id
        } else {
            order = await prisma.order.update({
                where: { id: hasOrder.id },
                data: {
                    serviceCharge: { increment: req.body.serviceCharge },
                    total: { increment: req.body.total },
                },
                include: {
                    creator: {
                        select: {
                            id: true,
                            login: true,
                        }
                    },
                }
            })
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

        const printStatus = await printChef({ ...order, orderItems })

        if(printStatus.status === 'error') {
            await handleDeleteOrder(order.id)
            res.json({ status: 'PRINTER_ERROR', message: printStatus.message })
        }else{
            res.json({ ...order, orderItems })
        }
    } catch (error) {
        console.log(error);
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const order = await prisma.order.findUnique({ where: {
            id: +req.params.id
        },
            include: {
                orderItems: {
                    include: {
                        food: true
                    }
                }
            }
        })

        
        const printStatus = await printAdmin(order as any);

        if(printStatus.status === 'error') {
            res.json({ status: 'PRINTER_ERROR', message: printStatus.message })
            return
        }
        
        await prisma.order.update({ where: {
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
        
        res.json({ status: "success" })
    } catch (error) {
        console.log(error);
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        await handleDeleteOrder(+req.params.id)
        
        res.json({ status: "success" })
    } catch (error) {
        console.log(error);
    }
}