import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      include: {
        holdings: true,
        _count: {
          select: { transactions: true }
        }
      }
    });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// GET single stock
router.get('/:symbol', async (req, res) => {
  try {
    const stock = await prisma.stock.findUnique({
      where: { symbol: req.params.symbol },
      include: { holdings: true, transactions: true }
    });
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

// POST create new stock
router.post('/', async (req, res) => {
  try {
    const { symbol, name, sector } = req.body;
    
    const stock = await prisma.stock.create({
      data: { symbol, name, sector }
    });
    
    res.status(201).json(stock);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Stock symbol already exists' });
    }
    res.status(500).json({ error: 'Failed to create stock' });
  }
});

// DELETE stock
router.delete('/:symbol', async (req, res) => {
  try {
    await prisma.stock.delete({
      where: { symbol: req.params.symbol }
    });
    res.json({ message: 'Stock deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stock' });
  }
});

export default router;
