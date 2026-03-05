import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET real-time stock price from Alpha Vantage
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      return res.status(503).json({ 
        error: 'Alpha Vantage API key not configured',
        demo: {
          symbol,
          price: 150.25,
          change: 2.35,
          changePercent: 1.58,
          volume: 1250000,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    const response = await axios.get(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: apiKey
        }
      }
    );
    
    const quote = response.data['Global Quote'];
    
    if (!quote || Object.keys(quote).length === 0) {
      return res.status(404).json({ error: 'Stock symbol not found' });
    }
    
    res.json({
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      volume: parseInt(quote['06. volume']),
      timestamp: quote['07. latest trading day']
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch market data',
      details: error.message 
    });
  }
});

export default router;
