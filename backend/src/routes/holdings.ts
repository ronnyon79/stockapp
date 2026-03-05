import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET all holdings (read-only - calculated from transactions)
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

// Note: Holdings are now automatically calculated from transactions.
// POST, PUT, and DELETE endpoints have been removed.
// To modify holdings, add/edit/delete transactions instead.

export default router;
