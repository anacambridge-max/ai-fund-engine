// ============================================================
// QUICK STATS COMPONENT
// ============================================================

import { TrendingUp, Activity } from 'lucide-react';
import { AIScore, ReturnsData, RiskMetrics } from '../types';

interface QuickStatsProps {
  aiScores: AIScore[];
  returns: Map<number, ReturnsData>;
  riskMetrics: Map<number, RiskMetrics>;
}

export const QuickStats = ({ aiScores, returns, riskMetrics }: QuickStatsProps) => {
  // Calculate stats
  const avgAIScore = aiScores.reduce((sum, s) => sum + s.overallScore, 0) / (aiScores.length || 1);
  
  const positiveWeeklyCount = Array.from(returns.values()).filter(r => r.weekly > 0).length;
  const positiveMonthlyCount = Array.from(returns.values()).filter(r => r.monthly > 0).length;
  
  const avgSharpe = Array.from(riskMetrics.values()).reduce((sum, r) => sum + r.sharpeRatio, 0) / (riskMetrics.size || 1);

  const strongBuyCount = aiScores.filter(s => s.signal === 'Strong Buy').length;
  const buyCount = aiScores.filter(s => s.signal === 'Buy').length;
  const holdCount = aiScores.filter(s => s.signal === 'Hold').length;
  const avoidCount = aiScores.filter(s => s.signal === 'Avoid').length;

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        Quick Statistics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* AI Score */}
        <div className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Avg AI Score</p>
          <p className="text-2xl font-bold text-purple-400">{avgAIScore.toFixed(0)}</p>
        </div>

        {/* Weekly Winners */}
        <div className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Weekly Winners</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-2xl font-bold text-green-400">{positiveWeeklyCount}</span>
            <span className="text-sm text-slate-500">/ 15</span>
          </div>
        </div>

        {/* Monthly Winners */}
        <div className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Monthly Winners</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-2xl font-bold text-blue-400">{positiveMonthlyCount}</span>
            <span className="text-sm text-slate-500">/ 15</span>
          </div>
        </div>

        {/* Avg Sharpe */}
        <div className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Avg Sharpe</p>
          <p className={`text-2xl font-bold ${avgSharpe >= 1 ? 'text-green-400' : 'text-yellow-400'}`}>
            {avgSharpe.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Signal Distribution */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-sm text-slate-400 mb-3">Signal Distribution</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-green-500/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-400">{strongBuyCount}</p>
            <p className="text-xs text-green-400/70">Strong Buy</p>
          </div>
          <div className="flex-1 bg-lime-500/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-lime-400">{buyCount}</p>
            <p className="text-xs text-lime-400/70">Buy</p>
          </div>
          <div className="flex-1 bg-yellow-500/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-yellow-400">{holdCount}</p>
            <p className="text-xs text-yellow-400/70">Hold</p>
          </div>
          <div className="flex-1 bg-red-500/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-red-400">{avoidCount}</p>
            <p className="text-xs text-red-400/70">Avoid</p>
          </div>
        </div>
      </div>
    </div>
  );
};
