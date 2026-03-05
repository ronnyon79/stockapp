import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { stock: true },
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET transactions by stock
router.get('/stock/:stockId', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { stockId: parseInt(req.params.stockId) },
      include: { stock: true },
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST create new transaction
router.post('/', async (req, res) => {
  try {
    const { stockId, type, shares, price, date, notes } = req.body;
    
    const transaction = await prisma.transaction.create({
      data: {
        stockId: parseInt(stockId),
        type,
        shares: parseFloat(shares),
        price: parseFloat(price),
        date: new Date(date),
        notes
      },
      include: { stock: true }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    await prisma.transaction.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export default router;
