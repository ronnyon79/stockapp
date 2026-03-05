# Financial Stock Management App - Development Plan

## Project Overview
- **Name**: StockFolio
- **Type**: Personal Financial Stock Portfolio Manager
- **Core Purpose**: Track investments, transactions, and portfolio performance with real-time market data
- **Target User**: Personal use (Ronny)

---

## Tech Stack Recommendation

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui (clean, modern, performant)
- **Charts**: Recharts (lightweight, React-native)
- **State Management**: Zustand (simpler than Redux, great performance)

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: SQLite (local) → PostgreSQL (production-ready)
- **ORM**: Prisma (type-safe, easy migrations)

### External APIs
- **Stock Data**: Alpha Vantage + Yahoo Finance (free tiers available)
- **Real-time**: WebSocket for live price updates (optional)

---

## Core Features (Phase 1 - MVP)

### 1. Portfolio Dashboard
- Total portfolio value
- Daily/weekly/monthly performance
- Asset allocation pie chart
- Top gainers/losers

### 2. Holdings Management
- Add/edit/delete stock positions
- Track: symbol, shares, average cost, purchase date
- Real-time current price + P&L

### 3. Transaction History
- Buy/sell/dividend recording
- Transaction categorization
- Filter & search

### 4. Market Data Integration
- Real-time stock prices (manual refresh + auto)
- Company info (name, sector, market cap)
- Historical price charts (1D, 1W, 1M, 3M, 1Y, 5Y)

### 5. Analytics & Reports
- Total return (absolute + %)
- Dividend income tracking
- Cost basis analysis
- Performance vs benchmarks (S&P 500)

---

## Phase 2 - Enhanced Features (Post-MVP)
- Watchlist
- Price alerts
- Tax lot tracking
- Export to CSV/PDF
- Dark mode

---

## Development Phases

### Phase 1: Project Setup (Day 1)
- [ ] Initialize React + TypeScript frontend
- [ ] Set up Node.js + Express + Prisma backend
- [ ] Configure SQLite database
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Project folder structure

### Phase 2: Backend API (Days 2-3)
- [ ] Stock/Portfolio CRUD endpoints
- [ ] Transaction endpoints
- [ ] Market data integration (Alpha Vantage)
- [ ] Database seeding & migrations

### Phase 3: Frontend Core (Days 4-6)
- [ ] Dashboard layout & components
- [ ] Holdings list & add/edit forms
- [ ] Transaction history view

### Phase 4: Charts & Analytics (Days 7-8)
- [ ] Portfolio performance chart
- [ ] Asset allocation pie chart
- [ ] Individual stock price charts

### Phase 5: Polish & Testing (Day 9)
- [ ] Responsive design
- [ ] Error handling
- [ ] Basic testing

---

## Next Steps
1. **Confirm stack** - Any changes to the tech recommendations?
2. **Start Phase 1** - I'll set up the project structure
3. **API Keys** - Need to sign up for Alpha Vantage (free tier)

---

*Plan created: 2026-03-05*
