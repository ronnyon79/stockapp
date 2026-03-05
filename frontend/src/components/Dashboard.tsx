import { useEffect, useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
    return <div className="text-center py-8">Loading portfolio...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Portfolio Value</h3>
          <p className="text-3xl font-bold text-green-400">${portfolioValue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Holdings</h3>
          <p className="text-3xl font-bold">{holdings.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Transactions</h3>
          <p className="text-3xl font-bold">{transactions.length}</p>
        </div>
      </div>

      {/* Asset Allocation Chart */}
      {allocationData.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
