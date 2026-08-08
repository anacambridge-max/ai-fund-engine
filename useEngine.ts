// ============================================================
// AI MUTUAL FUND INVESTMENT ENGINE PRO - MAIN ENGINE HOOK
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import { FUNDS } from '../data/funds';
import { 
  NAVData, NAVHistory, ReturnsData, RollingReturns, 
  RiskMetrics, DrawdownData, AIScore, BuySignal, 
  PortfolioHolding, Transaction, WeeklyRecommendation,
  DashboardMetrics, MarketData, LogEntry
} from '../types';
import { 
  calculateReturns, calculateRollingReturns, 
  calculateRiskMetrics, calculateDrawdown 
} from '../utils/calculations';
import { 
  calculateAIScore, generateBuySignals, 
  generateWeeklyRecommendations, calculateBuyMeter, 
  calculateRiskMeter 
} from '../utils/aiEngine';
import { 
  generatePortfolio, generateTransactions,
  generateMarketData, generateDashboardMetrics,
  generateNAVHistory, generateCurrentNAV
} from '../utils/mockData';
import { 
  fetchNavForOurFunds, fetchAllNavHistory, getMarketStatus 
} from '../services/amfiApi';
import { 
  isSupabaseConfigured, loadPortfolio, savePortfolio,
  loadTransactions 
} from '../services/supabase';

interface EngineState {
  isLoading: boolean;
  isInitialized: boolean;
  progress: number;
  currentStep: string;
  navData: Map<number, NAVData>;
  navHistory: Map<number, NAVHistory[]>;
  returns: Map<number, ReturnsData>;
  rollingReturns: Map<number, RollingReturns>;
  riskMetrics: Map<number, RiskMetrics>;
  drawdowns: Map<number, DrawdownData>;
  aiScores: AIScore[];
  buySignals: BuySignal[];
  portfolio: PortfolioHolding[];
  transactions: Transaction[];
  weeklyRecommendations: WeeklyRecommendation[];
  dashboardMetrics: DashboardMetrics | null;
  marketData: MarketData | null;
  logs: LogEntry[];
  lastUpdated: string | null;
  error: string | null;
  dataSource: 'live' | 'simulated';
  marketStatus: { isOpen: boolean; message: string };
}

const initialState: EngineState = {
  isLoading: false,
  isInitialized: false,
  progress: 0,
  currentStep: '',
  navData: new Map(),
  navHistory: new Map(),
  returns: new Map(),
  rollingReturns: new Map(),
  riskMetrics: new Map(),
  drawdowns: new Map(),
  aiScores: [],
  buySignals: [],
  portfolio: [],
  transactions: [],
  weeklyRecommendations: [],
  dashboardMetrics: null,
  marketData: null,
  logs: [],
  lastUpdated: null,
  error: null,
  dataSource: 'simulated',
  marketStatus: { isOpen: false, message: 'Checking...' }
};

