// ============================================================
// WEEKLY SIGNALS & RECOMMENDATIONS COMPONENT
// ============================================================

import { Zap, Target, DollarSign, Award } from 'lucide-react';
import { WeeklyRecommendation, BuySignal, Fund } from '../types';
import { FUNDS, SIGNAL_COLORS } from '../data/funds';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface WeeklySignalsProps {
  recommendations: WeeklyRecommendation[];
  buySignals: BuySignal[];
}

export const WeeklySignals = ({ recommendations, buySignals }: WeeklySignalsProps) => {
  const getFundById = (id: number): Fund | undefined => FUNDS.find(f => f.id === id);

  return (
    <div className="space-y-6">
      {/* Top 3 Weekly Recommendations */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Weekly Top 3 Opportunities</h2>
            <p className="text-sm text-purple-300">AI-powered investment recommendations for this week</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => {
            const fund = getFundById(rec.fundId);
            const medal = ['🥇', '🥈', '🥉'][idx];
            const bgColor = [
              'from-yellow-500/20 to-yellow-900/20 border-yellow-500/30',
              'from-slate-400/20 to-slate-700/20 border-slate-400/30',
              'from-orange-500/20 to-orange-900/20 border-orange-500/30'
            ][idx];

            return (
              <div 
                key={rec.fundId}
                className={`bg-gradient-to-br ${bgColor} rounded-xl p-5 border`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{medal}</span>
                  <span className="text-sm font-bold text-white bg-purple-600 px-3 py-1 rounded-full">
                    #{rec.rank}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{fund?.shortName}</h3>
                <p className="text-sm text-slate-300 mb-4 line-clamp-2">{rec.reason}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">AI Score</span>
                    <span className="text-white font-bold">{rec.aiScore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Weekly Return</span>
                    <span className={rec.weeklyReturn >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatPercent(rec.weeklyReturn)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Drawdown</span>
                    <span className="text-slate-300">{rec.drawdown.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Risk Level</span>
                    <span className="text-slate-300">{rec.riskLevel}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Suggested</span>
                    <span className="text-xl font-bold text-green-400">
                      {formatCurrency(rec.suggestedAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Buy Signals */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">All Buy Signals</h2>
            <p className="text-sm text-slate-400">Complete signal matrix for all 15 funds</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {buySignals.map(signal => {
            const fund = getFundById(signal.fundId);
            const signalColor = SIGNAL_COLORS[signal.signal];
            
            return (
              <div 
                key={signal.fundId}
                className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-slate-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-white">{fund?.shortName}</p>
                    <p className="text-xs text-slate-400">{fund?.category}</p>
                  </div>
                  <span 
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${signalColor}20`,
                      color: signalColor 
                    }}
                  >
                    {signal.signal}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${signal.strength}%`,
                        backgroundColor: signalColor 
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white">{signal.strength}</span>
                </div>

                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{signal.reason}</p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Target className="w-3 h-3" />
                    <span>{signal.targetAllocation}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 font-medium">
                    <DollarSign className="w-3 h-3" />
                    <span>{formatCurrency(signal.suggestedAmount)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
