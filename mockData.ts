// ============================================================
// AI MUTUAL FUND INVESTMENT ENGINE PRO - MOCK DATA GENERATOR
// ============================================================

import { FUNDS } from '../data/funds';
import { NAVData, NAVHistory, PortfolioHolding, Transaction, MarketData, DashboardMetrics } from '../types';
import { format, subDays, isFriday } from 'date-fns';

// ============================================================
// NAV DATA GENERATION
// ============================================================

// Realistic base NAVs for each fund (as of late 2024)
const BASE_NAVS: Record<string, number> = {
  '120828': 112.45,  // Quant Flexi Cap
  '120833': 98.67,   // Quant Large & Mid
  '150480': 42.31,   // Quant Multi Cap
  '120847': 118.92,  // Quant Multi Asset
  '120465': 65.78,   // Quant Infrastructure
  '147949': 28.45,   // Quant BFSI
  '135804': 48.92,   // Tata Digital India
  '119597': 205.34,  // SBI Nifty 50
  '130427': 21.67,   // UTI Nifty Next 50
  '100534': 98.23,   // HDFC Mid Cap
  '125497': 195.67,  // SBI Small Cap
  '145455': 35.82,   // Bandhan Small Cap
  '100666': 442.56,  // ICICI Value
  '120503': 92.34,   // Axis ELSS
  '119850': 25.78,   // UTI Gold
};

// Volatility factors for realistic price movements
const VOLATILITY: Record<string, number> = {
  '120828': 0.025,
  '120833': 0.022,
  '150480': 0.023,
  '120847': 0.018,
  '120465': 0.028,
  '147949': 0.026,
  '135804': 0.030,
  '119597': 0.012,
  '130427': 0.015,
  '100534': 0.020,
  '125497': 0.028,
  '145455': 0.032,
  '100666': 0.018,
  '120503': 0.020,
  '119850': 0.010,
};

// Generate random walk with drift
const generateRandomWalk = (baseNav: number, volatility: number, days: number, drift: number = 0.0003): number[] => {
  const navs: number[] = [baseNav];
  let currentNav = baseNav;
  
  for (let i = 1; i < days; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility + drift;
    currentNav = currentNav * (1 + change);
    navs.push(Number(currentNav.toFixed(4)));
  }
  
  return navs.reverse(); // Most recent first
};

export const generateNAVHistory = (amfiCode: string, days: number = 365): NAVHistory[] => {
  const baseNav = BASE_NAVS[amfiCode] || 100;
  const volatility = VOLATILITY[amfiCode] || 0.02;
  const navValues = generateRandomWalk(baseNav, volatility, days);
  
  const history: NAVHistory[] = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    history.push({
      date: format(date, 'yyyy-MM-dd'),
      nav: navValues[i]
    });
  }
  
  return history;
};

export const generateCurrentNAV = (amfiCode: string, history: NAVHistory[]): NAVData => {
  const fund = FUNDS.find(f => f.amfiCode === amfiCode);
  const latestNav = history[0]?.nav || BASE_NAVS[amfiCode] || 100;
  const previousNav = history[1]?.nav || latestNav;
  const dailyReturn = ((latestNav - previousNav) / previousNav) * 100;
  
  return {
    fundId: fund?.id || 0,
    amfiCode,
    nav: latestNav,
    date: format(new Date(), 'yyyy-MM-dd'),
    previousNav,
    dailyReturn
  };
};

// ============================================================
// PORTFOLIO DATA GENERATION
// ============================================================