export const useEngine = () => {
  const [state, setState] = useState<EngineState>(initialState);

  const addLog = useCallback((level: LogEntry['level'], module: string, message: string) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message
    };
    setState(prev => ({
      ...prev,
      logs: [...prev.logs.slice(-99), entry]
    }));
  }, []);

  const updateProgress = useCallback((progress: number, step: string) => {
    setState(prev => ({ ...prev, progress, currentStep: step }));
  }, []);

  const updateEverything = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null, progress: 0 }));
    addLog('INFO', 'MASTER_ENGINE', '🚀 Starting Update Everything...');
    
    // Check market status
    const marketStatus = getMarketStatus();
    setState(prev => ({ ...prev, marketStatus }));
    addLog('INFO', 'MARKET', `Market Status: ${marketStatus.message}`);

    let navDataMap = new Map<number, NAVData>();
    let navHistoryMap = new Map<number, NAVHistory[]>();
    let dataSource: 'live' | 'simulated' = 'simulated';

    try {
      // ============================================================
      // STEP 1: TRY TO FETCH LIVE NAV DATA
      // ============================================================
      updateProgress(5, 'Connecting to AMFI API...');
      addLog('INFO', 'API_ENGINE', 'Attempting to fetch live NAV data from AMFI...');
      
      try {
        const liveNavData = await fetchNavForOurFunds();
        
        if (liveNavData.size > 0) {
          navDataMap = liveNavData;
          dataSource = 'live';
          addLog('SUCCESS', 'API_ENGINE', `✅ Live NAV data loaded for ${liveNavData.size} funds`);
        }
      } catch (apiError) {
        addLog('WARN', 'API_ENGINE', `AMFI API unavailable: ${apiError}. Using simulated data.`);
      }

      // ============================================================
      // STEP 2: FETCH HISTORICAL NAV DATA
      // ============================================================
      updateProgress(15, 'Downloading NAV History...');
      addLog('INFO', 'HISTORY_ENGINE', 'Fetching historical NAV data...');
      
      try {
        const liveHistory = await fetchAllNavHistory(365);
        
        if (liveHistory.size > 0) {
          navHistoryMap = liveHistory;
          addLog('SUCCESS', 'HISTORY_ENGINE', `✅ Historical NAV loaded for ${liveHistory.size} funds`);
          
          // If we got history but not current NAV, extract current from history
          if (navDataMap.size === 0) {
            FUNDS.forEach(fund => {
              const history = navHistoryMap.get(fund.id);
              if (history && history.length > 0) {
                const latestNav = history[0].nav;
                const previousNav = history[1]?.nav || latestNav;
                navDataMap.set(fund.id, {
                  fundId: fund.id,
                  amfiCode: fund.amfiCode,
                  nav: latestNav,
                  date: history[0].date,
                  previousNav,
                  dailyReturn: ((latestNav - previousNav) / previousNav) * 100
                });
              }
            });
            if (navDataMap.size > 0) {
              dataSource = 'live';
            }
          }
        }
      } catch (historyError) {
        addLog('WARN', 'HISTORY_ENGINE', `Historical data unavailable: ${historyError}`);
      }

      // ============================================================
      // STEP 3: FALLBACK TO SIMULATED DATA IF NEEDED
      // ============================================================
      if (navDataMap.size === 0 || navHistoryMap.size === 0) {
        updateProgress(20, 'Generating simulated data...');
        addLog('INFO', 'MOCK_ENGINE', 'Generating simulated NAV data...');
        
        const amfiNavMap = new Map<string, NAVData>();
        
        for (const fund of FUNDS) {
          if (!navHistoryMap.has(fund.id)) {
            const history = generateNAVHistory(fund.amfiCode, 365);
            navHistoryMap.set(fund.id, history);
          }
          
          if (!navDataMap.has(fund.id)) {
            const history = navHistoryMap.get(fund.id) || [];
            const nav = generateCurrentNAV(fund.amfiCode, history);
            navDataMap.set(fund.id, nav);
            amfiNavMap.set(fund.amfiCode, nav);
          }
        }
        
        dataSource = 'simulated';
        addLog('SUCCESS', 'MOCK_ENGINE', 'Simulated data generated successfully');
      }

      // ============================================================
      // STEP 4: CALCULATE RETURNS
      // ============================================================
      updateProgress(35, 'Calculating Returns...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const returnsMap = new Map<number, ReturnsData>();
      for (const fund of FUNDS) {
        const history = navHistoryMap.get(fund.id) || [];
        const returns = calculateReturns(history, fund.id);
        returnsMap.set(fund.id, returns);
      }
      addLog('SUCCESS', 'RETURN_ENGINE', 'Calculated daily, weekly, monthly, quarterly, yearly returns');

      // ============================================================
      // STEP 5: CALCULATE ROLLING RETURNS
      // ============================================================
      updateProgress(45, 'Calculating Rolling Returns...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const rollingMap = new Map<number, RollingReturns>();
      for (const fund of FUNDS) {
        const history = navHistoryMap.get(fund.id) || [];
        const rolling = calculateRollingReturns(history, fund.id);
        rollingMap.set(fund.id, rolling);
      }
      addLog('SUCCESS', 'ROLLING_ENGINE', 'Calculated 1M, 3M, 6M, 1Y, 3Y, 5Y rolling returns');

      // ============================================================
      // STEP 6: CALCULATE DRAWDOWNS
      // ============================================================
      updateProgress(55, 'Calculating Drawdowns...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const drawdownMap = new Map<number, DrawdownData>();
      for (const fund of FUNDS) {
        const history = navHistoryMap.get(fund.id) || [];
        const drawdown = calculateDrawdown(history, fund.id);
        drawdownMap.set(fund.id, drawdown);
      }
      addLog('SUCCESS', 'DRAWDOWN_ENGINE', 'Calculated max drawdown and recovery metrics');

      // ============================================================
      // STEP 7: CALCULATE RISK METRICS
      // ============================================================
      updateProgress(65, 'Calculating Risk Metrics...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const riskMap = new Map<number, RiskMetrics>();
      for (const fund of FUNDS) {
        const history = navHistoryMap.get(fund.id) || [];
        const returns = returnsMap.get(fund.id);
        const risk = calculateRiskMetrics(history, fund.id, returns?.yearly || 0);
        riskMap.set(fund.id, risk);
      }
      addLog('SUCCESS', 'RISK_ENGINE', 'Calculated volatility, Sharpe, Sortino, beta, alpha');

      // ============================================================
      // STEP 8: CALCULATE AI SCORES
      // ============================================================
      updateProgress(75, 'Running AI Analysis...');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const aiScores: AIScore[] = [];
      for (const fund of FUNDS) {
        const returns = returnsMap.get(fund.id);
        const risk = riskMap.get(fund.id);
        const rolling = rollingMap.get(fund.id);
        const drawdown = drawdownMap.get(fund.id);
        
        if (returns && risk && rolling && drawdown) {
          const score = calculateAIScore(fund, returns, risk, rolling, drawdown);
          aiScores.push(score);
        }
      }
      
      // Sort and assign ranks
      aiScores.sort((a, b) => b.overallScore - a.overallScore);
      aiScores.forEach((score, idx) => { score.rank = idx + 1; });
      addLog('SUCCESS', 'AI_ENGINE', `Generated AI scores for ${aiScores.length} funds`);

      // ============================================================
      // STEP 9: GENERATE BUY SIGNALS
      // ============================================================
      updateProgress(80, 'Generating Buy Signals...');
      const buySignals = generateBuySignals(aiScores);
      addLog('SUCCESS', 'BUY_ENGINE', `Generated ${buySignals.length} buy signals`);

      // ============================================================
      // STEP 10: WEEKLY RECOMMENDATIONS
      // ============================================================
      const weeklyRecs = generateWeeklyRecommendations(aiScores, returnsMap, drawdownMap, riskMap);
      addLog('SUCCESS', 'REPORT_ENGINE', `Top 3 weekly recommendations generated`);

      // ============================================================
      // STEP 11: LOAD/GENERATE PORTFOLIO
      // ============================================================
      updateProgress(85, 'Updating Portfolio...');
      let portfolio: PortfolioHolding[] = [];
      let transactions: Transaction[] = [];
      
      // Try to load from Supabase first
      if (isSupabaseConfigured()) {
        addLog('INFO', 'SUPABASE', 'Loading portfolio from Supabase...');
        const savedPortfolio = await loadPortfolio();
        const savedTransactions = await loadTransactions();
        
        if (savedPortfolio && savedPortfolio.length > 0) {
          portfolio = savedPortfolio;
          addLog('SUCCESS', 'SUPABASE', `Loaded ${portfolio.length} holdings from database`);
        }
        
        if (savedTransactions && savedTransactions.length > 0) {
          transactions = savedTransactions;
        }
      }
      
      // Generate simulated portfolio if not loaded
      if (portfolio.length === 0) {
        const amfiNavMap = new Map<string, NAVData>();
        navDataMap.forEach((nav, fundId) => {
          const fund = FUNDS.find(f => f.id === fundId);
          if (fund) amfiNavMap.set(fund.amfiCode, nav);
        });
        portfolio = generatePortfolio(amfiNavMap);
        transactions = generateTransactions();
      }
      
      // Update portfolio with current NAV values
      portfolio = portfolio.map(holding => {
        const nav = navDataMap.get(holding.fundId);
        if (nav) {
          const currentValue = holding.units * nav.nav;
          const profit = currentValue - holding.investedAmount;
          return {
            ...holding,
            currentValue,
            profit,
            profitPercent: (profit / holding.investedAmount) * 100
          };
        }
        return holding;
      });
      
      // Calculate allocations
      const totalValue = portfolio.reduce((sum, h) => sum + h.currentValue, 0);
      portfolio = portfolio.map(h => ({
        ...h,
        allocation: (h.currentValue / totalValue) * 100
      }));
      
      addLog('SUCCESS', 'PORTFOLIO_ENGINE', 'Portfolio updated with current values');

      // ============================================================
      // STEP 12: MARKET DATA
      // ============================================================
      updateProgress(90, 'Fetching Market Data...');
      const marketData = generateMarketData();
      addLog('SUCCESS', 'MARKET_ENGINE', 'Market data refreshed');

      // ============================================================
      // STEP 13: DASHBOARD METRICS
      // ============================================================
      updateProgress(95, 'Refreshing Dashboard...');
      const todaysChanges = new Map<number, number>();
      navDataMap.forEach((nav, fundId) => {
        todaysChanges.set(fundId, nav.dailyReturn);
      });
      
      const dashboardMetrics = generateDashboardMetrics(portfolio, todaysChanges);
      dashboardMetrics.topAIFund = FUNDS.find(f => f.id === aiScores[0]?.fundId) || null;
      dashboardMetrics.topWeeklyFund = FUNDS.find(f => f.id === weeklyRecs[0]?.fundId) || null;
      dashboardMetrics.buyMeterValue = calculateBuyMeter(aiScores);
      dashboardMetrics.riskMeterValue = calculateRiskMeter(riskMap);
      
      addLog('SUCCESS', 'DASHBOARD_ENGINE', 'Dashboard metrics refreshed');

      // ============================================================
      // STEP 14: SAVE TO SUPABASE (if configured)
      // ============================================================
      if (isSupabaseConfigured()) {
        updateProgress(98, 'Saving to database...');
        await savePortfolio(portfolio);
        addLog('SUCCESS', 'SUPABASE', 'Data saved to Supabase');
      }

      // ============================================================
      // COMPLETE!
      // ============================================================
      updateProgress(100, 'Complete!');
      addLog('SUCCESS', 'MASTER_ENGINE', `✅ Update completed! Data source: ${dataSource.toUpperCase()}`);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isInitialized: true,
        navData: navDataMap,
        navHistory: navHistoryMap,
        returns: returnsMap,
        rollingReturns: rollingMap,
        riskMetrics: riskMap,
        drawdowns: drawdownMap,
        aiScores,
        buySignals,
        portfolio,
        transactions,
        weeklyRecommendations: weeklyRecs,
        dashboardMetrics,
        marketData,
        lastUpdated: new Date().toISOString(),
        dataSource
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog('ERROR', 'MASTER_ENGINE', `Update failed: ${errorMessage}`);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [addLog, updateProgress]);

  // Auto-initialize on mount
  useEffect(() => {
    if (!state.isInitialized && !state.isLoading) {
      updateEverything();
    }
  }, [state.isInitialized, state.isLoading, updateEverything]);

  return {
    ...state,
    updateEverything,
    funds: FUNDS
  };
};
