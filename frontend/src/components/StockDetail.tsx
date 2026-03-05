import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const TIME_RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];

interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: string | number;
  volume: number;
  timestamp: string;
}

function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [selectedRange, setSelectedRange] = useState('1M');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      navigate('/holdings');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch current market data
        const marketRes = await fetch(`/api/market/${symbol.toUpperCase()}`);
        const market = await marketRes.json();
        
        if (market.demo) {
          setMarketData({
            symbol: symbol.toUpperCase(),
            price: market.demo.price,
            change: market.demo.change,
            changePercent: market.demo.changePercent,
            volume: market.demo.volume,
            timestamp: market.demo.timestamp
          });
        } else if (market.price) {
          setMarketData(market);
        }

        // Fetch historical data
        const historyRes = await fetch(`/api/market/${symbol.toUpperCase()}/history?range=${selectedRange}`);
        const history = await historyRes.json();

        if (history.data) {
          setPriceData(history.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, selectedRange, navigate]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => navigate('/holdings')}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
        >
          Back to Holdings
        </button>
      </div>
    );
  }

  const currentPrice = marketData?.price || priceData[priceData.length - 1]?.close || 0;
  const startPrice = priceData[0]?.close || currentPrice;
  const priceChange = currentPrice - startPrice;
  const priceChangePercent = startPrice > 0 ? ((priceChange / startPrice) * 100) : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/holdings')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-white">{symbol?.toUpperCase()}</h1>
            <p className="text-gray-400 text-sm">Real-time stock data</p>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="text-5xl font-bold text-white">${currentPrice.toFixed(2)}</div>
          <div className={`flex items-center gap-2 text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>${Math.abs(priceChange).toFixed(2)}</span>
            <span>({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)</span>
          </div>
        </div>

        {marketData && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-gray-400 text-sm">Volume</p>
              <p className="text-white font-medium">{marketData.volume?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Open</p>
              <p className="text-white font-medium">${marketData.price?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">High</p>
              <p className="text-white font-medium">${priceData[priceData.length - 1]?.high.toFixed(2) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Low</p>
              <p className="text-white font-medium">${priceData[priceData.length - 1]?.low.toFixed(2) || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-white">📈 Price History</h2>
          <div className="flex flex-wrap gap-2">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedRange === range
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {priceData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400">No price data available for this period</p>
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return selectedRange === '1D' || selectedRange === '1W'
                      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : selectedRange === '1M' || selectedRange === '3M'
                      ? d.toLocaleDateString('en-US', { month: 'short' })
                      : d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                  }}
                  tick={{ fontSize: 12 }}
                  minTickGap={30}
                />
                <YAxis
                  stroke="#9CA3AF"
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  tick={{ fontSize: 12 }}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'close') return [`$${value.toFixed(2)}`, 'Price'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => {
                    const d = new Date(label);
                    return d.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  }}
                />
                <ReferenceLine
                  y={startPrice}
                  stroke="#6B7280"
                  strokeDasharray="3 3"
                  label={{ value: 'Start', fill: '#9CA3AF', fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={isPositive ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {priceData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Period High</p>
            <p className="text-2xl font-bold text-green-400">
              ${Math.max(...priceData.map(d => d.high)).toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Period Low</p>
            <p className="text-2xl font-bold text-red-400">
              ${Math.min(...priceData.map(d => d.low)).toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Avg Volume</p>
            <p className="text-2xl font-bold text-white">
              {(priceData.reduce((sum, d) => sum + d.volume, 0) / priceData.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockDetail;
