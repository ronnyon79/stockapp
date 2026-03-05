import { useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';

function Stocks() {
  const { stocks, fetchStocks, addStock, deleteStock } = usePortfolioStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    sector: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addStock({
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      sector: formData.sector,
    });
    setShowForm(false);
    setFormData({ symbol: '', name: '', sector: '' });
    fetchStocks();
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Stocks</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Stock'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-700 p-4 rounded">
          <div>
            <label className="block text-sm mb-1">Symbol *</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              className="w-full bg-gray-600 rounded px-3 py-2"
              placeholder="e.g., AAPL"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Company Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-600 rounded px-3 py-2"
              placeholder="e.g., Apple Inc."
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Sector</label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="w-full bg-gray-600 rounded px-3 py-2"
              placeholder="e.g., Technology"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Stock'}
          </button>
        </form>
      )}

      {stocks.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No stocks yet. Add your first stock!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Symbol</th>
                <th className="text-left py-2">Company Name</th>
                <th className="text-left py-2">Sector</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id} className="border-b border-gray-700">
                  <td className="py-3 font-bold text-lg">{stock.symbol}</td>
                  <td className="py-3">{stock.name || '-'}</td>
                  <td className="py-3 text-gray-400">{stock.sector || '-'}</td>
                  <td className="py-3">
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${stock.symbol}? This will remove all related holdings and transactions.`)) {
                          deleteStock(stock.symbol);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
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

export default Stocks;
