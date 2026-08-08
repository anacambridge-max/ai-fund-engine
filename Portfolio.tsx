// ============================================================
// PORTFOLIO COMPONENT
// ============================================================

import { Wallet, TrendingUp, TrendingDown, Target, RefreshCw } from 'lucide-react';
import { PortfolioHolding, Fund } from '../types';
import { FUNDS } from '../data/funds';
import { formatCurrency, formatPercent, formatLargeNumber } from '../utils/calculations';

interface PortfolioProps {
  holdings: PortfolioHolding[];
}

export const Portfolio = ({ holdings }: PortfolioProps) => {
  const getFundById = (id: number): Fund | undefined => FUNDS.find(f => f.id === id);

  const totalInvested = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalProfit = totalValue - totalInvested;
  const totalProfitPercent = (totalProfit / totalInvested) * 100;

  // Sort by current value descending
  const sortedHoldings = [...holdings].sort((a, b) => b.currentValue - a.currentValue);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-white">{formatLargeNumber(totalInvested)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Current Value</p>
          <p className="text-2xl font-bold text-white">{formatLargeNumber(totalValue)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Total Profit</p>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatLargeNumber(Math.abs(totalProfit))}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Returns</p>
          <p className={`text-2xl font-bold ${totalProfitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercent(totalProfitPercent)}
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Portfolio Holdings</h2>
              <p className="text-sm text-slate-400">{holdings.length} funds in portfolio</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Fund</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Units</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Avg. Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Invested</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Current</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">P&L</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Returns</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Allocation</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Target</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Rebalance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {sortedHoldings.map(holding => {
                const fund = getFundById(holding.fundId);
                const isProfit = holding.profit >= 0;
                const needsRebalance = Math.abs(holding.rebalanceAmount) > 1000;

                return (
                  <tr key={holding.fundId} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{fund?.shortName}</p>
                        <p className="text-xs text-slate-400">{fund?.category}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-slate-300">
                      {holding.units.toFixed(3)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-slate-300">
                      ₹{holding.avgBuyPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-white">
                      {formatCurrency(holding.investedAmount)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-white font-medium">
                      {formatCurrency(holding.currentValue)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className={`flex items-center justify-end gap-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="text-sm">{formatCurrency(Math.abs(holding.profit))}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`text-sm font-medium ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(holding.profitPercent)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${Math.min(holding.allocation * 5, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-300">{holding.allocation.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-slate-400">
                        <Target className="w-3 h-3" />
                        <span className="text-sm">{holding.targetAllocation}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {needsRebalance ? (
                        <div className={`flex items-center justify-end gap-1 ${holding.rebalanceAmount > 0 ? 'text-green-400' : 'text-orange-400'}`}>
                          <RefreshCw className="w-3 h-3" />
                          <span className="text-sm">
                            {holding.rebalanceAmount > 0 ? '+' : ''}{formatCurrency(holding.rebalanceAmount)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
