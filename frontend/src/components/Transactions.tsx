import { useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';

function Transactions() {
  const { transactions, fetchTransactions, stocks, addTransaction, deleteTransaction } = usePortfolioStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    stockId: '',
    type: 'BUY',
    shares: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTransaction({
      stockId: parseInt(formData.stockId),
      type: formData.type,
      shares: parseFloat(formData.shares),
      price: parseFloat(formData.price),
      date: formData.date,
      notes: formData.notes,
    });
    setShowForm(false);
    setFormData({
      stockId: '',
      type: 'BUY',
      shares: '',
      price: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    fetchTransactions();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Transactions</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Transaction'}
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
              <label className="block text-sm mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-gray-600 rounded px-3 py-2"
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="DIVIDEND">DIVIDEND</option>
              </select>
            </div>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-600 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-gray-600 rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Notes (optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-600 rounded px-3 py-2"
              placeholder="Optional notes"
            />
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full">
            Add Transaction
          </button>
        </form>
      )}

      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Stock</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Shares</th>
                <th className="text-left py-2">Price</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-700">
                  <td className="py-3">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="py-3 font-bold">{tx.stock.symbol}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        tx.type === 'BUY'
                          ? 'bg-green-600'
                          : tx.type === 'SELL'
                          ? 'bg-red-600'
                          : 'bg-blue-600'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3">{tx.shares}</td>
                  <td className="py-3">${tx.price.toFixed(2)}</td>
                  <td className="py-3">${(tx.shares * tx.price).toFixed(2)}</td>
                  <td className="py-3">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
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

export default Transactions;
