// ============================================================
// FUND DETAILS MODAL COMPONENT
// ============================================================

import { X, TrendingUp, TrendingDown, Shield, Zap, Target, Activity } from 'lucide-react';
import { Fund, NAVData, ReturnsData, RiskMetrics, AIScore, DrawdownData, RollingReturns } from '../types';
import { SIGNAL_COLORS, RISK_COLORS } from '../data/funds';
import { formatPercent } from '../utils/calculations';

interface FundDetailsProps {
  fund: Fund;
  nav?: NAVData;
  returns?: ReturnsData;
  risk?: RiskMetrics;
  aiScore?: AIScore;
  drawdown?: DrawdownData;
  rolling?: RollingReturns;
  onClose: () => void;
}

export const FundDetails = ({ 
  fund, 
  nav, 
  returns, 
  risk, 
  aiScore, 
  drawdown, 
  rolling,
  onClose 
}: FundDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{fund.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                {fund.category}
              </span>
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${RISK_COLORS[fund.riskLevel]}20`,
                  color: RISK_COLORS[fund.riskLevel]
                }}
              >
                {fund.riskLevel} Risk
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                AMFI: {fund.amfiCode}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* NAV & AI Score */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Current NAV</span>
              </div>
              <p className="text-3xl font-bold text-white">₹{nav?.nav.toFixed(4)}</p>
              <p className={`text-sm mt-1 ${(nav?.dailyReturn || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(nav?.dailyReturn || 0)} today
              </p>
            </div>
            
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-slate-300">AI Analysis</span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-white">{aiScore?.overallScore || 0}</p>
                <span 
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${SIGNAL_COLORS[aiScore?.signal || 'Hold']}20`,
                    color: SIGNAL_COLORS[aiScore?.signal || 'Hold']
                  }}
                >
                  {aiScore?.signal || 'N/A'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{aiScore?.reasoning}</p>
            </div>
          </div>

          {/* Returns */}
          <div className="bg-slate-700/30 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Returns Performance
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {[
                { label: '1D', value: returns?.daily },
                { label: '1W', value: returns?.weekly },
                { label: '1M', value: returns?.monthly },
                { label: '3M', value: returns?.quarterly },
                { label: '6M', value: returns?.halfYearly },
                { label: '1Y', value: returns?.yearly },
                { label: '3Y CAGR', value: returns?.threeYear },
                { label: '5Y CAGR', value: returns?.fiveYear },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className={`text-sm font-bold ${(value || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercent(value || 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rolling Returns */}
          {rolling && (
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Rolling Returns
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[
                  { label: '1M Avg', value: rolling.rolling1M },
                  { label: '3M Avg', value: rolling.rolling3M },
                  { label: '6M Avg', value: rolling.rolling6M },
                  { label: '1Y Avg', value: rolling.rolling1Y },
                  { label: '3Y Avg', value: rolling.rolling3Y },
                  { label: '5Y Avg', value: rolling.rolling5Y },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center bg-slate-600/30 rounded-lg p-2">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className={`text-sm font-bold ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercent(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Metrics */}
          <div className="bg-slate-700/30 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-400" />
              Risk Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Volatility</p>
                <p className="text-lg font-bold text-white">{risk?.volatility.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Sharpe Ratio</p>
                <p className={`text-lg font-bold ${(risk?.sharpeRatio || 0) >= 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {risk?.sharpeRatio.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Sortino Ratio</p>
                <p className={`text-lg font-bold ${(risk?.sortinoRatio || 0) >= 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {risk?.sortinoRatio.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Max Drawdown</p>
                <p className="text-lg font-bold text-red-400">{risk?.maxDrawdown.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Drawdown Status */}
          <div className="bg-slate-700/30 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              Drawdown Analysis
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Current Drawdown</p>
                <p className={`text-lg font-bold ${(drawdown?.currentDrawdown || 0) < -5 ? 'text-red-400' : 'text-slate-300'}`}>
                  {drawdown?.currentDrawdown.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Recovery Status</p>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  drawdown?.isRecovered 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {drawdown?.isRecovered ? 'Recovered' : 'In Drawdown'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Score Breakdown */}
          {aiScore && (
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-4">AI Score Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Return Score', value: aiScore.returnScore },
                  { label: 'Risk Score', value: aiScore.riskScore },
                  { label: 'Momentum Score', value: aiScore.momentumScore },
                  { label: 'Consistency Score', value: aiScore.consistencyScore },
                  { label: 'Drawdown Score', value: aiScore.drawdownScore },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-32">{label}</span>
                    <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white w-8 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
