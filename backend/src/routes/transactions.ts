import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Helper: Recalculate holding from all transactions for a stock
async function recalculateHolding(stockId: number) {
  const transactions = await prisma.transaction.findMany({
    where: { stockId, type: { in: ['BUY', 'SELL'] } },
    orderBy: { date: 'asc' }
  });

  let totalShares = 0;
  let totalCost = 0;
  let lastBuyDate = new Date();

  for (const tx of transactions) {
    if (tx.type === 'BUY') {
      totalCost += tx.shares * tx.price;
      totalShares += tx.shares;
      lastBuyDate = tx.date;
    } else if (tx.type === 'SELL') {
      // Calculate cost basis for sold shares (average cost method)
      const avgCost = totalShares > 0 ? totalCost / totalShares : 0;
      totalCost -= avgCost * tx.shares;
      totalShares -= tx.shares;
    }
  }

  // Ensure no negative values
  if (totalShares <= 0) {
    totalShares = 0;
    totalCost = 0;
  }

  const avgCost = totalShares > 0 ? totalCost / totalShares : 0;

  // Upsert holding
  if (totalShares > 0) {
    await prisma.holding.upsert({
      where: { id: stockId },
      create: {
        stockId,
        shares: totalShares,
        avgCost,
        purchaseDate: lastBuyDate
      },
      update: {
        shares: totalShares,
        avgCost,
        purchaseDate: lastBuyDate
      }
    });
  } else {
    // Delete holding if no shares
    await prisma.holding.deleteMany({
      where: { stockId }
    });
  }
}

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
    
    // Recalculate holding for this stock
    await recalculateHolding(parseInt(stockId));
    
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create transaction', details: error.message });
  }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
  try {
    const { type, shares, price, date, notes } = req.body;
    const transactionId = parseInt(req.params.id);
    
    // Get the old transaction to find stockId
    const oldTx = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });
    
    if (!oldTx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        type,
        shares: parseFloat(shares),
        price: parseFloat(price),
        date: new Date(date),
        notes
      },
      include: { stock: true }
    });
    
    // Recalculate holding for this stock
    await recalculateHolding(oldTx.stockId);
    
    res.json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update transaction', details: error.message });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    
    // Get the transaction to find stockId before deleting
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      select: { stockId: true }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    await prisma.transaction.delete({
      where: { id: transactionId }
    });
    
    // Recalculate holding for this stock
    await recalculateHolding(transaction.stockId);
    
    res.json({ message: 'Transaction deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete transaction', details: error.message });
  }
});

// POST recalculate all holdings (utility endpoint)
router.post('/recalculate-all', async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      select: { id: true }
    });
    
    for (const stock of stocks) {
      await recalculateHolding(stock.id);
    }
    
    res.json({ message: 'All holdings recalculated', stockCount: stocks.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to recalculate holdings', details: error.message });
  }
});

export default router;
