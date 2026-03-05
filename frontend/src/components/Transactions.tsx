import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '../store/portfolioStore';

const typeConfig = {
  BUY: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '📈', label: 'Buy' },
  SELL: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '📉', label: 'Sell' },
  DIVIDEND: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '💰', label: 'Dividend' },
};

function Transactions() {
  const navigate = useNavigate();
  const { transactions, fetchTransactions, addTransaction, deleteTransaction, addStock } = usePortfolioStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'BUY',
    shares: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const symbol = formData.symbol.trim().toUpperCase();
      
      if (!symbol) {
        setError('Stock symbol is required');
        setLoading(false);
        return;
      }

      // Try to create the stock (will fail if exists, that's ok)
      try {
        await addStock({ symbol, name: '', sector: '' });
      } catch (err: any) {
        if (err.response?.data?.error?.includes('already exists')) {
          // Stock exists, continue
        } else {
          throw err;
        }
      }

      // Fetch the stock to get its ID
      const response = await fetch('/api/stocks/' + symbol);
      const stock = await response.json();
      
      if (!stock.id) {
        throw new Error('Failed to get stock ID');
      }

      await addTransaction({
        stockId: stock.id,
        type: formData.type,
        shares: parseFloat(formData.shares),
        price: parseFloat(formData.price),
        date: formData.date,
        notes: formData.notes,
      });

      setShowForm(false);
      setFormData({
        symbol: '',
        type: 'BUY',
        shares: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      fetchTransactions();
    } catch (err: any) {
      setError(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📝</span>
          <div>
            <h3 className="text-2xl font-bold text-white">Transactions</h3>
            <p className="text-gray-400 text-sm">Track all your buys, sells, and dividends</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            showForm
              ? 'bg-gray-600 hover:bg-gray-500 text-white'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg'
          }`}
        >
          <span className="text-lg">{showForm ? '✕' : '+'}</span>
          <span className="hidden sm:inline">{showForm ? 'Cancel' : 'Add Transaction'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-700/50 p-6 rounded-xl border border-gray-600">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Stock Symbol</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              className="w-full bg-gray-600/50 border border-gray-500 rounded-lg px-4 py-3 uppercase placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., AAPL, MSFT, TSLA"
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-gray-600/50 border border-gray-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              >
                <option value="BUY">📈 BUY</option>
                <option value="SELL">📉 SELL</option>
                <option value="DIVIDEND">💰 DIVIDEND</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Shares</label>
              <input
                type="number"
                step="0.01"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                className="w-full bg-gray-600/50 border border-gray-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-600/50 border border-gray-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-gray-600/50 border border-gray-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-600/50 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Add any notes about this transaction..."
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Adding Transaction...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>✅</span>
                Add Transaction
              </span>
            )}
          </button>
        </form>
      )}

      {transactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-7xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-white mb-2">No Transactions Yet</h3>
          <p className="text-gray-400 mb-4">Start tracking your portfolio by adding your first transaction!</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            + Add Your First Transaction
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Stock</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Shares</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Price</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Total</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className="hover:bg-gray-700/30 transition-colors duration-150 group"
                >
                  <td className="py-4 px-4">
                    <span className="text-gray-300 text-sm">
                      {new Date(tx.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => navigate(`/stock/${tx.stock.symbol}`)}
                      className="flex items-center gap-3 hover:bg-gray-600/30 rounded-lg p-2 -ml-2 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {tx.stock.symbol.substring(0, 2)}
                      </div>
                      <span className="font-bold text-white hover:text-blue-400 transition-colors">{tx.stock.symbol}</span>
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${typeConfig[tx.type as keyof typeof typeConfig].color}`}>
                      <span>{typeConfig[tx.type as keyof typeof typeConfig].icon}</span>
                      <span>{typeConfig[tx.type as keyof typeof typeConfig].label}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">{tx.shares.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-300">${tx.price.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-semibold">${(tx.shares * tx.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      title="Delete transaction"
                    >
                      🗑️ Delete
                    </button>
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

export default Transactions;
