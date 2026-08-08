// ============================================================
// RISK ANALYSIS COMPONENT
// ============================================================

import { Shield, AlertTriangle, TrendingDown, Activity, Gauge } from 'lucide-react';
import { RiskMetrics, DrawdownData, Fund } from '../types';
import { FUNDS, RISK_COLORS } from '../data/funds';

interface RiskAnalysisProps {
  riskMetrics: Map<number, RiskMetrics>;
  drawdowns: Map<number, DrawdownData>;
}

export const RiskAnalysis = ({ riskMetrics, drawdowns }: RiskAnalysisProps) => {
  const getFundById = (id: number): Fund | undefined => FUNDS.find(f => f.id === id);

  // Sort by risk score (ascending = safest first)
  const sortedByRisk = Array.from(riskMetrics.entries())
    .sort(([, a], [, b]) => a.riskScore - b.riskScore);

  const getRiskColor = (score: number): string => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBgColor = (score: number): string => {
    if (score <= 30) return 'bg-green-500';
    if (score <= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  

  return (
    <div className="space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-slate-400 text-sm">Low Risk Funds</span>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {Array.from(riskMetrics.values()).filter(r => r.riskScore <= 30).length}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            <span className="text-slate-400 text-sm">Moderate Risk</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {Array.from(riskMetrics.values()).filter(r => r.riskScore > 30 && r.riskScore <= 60).length}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-slate-400 text-sm">High Risk Funds</span>
          </div>
          <p className="text-2xl font-bold text-red-400">
            {Array.from(riskMetrics.values()).filter(r => r.riskScore > 60).length}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-orange-400" />
            <span className="text-slate-400 text-sm">Max Drawdown</span>
          </div>
          <p className="text-2xl font-bold text-orange-400">
            {Math.min(...Array.from(drawdowns.values()).map(d => d.maxDrawdown)).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Risk Metrics Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Risk Analysis Matrix</h2>
            <p className="text-sm text-slate-400">Comprehensive risk metrics for all funds</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Fund</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">Risk Score</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Volatility</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Sharpe</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Sortino</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Max DD</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Current DD</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Beta</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {sortedByRisk.map(([fundId, risk], idx) => {
                const fund = getFundById(fundId);
                const dd = drawdowns.get(fundId);

                return (
                  <tr key={fundId} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-4 text-sm text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{fund?.shortName}</p>
                        <p className="text-xs" style={{ color: RISK_COLORS[fund?.riskLevel || 'Moderate'] }}>
                          {fund?.riskLevel}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getRiskBgColor(risk.riskScore)}`}
                            style={{ width: `${risk.riskScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${getRiskColor(risk.riskScore)}`}>
                          {risk.riskScore.toFixed(0)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-slate-300">
                      {risk.volatility.toFixed(1)}%
                    </td>
                    <td className="px-4 py-4 text-right text-sm">
                      <span className={risk.sharpeRatio >= 1 ? 'text-green-400' : 'text-slate-400'}>
                        {risk.sharpeRatio.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm">
                      <span className={risk.sortinoRatio >= 1 ? 'text-green-400' : 'text-slate-400'}>
                        {risk.sortinoRatio.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-red-400">
                      {risk.maxDrawdown.toFixed(1)}%
                    </td>
                    <td className="px-4 py-4 text-right text-sm">
                      <span className={(dd?.currentDrawdown || 0) < -5 ? 'text-red-400' : 'text-slate-400'}>
                        {dd?.currentDrawdown.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-slate-300">
                      {risk.beta.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {dd?.isRecovered ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          Recovered
                        </span>
                      ) : (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                          In Drawdown
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Legend */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <h3 className="text-sm font-medium text-white mb-3">Risk Metrics Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-400">
          <div>
            <strong className="text-white">Sharpe Ratio:</strong> Risk-adjusted return. &gt;1 is good, &gt;2 is excellent.
          </div>
          <div>
            <strong className="text-white">Sortino Ratio:</strong> Downside risk-adjusted return. Higher is better.
          </div>
          <div>
            <strong className="text-white">Max Drawdown:</strong> Largest peak-to-trough decline.
          </div>
          <div>
            <strong className="text-white">Beta:</strong> Market sensitivity. 1 = market, &gt;1 = more volatile.
          </div>
        </div>
      </div>
    </div>
  );
};
