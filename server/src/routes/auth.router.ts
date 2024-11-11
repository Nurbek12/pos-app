import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { create, login, update, getUsers } from '../controllers/auth.controller'

export default Router()
    .post('/login', login as any)
    .get('/users', authMiddleware as any, getUsers as any)
    .post('/create', authMiddleware as any, create as any)
    .put('/user/:id', authMiddleware as any, update as any)