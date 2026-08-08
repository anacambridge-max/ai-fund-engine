// ============================================================
// HEADER COMPONENT
// ============================================================

import { RefreshCw, TrendingUp, Clock, Wifi, WifiOff } from 'lucide-react';
import { MarketData } from '../types';
import { format } from 'date-fns';

interface HeaderProps {
  onUpdate: () => void;
  isLoading: boolean;
  lastUpdated: string | null;
  marketData: MarketData | null;
  dataSource?: 'live' | 'simulated';
  marketStatus?: { isOpen: boolean; message: string };
}

export const Header = ({ onUpdate, isLoading, lastUpdated, marketData, dataSource, marketStatus }: HeaderProps) => {
  const formatMarketChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'text-green-400' : 'text-red-400';
    return <span className={color}>{sign}{change.toFixed(2)}%</span>;
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                AI Mutual Fund Engine
                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full">
                  PRO
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400">Enterprise Investment Intelligence</p>
                {/* Data Source Badge */}
                {dataSource && (
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    dataSource === 'live' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {dataSource === 'live' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {dataSource === 'live' ? 'LIVE' : 'SIMULATED'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Market Status */}
            {marketStatus && (
              <div className={`text-xs px-3 py-1.5 rounded-full ${
                marketStatus.isOpen 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-slate-700/50 text-slate-400'
              }`}>
                {marketStatus.isOpen ? '🟢' : '🔴'} {marketStatus.message}
              </div>
            )}
            
            {marketData && (
              <div className="flex items-center gap-6 bg-slate-800/50 rounded-xl px-4 py-2">
                <div className="text-center">
                  <div className="text-xs text-slate-400">NIFTY 50</div>
                  <div className="text-sm font-semibold text-white flex items-center gap-1">
                    {marketData.nifty50.toFixed(0)}
                    {formatMarketChange(marketData.nifty50Change)}
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-600" />
                <div className="text-center">
                  <div className="text-xs text-slate-400">SENSEX</div>
                  <div className="text-sm font-semibold text-white flex items-center gap-1">
                    {marketData.sensex.toFixed(0)}
                    {formatMarketChange(marketData.sensexChange)}
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-600" />
                <div className="text-center">
                  <div className="text-xs text-slate-400">Sentiment</div>
                  <div className={`text-sm font-semibold flex items-center gap-1 ${
                    marketData.marketSentiment === 'Bullish' ? 'text-green-400' :
                    marketData.marketSentiment === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {marketData.marketSentiment}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Last Updated */}
            {lastUpdated && (
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Updated: {format(new Date(lastUpdated), 'HH:mm:ss')}</span>
              </div>
            )}

            {/* Update Button */}
            <button
              onClick={onUpdate}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Updating...' : 'Update Everything'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
