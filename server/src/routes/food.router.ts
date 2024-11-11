import { Router } from 'express'
import { createFood, deleteFood, findFoods, updateFood } from '../controllers/food.controller'

export default Router()
    .get('/', findFoods)
    .post('/', createFood)
    .put('/:id', updateFood)
    .delete('/:id', deleteFood)