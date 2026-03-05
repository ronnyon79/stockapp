import { useEffect, useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

const SummaryCard = ({ title, value, subtitle, gradient }: { title: string; value: string | number; subtitle?: string; gradient: string }) => (
  <div className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${gradient} shadow-lg transform hover:scale-105 transition-transform duration-200`}>
    <div className="relative z-10">
      <h3 className="text-white/80 text-sm font-medium mb-2">{title}</h3>
      <p className="text-4xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-white/60 text-xs mt-2">{subtitle}</p>}
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-10 text-8xl">
      💰
    </div>
  </div>
);

function Dashboard() {
  const { holdings, fetchHoldings, transactions, fetchTransactions, stocks, fetchStocks, getMarketPrice } = usePortfolioStore();
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [allocationData, setAllocationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchHoldings(), fetchTransactions(), fetchStocks()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (holdings.length === 0) return;

    const calculatePortfolio = async () => {
      let totalValue = 0;
      const allocation: any = {};

      for (const holding of holdings) {
        try {
          const marketData = await getMarketPrice(holding.stock.symbol);
          const currentPrice = marketData.price || marketData.demo?.price || holding.avgCost;
          const value = holding.shares * currentPrice;
          totalValue += value;

          if (!allocation[holding.stock.symbol]) {
            allocation[holding.stock.symbol] = { name: holding.stock.symbol, value: 0 };
          }
          allocation[holding.stock.symbol].value += value;
        } catch (error) {
          const value = holding.shares * holding.avgCost;
          totalValue += value;
          if (!allocation[holding.stock.symbol]) {
            allocation[holding.stock.symbol] = { name: holding.stock.symbol, value: 0 };
          }
          allocation[holding.stock.symbol].value += value;
        }
      }

      setPortfolioValue(totalValue);
      setAllocationData(Object.values(allocation));
    };

    calculatePortfolio();
  }, [holdings]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-72 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Portfolio Value"
          value={`$${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Real-time valuation"
          gradient="from-emerald-500 to-teal-600"
        />
        <SummaryCard
          title="Holdings"
          value={holdings.length}
          subtitle={holdings.length === 1 ? '1 position' : `${holdings.length} positions`}
          gradient="from-blue-500 to-indigo-600"
        />
        <SummaryCard
          title="Transactions"
          value={transactions.length}
          subtitle={transactions.length === 1 ? '1 transaction' : `${transactions.length} transactions`}
          gradient="from-purple-500 to-pink-600"
        />
      </div>

      {/* Asset Allocation Chart */}
      {allocationData.length > 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">📈 Asset Allocation</h3>
            <span className="text-sm text-gray-400">{allocationData.length} holdings</span>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={2}
                stroke="#1F2937"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: number) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Value']}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  color: '#9CA3AF'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-bold text-white mb-2">No Holdings Yet</h3>
          <p className="text-gray-400 mb-4">Start building your portfolio by adding your first transaction!</p>
          <p className="text-sm text-gray-500">Go to Transactions tab → Add Transaction</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
