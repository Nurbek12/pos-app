import io from 'socket.io-client'
import { baseURL } from '.'

const socket = io(baseURL)

export const createOrderEmit = (data: any) => socket.emit('create-order', data)

export const completeOrderEmit = (index: any) => socket.emit('complete-order', index)

export const onOrderCreated = (cb: any) => socket.on('order-created', cb)

export const onOrderCompleted = (cb: any) => socket.on('orde-completed', cb)