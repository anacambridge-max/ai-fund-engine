// ============================================================
// TOP FUND HIGHLIGHT CARD COMPONENT
// ============================================================

import { Crown, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { Fund, AIScore, ReturnsData } from '../types';
import { SIGNAL_COLORS, RISK_COLORS } from '../data/funds';

interface TopFundCardProps {
  title: string;
  fund: Fund | null;
  aiScore?: AIScore;
  returns?: ReturnsData;
  type: 'ai' | 'weekly' | 'monthly';
}

export const TopFundCard = ({ title, fund, aiScore, returns, type }: TopFundCardProps) => {
  if (!fund) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/2 mb-4" />
        <div className="h-8 bg-slate-700 rounded w-3/4" />
      </div>
    );
  }

  const getGradient = () => {
    switch (type) {
      case 'ai':
        return 'from-purple-600/20 to-pink-600/20 border-purple-500/30';
      case 'weekly':
        return 'from-blue-600/20 to-cyan-600/20 border-blue-500/30';
      case 'monthly':
        return 'from-green-600/20 to-emerald-600/20 border-green-500/30';
      default:
        return 'from-slate-600/20 to-slate-700/20 border-slate-500/30';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'ai':
        return <Zap className="w-5 h-5 text-purple-400" />;
      case 'weekly':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'monthly':
        return <Crown className="w-5 h-5 text-green-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getGradient()} rounded-2xl p-6 border`}>
      <div className="flex items-center gap-2 mb-4">
        {getIcon()}
        <span className="text-sm font-medium text-slate-300">{title}</span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{fund.shortName}</h3>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
          {fund.category}
        </span>
        <span 
          className="text-xs px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: `${RISK_COLORS[fund.riskLevel]}20`,
            color: RISK_COLORS[fund.riskLevel]
          }}
        >
          {fund.riskLevel}
        </span>
      </div>

      <div className="space-y-2">
        {aiScore && (
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">AI Score</span>
            <span className="text-sm font-bold text-white">{aiScore.overallScore}</span>
          </div>
        )}
        {aiScore && (
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Signal</span>
            <span 
              className="text-sm font-bold"
              style={{ color: SIGNAL_COLORS[aiScore.signal] }}
            >
              {aiScore.signal}
            </span>
          </div>
        )}
        {returns && (
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">
              {type === 'weekly' ? 'Weekly' : type === 'monthly' ? 'Monthly' : 'Yearly'}
            </span>
            <span className={`text-sm font-bold ${
              (type === 'weekly' ? returns.weekly : type === 'monthly' ? returns.monthly : returns.yearly) >= 0 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {(type === 'weekly' ? returns.weekly : type === 'monthly' ? returns.monthly : returns.yearly).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
