import api from '.'
import { Food } from '@/types'

export const getFoods = () => api.get<Food[]>('/api/food')

export const createFood = (body: any) => api.post<Food>('/api/food', body)

export const updateFood = (id: number, body: any) => api.put<Food>(`/api/food/${id}`, body)

export const deleteFood = (id: any) => api.delete(`/api/food/${id}`)