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

### [v0.5.0] - 2026-03-05

#### Added
- **Stock Detail Page** - Individual stock price charts with interactive time range selectors (1D, 1W, 1M, 3M, 6M, 1Y, 5Y)
- **Historical Price Data** - Backend endpoint `/api/market/:symbol/history` with Alpha Vantage integration
- **Price History Caching** - New `PriceHistory` database model to cache historical data and minimize API calls
- **Area Charts** - Beautiful price charts with gradient fills using Recharts
- **Clickable Stock Symbols** - Navigate to stock detail from Holdings and Transactions tables
- **Stock Statistics** - Period high/low, average volume displayed on stock detail page
- **React Router** - Client-side routing for stock detail pages

#### Changed
- **App.tsx**: Added routing support, conditional header display based on route
- **main.tsx**: Wrapped app with BrowserRouter for routing
- **Holdings.tsx**: Stock symbols now clickable, navigate to detail view
- **Transactions.tsx**: Stock symbols now clickable, navigate to detail view
- **market.ts**: Added historical data endpoint with caching logic, demo data generator

#### Improved
- Real-time price data with historical context
- Better data efficiency with intelligent caching
- Enhanced user navigation between related views
- Chart tooltips with formatted dates and prices

### [v0.4.0] - 2026-03-05

#### Added
- Gradient background and modern color scheme throughout the app
- Loading skeleton animations for better UX during data fetching
- Stock avatars with initials in holdings and transactions tables
- Type badges with icons (📈 BUY, 📉 SELL, 💰 DIVIDEND)
- Hover effects and smooth transitions on all interactive elements
- Footer with version info

#### Changed
- **App.tsx**: Redesigned header with gradient logo, sticky navigation, responsive tab buttons with icons
- **Dashboard**: Enhanced summary cards with gradients and hover scale effects, improved pie chart with better tooltips and formatting, better empty states
- **Holdings**: Complete table redesign with stock avatars, improved gain/loss display with arrows and percentages, better loading states
- **Transactions**: Modern form design with better validation feedback, enhanced table layout with improved typography, better empty states with CTA button

#### Improved
- Overall visual polish and consistency
- Better responsive design across all components
- Enhanced user experience with loading states and empty states
- Better accessibility with proper labels and focus states

### [v0.3.0] - 2026-03-05

#### Added
- Frontend dashboard with portfolio summary cards
- Asset allocation pie chart (Recharts)
- Holdings management UI (add/delete positions)
- Transactions history UI (BUY/SELL/DIVIDEND)
- Zustand state management for global state
- API client with axios for backend communication

#### Changed
- Updated App.tsx with tab navigation (Dashboard, Holdings, Transactions)

### [v0.2.0] - 2026-03-05

#### Added
- Backend API endpoints: `/api/stocks`, `/api/holdings`, `/api/transactions`, `/api/market/:symbol`
- Prisma database migration (SQLite) with Stock, Holding, Transaction tables
- Market data integration with Alpha Vantage (demo mode without API key)
- Full CRUD operations for stocks, holdings, and transactions

#### Changed
- Downgraded Prisma to v5.7 for stable SQLite support

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
