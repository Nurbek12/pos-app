import { Router } from 'express'
import { getFoods, getOrders } from '../controllers/statistic.controller'

export default Router()
    .get('/foods', getFoods)
    .get('/orders', getOrders)