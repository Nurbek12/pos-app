import api from '.'
import { Admin } from '@/types'

export const getUsers = () => api.get<Admin[]>('/api/auth/users')

export const createUser = (body: any) => api.post<Admin>('/api/auth/create', body)

export const updateUser = (id: number, body: any) => api.put<Admin>(`/api/auth/user/${id}`, body )

export const loginUser = (body: any) => api.post(`/api/auth/login`, body)