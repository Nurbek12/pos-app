import { Router } from 'express'
import authRouter from './auth.router'
import foodRouter from './food.router'
import orderRouter from './order.router'
import statisticRouter from './statistic.router'
import { authMiddleware } from '../middlewares/auth.middleware'

export default Router()
    .use('/auth', authRouter)
    .use('/food', authMiddleware as any, foodRouter)
    .use('/order', authMiddleware as any, orderRouter)
    .use('/statistic', authMiddleware as any, statisticRouter)