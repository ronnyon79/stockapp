# StockFolio - Financial Stock Management App

Personal financial stock portfolio manager to track investments, transactions, and portfolio performance with real-time market data.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Tailwind + shadcn/ui + Recharts |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite (local) with Prisma ORM |
| Market Data | Alpha Vantage + Yahoo Finance APIs |

---

## Features

### MVP (Phase 1)
- [ ] Portfolio Dashboard — total value, performance, asset allocation, top movers
- [ ] Holdings Management — add/edit positions, real-time P&L
- [ ] Transaction History — buy/sell/dividend recording with filters
- [ ] Market Data — live prices, company info, historical charts
- [ ] Analytics — returns, dividends, cost basis, benchmark comparison

### Enhanced (Phase 2)
- [ ] Watchlist
- [ ] Price alerts
- [ ] Tax lot tracking
- [ ] Export to CSV/PDF
- [ ] Dark mode

---

## Getting Started

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Run backend (port 3001)
cd backend
npm run dev

# Run frontend (port 3000) - in new terminal
cd frontend
npm run dev
```

---

## Project Structure

```
StockApp/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   └── index.ts        # Express server entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema (Stock, Holding, Transaction)
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # React + Vite + TypeScript
│   ├── src/
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Tailwind styles
│   ├── index.html
│   ├── vite.config.ts      # Vite config with API proxy
│   ├── package.json
│   └── tsconfig.json
│
├── STOCK_APP_PLAN.md       # Full development plan
├── README.md               # This file
└── .gitignore
```

---

## Changelog

All notable changes to this project will be documented here.

### [v0.1.0] - 2026-03-05

#### Added
- Initial project structure (backend + frontend folders)
- Backend: Express server with TypeScript, Prisma schema (Stock, Holding, Transaction models)
- Frontend: React 18 + Vite + TypeScript + Tailwind CSS setup
- Git repository initialized and pushed to GitHub
- Development plan documented

---

## License

MIT
