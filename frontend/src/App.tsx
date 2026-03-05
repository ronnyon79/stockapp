import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Holdings from './components/Holdings';
import Transactions from './components/Transactions';

type Tab = 'dashboard' | 'holdings' | 'transactions';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">📊 StockFolio</h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('holdings')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'holdings' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                Holdings
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'transactions' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                Transactions
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'holdings' && <Holdings />}
        {activeTab === 'transactions' && <Transactions />}
      </main>
    </div>
  );
}

export default App;
