import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET all holdings
router.get('/', async (req, res) => {
  try {
    const holdings = await prisma.holding.findMany({
      include: { stock: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch holdings' });
  }
});

// POST create new holding
router.post('/', async (req, res) => {
  try {
    const { stockId, shares, avgCost, purchaseDate } = req.body;
    
    const holding = await prisma.holding.create({
      data: {
        stockId: parseInt(stockId),
        shares: parseFloat(shares),
        avgCost: parseFloat(avgCost),
        purchaseDate: new Date(purchaseDate)
      },
      include: { stock: true }
    });
    
    res.status(201).json(holding);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create holding' });
  }
});

// PUT update holding
router.put('/:id', async (req, res) => {
  try {
    const { shares, avgCost, purchaseDate } = req.body;
    
    const holding = await prisma.holding.update({
      where: { id: parseInt(req.params.id) },
      data: {
        shares: parseFloat(shares),
        avgCost: parseFloat(avgCost),
        purchaseDate: new Date(purchaseDate)
      },
      include: { stock: true }
    });
    
    res.json(holding);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update holding' });
  }
});

// DELETE holding
router.delete('/:id', async (req, res) => {
  try {
    await prisma.holding.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Holding deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete holding' });
  }
});

export default router;
