import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Holdings from './components/Holdings';
import Transactions from './components/Transactions';

type Tab = 'dashboard' | 'holdings' | 'transactions';

const tabs = [
  { id: 'dashboard' as Tab, label: 'Dashboard', icon: '📊' },
  { id: 'holdings' as Tab, label: 'Holdings', icon: '💼' },
  { id: 'transactions' as Tab, label: 'Transactions', icon: '📝' },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              📊 StockFolio
            </h1>
            <nav className="flex space-x-2 bg-gray-700/50 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
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

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        <p>StockFolio v0.3.0 • Built with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
