import api from '.'

export const getOrderStatistics = (params: {gt: Date | string, lt: Date | string}) => api.get('/api/statistic/orders', { params })

export const getFoodStatistics = (params: {gt: Date | string, lt: Date | string}) => api.get('/api/statistic/foods', { params })