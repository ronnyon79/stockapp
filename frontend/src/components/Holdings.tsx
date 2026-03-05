import { useEffect, useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';

function Holdings() {
  const { holdings, fetchHoldings, getMarketPrice } = usePortfolioStore();
  const [loading, setLoading] = useState(true);
  const [holdingsData, setHoldingsData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await fetchHoldings();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const calculateHoldingsData = async () => {
      const data = [];
      for (const holding of holdings) {
        try {
          const marketData = await getMarketPrice(holding.stock.symbol);
          const currentPrice = marketData.price || marketData.demo?.price || holding.avgCost;
          const currentValue = holding.shares * currentPrice;
          const costBasis = holding.shares * holding.avgCost;
          const gainLoss = currentValue - costBasis;
          const gainLossPercent = costBasis > 0 ? ((gainLoss / costBasis) * 100) : 0;

          data.push({
            ...holding,
            currentPrice,
            currentValue,
            costBasis,
            gainLoss,
            gainLossPercent
          });
        } catch (error) {
          const currentValue = holding.shares * holding.avgCost;
          const costBasis = holding.shares * holding.avgCost;
          data.push({
            ...holding,
            currentPrice: holding.avgCost,
            currentValue,
            costBasis,
            gainLoss: 0,
            gainLossPercent: 0
          });
        }
      }
      setHoldingsData(data);
    };

    if (holdings.length > 0) {
      calculateHoldingsData();
    }
  }, [holdings]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-700/50 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">💼</span>
          <h3 className="text-2xl font-bold text-white">Holdings</h3>
        </div>
        <p className="text-gray-400 text-sm">
          Holdings are automatically calculated from your transactions. Add BUY/SELL transactions to update.
        </p>
      </div>

      {holdings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-7xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-white mb-2">No Holdings Yet</h3>
          <p className="text-gray-400 mb-4">Start building your portfolio by adding your first BUY transaction!</p>
          <div className="inline-block bg-gray-700/50 rounded-lg px-4 py-2 text-sm text-gray-300">
            Navigate to Transactions → Add Transaction
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Stock</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Shares</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Avg Cost</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Current Price</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Market Value</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Gain/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {holdingsData.map((holding) => (
                <tr 
                  key={holding.id} 
                  className="hover:bg-gray-700/30 transition-colors duration-150 group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {holding.stock.symbol.substring(0, 2)}
                      </div>
                      <div className="ml-4">
                        <div className="font-bold text-white">{holding.stock.symbol}</div>
                        {holding.stock.name && (
                          <div className="text-gray-400 text-sm truncate max-w-[200px]">{holding.stock.name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">{holding.shares.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-300">${holding.avgCost.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">${holding.currentPrice.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-semibold">${holding.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`flex items-center gap-2 ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className={`text-lg font-bold ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.gainLoss >= 0 ? '▲' : '▼'}
                      </span>
                      <div>
                        <div className="font-bold">${Math.abs(holding.gainLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="text-xs opacity-80">{holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Holdings;
