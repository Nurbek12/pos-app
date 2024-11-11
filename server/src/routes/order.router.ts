import { Router } from 'express'
import { createOrder, findOrders, updateOrder } from '../controllers/order.controller'

export default Router()
    .get('/', findOrders) 
    .post('/', createOrder)
    .put('/:id', updateOrder)