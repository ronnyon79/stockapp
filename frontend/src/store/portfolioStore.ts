import { create } from 'zustand';
import { holdingsApi, transactionsApi, stocksApi, marketApi } from '../lib/api';

interface Holding {
  id: number;
  stockId: number;
  stock: { symbol: string; name?: string };
  shares: number;
  avgCost: number;
  purchaseDate: string;
}

interface Transaction {
  id: number;
  stockId: number;
  stock: { symbol: string; name?: string };
  type: string;
  shares: number;
  price: number;
  date: string;
  notes?: string;
}

interface Stock {
  id: number;
  symbol: string;
  name?: string;
  sector?: string;
}

interface PortfolioState {
  holdings: Holding[];
  transactions: Transaction[];
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchHoldings: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchStocks: () => Promise<void>;
  addHolding: (data: any) => Promise<void>;
  addTransaction: (data: any) => Promise<void>;
  addStock: (data: any) => Promise<void>;
  deleteHolding: (id: number) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  getMarketPrice: (symbol: string) => Promise<any>;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  holdings: [],
  transactions: [],
  stocks: [],
  loading: false,
  error: null,

  fetchHoldings: async () => {
    try {
      const response = await holdingsApi.getAll();
      set({ holdings: response.data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchTransactions: async () => {
    try {
      const response = await transactionsApi.getAll();
      set({ transactions: response.data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchStocks: async () => {
    try {
      const response = await stocksApi.getAll();
      set({ stocks: response.data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addHolding: async (data) => {
    const response = await holdingsApi.create(data);
    set((state) => ({ holdings: [response.data, ...state.holdings] }));
  },

  addTransaction: async (data) => {
    const response = await transactionsApi.create(data);
    set((state) => ({ transactions: [response.data, ...state.transactions] }));
  },

  addStock: async (data) => {
    const response = await stocksApi.create(data);
    set((state) => ({ stocks: [...state.stocks, response.data] }));
  },

  deleteHolding: async (id) => {
    await holdingsApi.delete(id);
    set((state) => ({
      holdings: state.holdings.filter((h) => h.id !== id),
    }));
  },

  deleteTransaction: async (id) => {
    await transactionsApi.delete(id);
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },

  getMarketPrice: async (symbol) => {
    const response = await marketApi.getPrice(symbol);
    return response.data;
  },
}));
