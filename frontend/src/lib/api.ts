import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stocksApi = {
  getAll: () => api.get('/stocks'),
  getOne: (symbol: string) => api.get(`/stocks/${symbol}`),
  create: (data: { symbol: string; name?: string; sector?: string }) => api.post('/stocks', data),
  delete: (symbol: string) => api.delete(`/stocks/${symbol}`),
};

export const holdingsApi = {
  getAll: () => api.get('/holdings'),
  create: (data: { stockId: number; shares: number; avgCost: number; purchaseDate: string }) => api.post('/holdings', data),
  update: (id: number, data: { shares: number; avgCost: number; purchaseDate: string }) => api.put(`/holdings/${id}`, data),
  delete: (id: number) => api.delete(`/holdings/${id}`),
};

export const transactionsApi = {
  getAll: () => api.get('/transactions'),
  getByStock: (stockId: number) => api.get(`/transactions/stock/${stockId}`),
  create: (data: { stockId: number; type: string; shares: number; price: number; date: string; notes?: string }) => api.post('/transactions', data),
  delete: (id: number) => api.delete(`/transactions/${id}`),
};

export const marketApi = {
  getPrice: (symbol: string) => api.get(`/market/${symbol}`),
};

export default api;
