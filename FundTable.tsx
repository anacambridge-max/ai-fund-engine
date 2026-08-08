// ============================================================
// FUND TABLE COMPONENT
// ============================================================

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown, Star } from 'lucide-react';
import { Fund, NAVData, ReturnsData, AIScore, RiskMetrics, DrawdownData } from '../types';
import { SIGNAL_COLORS, RISK_COLORS } from '../data/funds';
import { formatPercent } from '../utils/calculations';

interface FundTableProps {
  funds: Fund[];
  navData: Map<number, NAVData>;
  returns: Map<number, ReturnsData>;
  aiScores: AIScore[];
  riskMetrics: Map<number, RiskMetrics>;
  drawdowns: Map<number, DrawdownData>;
}

type SortKey = 'name' | 'nav' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'aiScore' | 'risk';
type SortDir = 'asc' | 'desc';

export const FundTable = ({ funds, navData, returns, aiScores, riskMetrics, drawdowns }: FundTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('aiScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedFund, setSelectedFund] = useState<number | null>(null);

  const getAIScore = (fundId: number) => aiScores.find(s => s.fundId === fundId);
  const getRisk = (fundId: number) => riskMetrics.get(fundId);
  const getDrawdown = (fundId: number) => drawdowns.get(fundId);

  const sortedFunds = [...funds].sort((a, b) => {
    let aVal = 0, bVal = 0;
    
    switch (sortKey) {
      case 'name':
        return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      case 'nav':
        aVal = navData.get(a.id)?.nav || 0;
        bVal = navData.get(b.id)?.nav || 0;
        break;
      case 'daily':
        aVal = returns.get(a.id)?.daily || 0;
        bVal = returns.get(b.id)?.daily || 0;
        break;
      case 'weekly':
        aVal = returns.get(a.id)?.weekly || 0;
        bVal = returns.get(b.id)?.weekly || 0;
        break;
      case 'monthly':
        aVal = returns.get(a.id)?.monthly || 0;
        bVal = returns.get(b.id)?.monthly || 0;
        break;
      case 'yearly':
        aVal = returns.get(a.id)?.yearly || 0;
        bVal = returns.get(b.id)?.yearly || 0;
        break;
      case 'aiScore':
        aVal = getAIScore(a.id)?.overallScore || 0;
        bVal = getAIScore(b.id)?.overallScore || 0;
        break;
      case 'risk':
        aVal = getRisk(a.id)?.riskScore || 0;
        bVal = getRisk(b.id)?.riskScore || 0;
        break;
    }
    
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortHeader = ({ label, sortKeyValue }: { label: string; sortKeyValue: SortKey }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
      onClick={() => handleSort(sortKeyValue)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === sortKeyValue && (
          sortDir === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  const ReturnCell = ({ value }: { value: number }) => {
    const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-slate-400';
    const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="w-3 h-3" />
        <span>{formatPercent(value)}</span>
      </div>
    );
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-400" />
          Fund Performance Matrix
        </h2>
        <p className="text-sm text-slate-400 mt-1">Click column headers to sort • Click fund for details</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">#</th>
              <SortHeader label="Fund" sortKeyValue="name" />
              <SortHeader label="NAV" sortKeyValue="nav" />
              <SortHeader label="Daily" sortKeyValue="daily" />
              <SortHeader label="Weekly" sortKeyValue="weekly" />
              <SortHeader label="Monthly" sortKeyValue="monthly" />
              <SortHeader label="1Y" sortKeyValue="yearly" />
              <SortHeader label="AI Score" sortKeyValue="aiScore" />
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Signal</th>
              <SortHeader label="Risk" sortKeyValue="risk" />
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Drawdown</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {sortedFunds.map((fund, idx) => {
              const nav = navData.get(fund.id);
              const ret = returns.get(fund.id);
              const ai = getAIScore(fund.id);
              const dd = getDrawdown(fund.id);
              const isSelected = selectedFund === fund.id;
              
              return (
                <tr 
                  key={fund.id}
                  className={`hover:bg-slate-700/30 cursor-pointer transition-colors ${isSelected ? 'bg-purple-900/20' : ''}`}
                  onClick={() => setSelectedFund(isSelected ? null : fund.id)}
                >
                  <td className="px-4 py-4 text-sm text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{fund.shortName}</p>
                      <p className="text-xs text-slate-400">{fund.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-white">₹{nav?.nav.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <ReturnCell value={ret?.daily || 0} />
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <ReturnCell value={ret?.weekly || 0} />
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <ReturnCell value={ret?.monthly || 0} />
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <ReturnCell value={ret?.yearly || 0} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            (ai?.overallScore || 0) >= 70 ? 'bg-green-500' :
                            (ai?.overallScore || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${ai?.overallScore || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white">{ai?.overallScore || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${SIGNAL_COLORS[ai?.signal || 'Hold']}20`,
                        color: SIGNAL_COLORS[ai?.signal || 'Hold']
                      }}
                    >
                      {ai?.signal || 'Hold'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span 
                      className="text-xs font-medium"
                      style={{ color: RISK_COLORS[fund.riskLevel] }}
                    >
                      {fund.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm ${(dd?.currentDrawdown || 0) < -5 ? 'text-red-400' : 'text-slate-400'}`}>
                      {dd?.currentDrawdown.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
