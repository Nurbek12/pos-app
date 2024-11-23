import api from '.'
import { IOrder } from '@/types'

interface OrderResult {
    total: number
    result: IOrder[]
}

export const getOrders = (params?: any) => api.get<OrderResult>('/api/order', { params })

export const createOrder = (body: any) => api.post<IOrder>('/api/order', body)

export const updateOrder = (id: number, body: any) => api.put<IOrder>(`/api/order/${id}`, body)

export const deleteOrder = (id: number) => api.delete(`/api/order/${id}`)