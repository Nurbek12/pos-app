export type { Admin, Food, Order, OrderItem } from '../../../server/node_modules/@prisma/client'
import type { Food, Order, OrderItem, Admin } from '../../../server/node_modules/@prisma/client'

export interface IOrder extends Order {
    creator?: Admin,
    orderItems: (
        OrderItem &
        { food: Food }
    )[]
}