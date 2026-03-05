import { useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';

function Holdings() {
  const { holdings, fetchHoldings, stocks, addHolding, deleteHolding } = usePortfolioStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    stockId: '',
    shares: '',
    avgCost: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addHolding({
      stockId: parseInt(formData.stockId),
      shares: parseFloat(formData.shares),
      avgCost: parseFloat(formData.avgCost),
      purchaseDate: formData.purchaseDate,
    });
    setShowForm(false);
    setFormData({ stockId: '', shares: '', avgCost: '', purchaseDate: new Date().toISOString().split('T')[0] });
    fetchHoldings();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Holdings</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Holding'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-700 p-4 rounded">
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <select
              value={formData.stockId}
              onChange={(e) => setFormData({ ...formData, stockId: e.target.value })}
              className="w-full bg-gray-600 rounded px-3 py-2"
              required
            >
              <option value="">Select a stock</option>
              {stocks.map((stock) => (
                <option key={stock.id} value={stock.id}>
                  {stock.symbol} {stock.name ? `- ${stock.name}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Shares</label>
              <input
                type="number"
                step="0.01"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                className="w-full bg-gray-600 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Avg Cost ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.avgCost}
                onChange={(e) => setFormData({ ...formData, avgCost: e.target.value })}
                className="w-full bg-gray-600 rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Purchase Date</label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full bg-gray-600 rounded px-3 py-2"
              required
            />
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full">
            Add Holding
          </button>
        </form>
      )}

      {holdings.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No holdings yet. Add your first position!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Stock</th>
                <th className="text-left py-2">Shares</th>
                <th className="text-left py-2">Avg Cost</th>
                <th className="text-left py-2">Purchase Date</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.id} className="border-b border-gray-700">
                  <td className="py-3">
                    <span className="font-bold">{holding.stock.symbol}</span>
                    {holding.stock.name && <span className="text-gray-400 text-sm ml-2">{holding.stock.name}</span>}
                  </td>
                  <td className="py-3">{holding.shares}</td>
                  <td className="py-3">${holding.avgCost.toFixed(2)}</td>
                  <td className="py-3">{new Date(holding.purchaseDate).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button
                      onClick={() => deleteHolding(holding.id)}
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

export default Holdings;
