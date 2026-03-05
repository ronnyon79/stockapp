import express from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Time range configurations (in days)
const TIME_RANGES: Record<string, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
  '5Y': 1825,
};

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

// GET historical price data with caching
router.get('/:symbol/history', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { range = '1M' } = req.query; // Default to 1 month
    
    const days = TIME_RANGES[range as string] || TIME_RANGES['1M'];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Check cache first
    const cachedData = await prisma.priceHistory.findMany({
      where: {
        symbol: symbol.toUpperCase(),
        date: {
          gte: startDate.toISOString().split('T')[0]
        }
      },
      orderBy: { date: 'asc' }
    });
    
    // If we have recent cached data (less than 24h old), return it
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentCache = cachedData.filter(d => new Date(d.timestamp) > oneDayAgo);
    
    if (recentCache.length > 0 && recentCache.length >= days * 0.8) {
      return res.json({
        symbol: symbol.toUpperCase(),
        range,
        data: cachedData.map(d => ({
          date: d.date,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume
        })),
        cached: true
      });
    }
    
    // Fetch from Alpha Vantage
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      // Return demo data
      const demoData = generateDemoData(days);
      return res.json({
        symbol: symbol.toUpperCase(),
        range,
        data: demoData,
        cached: false,
        demo: true
      });
    }
    
    // Fetch daily time series from Alpha Vantage
    const response = await axios.get(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol.toUpperCase(),
          outputsize: range === '5Y' ? 'full' : 'compact',
          apikey: apiKey
        }
      }
    );
    
    const timeSeries = response.data['Time Series (Daily)'];
    
    if (!timeSeries) {
      return res.status(404).json({ error: 'Historical data not found' });
    }
    
    // Parse and save to cache
    const historicalData = [];
    for (const [date, data] of Object.entries(timeSeries as any)) {
      if (new Date(date) < startDate) break;
      
      const priceData = {
        symbol: symbol.toUpperCase(),
        date,
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'])
      };
      
      // Upsert into cache
      try {
        await prisma.priceHistory.upsert({
          where: {
            symbol_date: {
              symbol: symbol.toUpperCase(),
              date
            }
          },
          update: priceData,
          create: priceData
        });
      } catch (e) {
        // Ignore duplicate errors
      }
      
      historicalData.push({
        date: priceData.date,
        open: priceData.open,
        high: priceData.high,
        low: priceData.low,
        close: priceData.close,
        volume: priceData.volume
      });
    }
    
    res.json({
      symbol: symbol.toUpperCase(),
      range,
      data: historicalData.reverse(), // Chronological order
      cached: false
    });
    
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch historical data',
      details: error.message 
    });
  }
});

// Helper function to generate demo data
function generateDemoData(days: number) {
  const data = [];
  let basePrice = 150 + Math.random() * 50;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.5) * 5;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    const volume = Math.floor(1000000 + Math.random() * 5000000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });
    
    basePrice = close;
  }
  
  return data;
}

export default router;
