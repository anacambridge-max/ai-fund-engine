// ============================================================
// AI MUTUAL FUND INVESTMENT ENGINE PRO - MAIN APPLICATION
// ============================================================

import { useState } from 'react';
import { 
  LayoutDashboard, TrendingUp, Shield, Wallet, 
  Zap, BarChart3, FileText, Terminal, PieChart
} from 'lucide-react';
import { useEngine } from './hooks/useEngine';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { MetricCard, GaugeMeter } from './components/MetricCard';
import { FundTable } from './components/FundTable';
import { AllocationChart, SectorChart, AIScoreChart, ReturnsHeatmap, CategoryChart } from './components/Charts';
import { WeeklySignals } from './components/WeeklySignals';
import { Portfolio } from './components/Portfolio';
import { RiskAnalysis } from './components/RiskAnalysis';
import { Logs } from './components/Logs';
import { QuickStats } from './components/QuickStats';
import { FUNDS } from './data/funds';
import { formatLargeNumber } from './utils/calculations';

type Tab = 'dashboard' | 'funds' | 'signals' | 'portfolio' | 'risk' | 'charts' | 'reports' | 'logs';

function App() {
  const engine = useEngine();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Show loading screen while initializing
  if (!engine.isInitialized && engine.isLoading) {
    return <LoadingScreen progress={engine.progress} currentStep={engine.currentStep} />;
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'funds', label: 'Funds', icon: TrendingUp },
    { id: 'signals', label: 'AI Signals', icon: Zap },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'risk', label: 'Risk', icon: Shield },
    { id: 'charts', label: 'Charts', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'logs', label: 'Logs', icon: Terminal },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Portfolio Value"
                value={engine.dashboardMetrics?.currentValue || 0}
                subtitle={`Invested: ${formatLargeNumber(engine.dashboardMetrics?.totalInvested || 0)}`}
                icon={Wallet}
                type="currency"
                trend={engine.dashboardMetrics?.totalProfit && engine.dashboardMetrics.totalProfit >= 0 ? 'up' : 'down'}
                accentColor="bg-gradient-to-br from-purple-500 to-pink-500"
              />
              <MetricCard
                title="Today's Gain"
                value={engine.dashboardMetrics?.todaysGain || 0}
                subtitle="Intraday change"
                icon={TrendingUp}
                type="currency"
                trend={engine.dashboardMetrics?.todaysGain && engine.dashboardMetrics.todaysGain >= 0 ? 'up' : 'down'}
                accentColor="bg-gradient-to-br from-green-500 to-emerald-500"
              />
              <MetricCard
                title="Total Returns"
                value={engine.dashboardMetrics?.profitPercent || 0}
                subtitle={`Profit: ${formatLargeNumber(engine.dashboardMetrics?.totalProfit || 0)}`}
                icon={BarChart3}
                type="percent"
                trend={engine.dashboardMetrics?.profitPercent && engine.dashboardMetrics.profitPercent >= 0 ? 'up' : 'down'}
                accentColor="bg-gradient-to-br from-blue-500 to-cyan-500"
              />
              <MetricCard
                title="Top AI Fund"
                value={engine.aiScores[0]?.overallScore || 0}
                subtitle={engine.dashboardMetrics?.topAIFund?.shortName || 'Loading...'}
                icon={Zap}
                type="score"
                trend="up"
                accentColor="bg-gradient-to-br from-yellow-500 to-orange-500"
              />
            </div>

            {/* Meters */}
            <div className="grid md:grid-cols-2 gap-4">
              <GaugeMeter 
                title="Buy Meter" 
                value={engine.dashboardMetrics?.buyMeterValue || 50} 
                type="buy" 
              />
              <GaugeMeter 
                title="Risk Meter" 
                value={engine.dashboardMetrics?.riskMeterValue || 50} 
                type="risk" 
              />
            </div>

            {/* Top 3 Recommendations Quick View */}
            {engine.weeklyRecommendations.length > 0 && (
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  This Week's Top 3 Opportunities
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {engine.weeklyRecommendations.map((rec, idx) => {
                    const fund = FUNDS.find(f => f.id === rec.fundId);
                    const medal = ['🥇', '🥈', '🥉'][idx];
                    return (
                      <div key={rec.fundId} className="bg-slate-800/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{medal}</span>
                          <span className="text-white font-medium">{fund?.shortName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">AI Score</span>
                          <span className="text-purple-400 font-bold">{rec.aiScore}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Suggested</span>
                          <span className="text-green-400 font-bold">₹{rec.suggestedAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <AllocationChart portfolio={engine.portfolio} funds={FUNDS} />
              <AIScoreChart aiScores={engine.aiScores} />
            </div>

            {/* Quick Stats */}
            <QuickStats 
              aiScores={engine.aiScores}
              returns={engine.returns}
              riskMetrics={engine.riskMetrics}
            />

            {/* Fund Performance Table */}
            <FundTable 
              funds={FUNDS}
              navData={engine.navData}
              returns={engine.returns}
              aiScores={engine.aiScores}
              riskMetrics={engine.riskMetrics}
              drawdowns={engine.drawdowns}
            />
          </div>
        );

      case 'funds':
        return (
          <div className="space-y-6">
            <FundTable 
              funds={FUNDS}
              navData={engine.navData}
              returns={engine.returns}
              aiScores={engine.aiScores}
              riskMetrics={engine.riskMetrics}
              drawdowns={engine.drawdowns}
            />
            <ReturnsHeatmap funds={FUNDS} returns={engine.returns} />
          </div>
        );

      case 'signals':
        return (
          <WeeklySignals 
            recommendations={engine.weeklyRecommendations}
            buySignals={engine.buySignals}
          />
        );

      case 'portfolio':
        return <Portfolio holdings={engine.portfolio} />;

      case 'risk':
        return (
          <RiskAnalysis 
            riskMetrics={engine.riskMetrics}
            drawdowns={engine.drawdowns}
          />
        );

      case 'charts':
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <AllocationChart portfolio={engine.portfolio} funds={FUNDS} />
            <SectorChart funds={FUNDS} portfolio={engine.portfolio} />
            <AIScoreChart aiScores={engine.aiScores} />
            <CategoryChart funds={FUNDS} />
            <div className="lg:col-span-2">
              <ReturnsHeatmap funds={FUNDS} returns={engine.returns} />
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            {/* Weekly Report */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-bold text-white mb-4">📊 Weekly Performance Report</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300">
                  Report generated on {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
                
                <h3 className="text-lg font-semibold text-white mt-4">Portfolio Summary</h3>
                <ul className="text-slate-300 space-y-1">
                  <li>Total Invested: {formatLargeNumber(engine.dashboardMetrics?.totalInvested || 0)}</li>
                  <li>Current Value: {formatLargeNumber(engine.dashboardMetrics?.currentValue || 0)}</li>
                  <li>Total Returns: {(engine.dashboardMetrics?.profitPercent || 0).toFixed(2)}%</li>
                  <li>Funds in Portfolio: 15</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mt-4">Top Performers This Week</h3>
                <ol className="text-slate-300">
                  {engine.aiScores.slice(0, 5).map((score) => {
                    const fund = FUNDS.find(f => f.id === score.fundId);
                    const returns = engine.returns.get(score.fundId);
                    return (
                      <li key={score.fundId}>
                        <strong>{fund?.shortName}</strong> - AI Score: {score.overallScore}, 
                        Weekly: {(returns?.weekly || 0).toFixed(2)}%
                      </li>
                    );
                  })}
                </ol>

                <h3 className="text-lg font-semibold text-white mt-4">AI Recommendations</h3>
                <p className="text-slate-300">
                  Based on the AI analysis, the top 3 funds for investment this week are:
                </p>
                <ol className="text-slate-300">
                  {engine.weeklyRecommendations.map(rec => {
                    const fund = FUNDS.find(f => f.id === rec.fundId);
                    return (
                      <li key={rec.fundId}>
                        <strong>{fund?.shortName}</strong> - {rec.reason}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Monthly Report */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-bold text-white mb-4">📈 Monthly Analysis Report</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-white">Category Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {['Flexi Cap', 'Index Fund', 'Small Cap', 'Mid Cap', 'Sectoral', 'ELSS'].map(cat => {
                    const categoryFunds = FUNDS.filter(f => f.category === cat);
                    const avgReturn = categoryFunds.reduce((sum, f) => {
                      const ret = engine.returns.get(f.id);
                      return sum + (ret?.monthly || 0);
                    }, 0) / (categoryFunds.length || 1);
                    
                    return (
                      <div key={cat} className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-sm text-slate-400">{cat}</p>
                        <p className={`text-lg font-bold ${avgReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {avgReturn.toFixed(2)}%
                        </p>
                      </div>
                    );
                  })}
                </div>

                <h3 className="text-lg font-semibold text-white mt-6">Risk Analysis Summary</h3>
                <p className="text-slate-300">
                  Average portfolio volatility: {
                    (Array.from(engine.riskMetrics.values())
                      .reduce((sum, r) => sum + r.volatility, 0) / engine.riskMetrics.size || 0).toFixed(2)
                  }%
                </p>
                <p className="text-slate-300">
                  Average Sharpe Ratio: {
                    (Array.from(engine.riskMetrics.values())
                      .reduce((sum, r) => sum + r.sharpeRatio, 0) / engine.riskMetrics.size || 0).toFixed(2)
                  }
                </p>
              </div>
            </div>
          </div>
        );

      case 'logs':
        return <Logs logs={engine.logs} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <Header 
        onUpdate={engine.updateEverything}
        isLoading={engine.isLoading}
        lastUpdated={engine.lastUpdated}
        marketData={engine.marketData}
        dataSource={engine.dataSource}
        marketStatus={engine.marketStatus}
      />

      <div className="max-w-[1920px] mx-auto px-6 py-6">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Content */}
        <main>
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            AI Mutual Fund Engine PRO • 15 Curated Funds • Enterprise Investment Intelligence
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Data is simulated for demonstration. Not financial advice.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