export const generatePortfolio = (navData: Map<string, NAVData>): PortfolioHolding[] => {
  const portfolioAmounts: Record<string, number> = {
    '120828': 50000,   // Quant Flexi Cap
    '120833': 35000,   // Quant Large & Mid
    '150480': 25000,   // Quant Multi Cap
    '120847': 40000,   // Quant Multi Asset
    '120465': 20000,   // Quant Infrastructure
    '147949': 15000,   // Quant BFSI
    '135804': 25000,   // Tata Digital India
    '119597': 60000,   // SBI Nifty 50
    '130427': 30000,   // UTI Nifty Next 50
    '100534': 45000,   // HDFC Mid Cap
    '125497': 55000,   // SBI Small Cap
    '145455': 20000,   // Bandhan Small Cap
    '100666': 50000,   // ICICI Value
    '120503': 40000,   // Axis ELSS
    '119850': 25000,   // UTI Gold
  };
  
  const totalInvested = Object.values(portfolioAmounts).reduce((a, b) => a + b, 0);
  const holdings: PortfolioHolding[] = [];
  
  FUNDS.forEach(fund => {
    const nav = navData.get(fund.amfiCode);
    if (!nav) return;
    
    const invested = portfolioAmounts[fund.amfiCode] || 0;
    const avgBuyPrice = nav.nav * (0.9 + Math.random() * 0.15); // Bought at random prices
    const units = invested / avgBuyPrice;
    const currentValue = units * nav.nav;
    const profit = currentValue - invested;
    const profitPercent = (profit / invested) * 100;
    const allocation = (invested / totalInvested) * 100;
    
    // Target allocation based on category
    let targetAllocation = 6.67; // Default equal weight
    if (fund.category === 'Index Fund') targetAllocation = 10;
    if (fund.category === 'Small Cap') targetAllocation = 5;
    if (fund.riskLevel === 'Very High') targetAllocation = 5;
    
    const rebalanceAmount = (targetAllocation - allocation) * totalInvested / 100;
    
    holdings.push({
      fundId: fund.id,
      units: Number(units.toFixed(3)),
      avgBuyPrice: Number(avgBuyPrice.toFixed(2)),
      investedAmount: invested,
      currentValue: Number(currentValue.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      profitPercent: Number(profitPercent.toFixed(2)),
      allocation: Number(allocation.toFixed(2)),
      targetAllocation,
      rebalanceAmount: Number(rebalanceAmount.toFixed(0))
    });
  });
  
  return holdings;
};

// ============================================================
// TRANSACTION GENERATION
// ============================================================

export const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const types: Transaction['type'][] = ['BUY', 'SIP'];
  
  // Generate past transactions
  for (let i = 0; i < 30; i++) {
    const fund = FUNDS[Math.floor(Math.random() * FUNDS.length)];
    const nav = BASE_NAVS[fund.amfiCode] * (0.9 + Math.random() * 0.2);
    const amount = [1000, 2000, 5000, 10000][Math.floor(Math.random() * 4)];
    const date = subDays(new Date(), Math.floor(Math.random() * 180));
    
    transactions.push({
      id: `TXN-${Date.now()}-${i}`,
      fundId: fund.id,
      type: types[Math.floor(Math.random() * types.length)],
      units: Number((amount / nav).toFixed(3)),
      nav: Number(nav.toFixed(2)),
      amount,
      date: format(date, 'yyyy-MM-dd')
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// ============================================================
// MARKET DATA GENERATION
// ============================================================

export const generateMarketData = (): MarketData => {
  const niftyChange = (Math.random() - 0.5) * 2;
  const nextChange = (Math.random() - 0.5) * 2.5;
  const sensexChange = (Math.random() - 0.5) * 1.8;
  
  const avgChange = (niftyChange + nextChange + sensexChange) / 3;
  let sentiment: MarketData['marketSentiment'] = 'Neutral';
  if (avgChange > 0.5) sentiment = 'Bullish';
  if (avgChange < -0.5) sentiment = 'Bearish';
  
  return {
    nifty50: 24850.35 + (Math.random() - 0.5) * 200,
    nifty50Change: niftyChange,
    niftyNext50: 73250.82 + (Math.random() - 0.5) * 500,
    niftyNext50Change: nextChange,
    sensex: 81245.67 + (Math.random() - 0.5) * 400,
    sensexChange: sensexChange,
    marketSentiment: sentiment,
    lastUpdated: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  };
};

// ============================================================
// DASHBOARD METRICS
// ============================================================

export const generateDashboardMetrics = (
  portfolio: PortfolioHolding[],
  todaysChanges: Map<number, number>
): DashboardMetrics => {
  const totalInvested = portfolio.reduce((sum, h) => sum + h.investedAmount, 0);
  const currentValue = portfolio.reduce((sum, h) => sum + h.currentValue, 0);
  const totalProfit = currentValue - totalInvested;
  const profitPercent = (totalProfit / totalInvested) * 100;
  
  // Calculate today's gain
  let todaysGain = 0;
  portfolio.forEach(h => {
    const dailyChange = todaysChanges.get(h.fundId) || 0;
    todaysGain += h.currentValue * (dailyChange / 100);
  });
  
  return {
    totalInvested,
    currentValue,
    totalProfit,
    profitPercent,
    todaysGain,
    topAIFund: null, // Will be set after AI calculation
    topWeeklyFund: null,
    topMonthlyFund: null,
    buyMeterValue: 0,
    riskMeterValue: 0,
    lastUpdated: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  };
};

// ============================================================
// CHECK IF TODAY IS FRIDAY
// ============================================================

export const isTodayFriday = (): boolean => {
  return isFriday(new Date());
};
