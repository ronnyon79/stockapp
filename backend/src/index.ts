import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stocksRoutes from './routes/stocks.js';
import holdingsRoutes from './routes/holdings.js';
import transactionsRoutes from './routes/transactions.js';
import marketRoutes from './routes/market.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/stocks', stocksRoutes);
app.use('/api/holdings', holdingsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/market', marketRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'StockFolio API is running!',
    endpoints: {
      stocks: '/api/stocks',
      holdings: '/api/holdings',
      transactions: '/api/transactions',
      market: '/api/market/:symbol'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET  /api/stocks`);
  console.log(`   GET  /api/holdings`);
  console.log(`   GET  /api/transactions`);
  console.log(`   GET  /api/market/:symbol`);
});
