// ============================================================
// AI MUTUAL FUND INVESTMENT ENGINE PRO - CALCULATION ENGINE
// ============================================================

import { NAVHistory, ReturnsData, RollingReturns, RiskMetrics, DrawdownData } from '../types';

// ============================================================
// RETURN CALCULATIONS
// ============================================================

export const calculateReturn = (currentNav: number, previousNav: number): number => {
  if (previousNav === 0) return 0;
  return ((currentNav - previousNav) / previousNav) * 100;
};

export const calculateCAGR = (startNav: number, endNav: number, years: number): number => {
  if (startNav === 0 || years === 0) return 0;
  return (Math.pow(endNav / startNav, 1 / years) - 1) * 100;
};

export const calculateReturns = (history: NAVHistory[], fundId: number): ReturnsData => {
  if (history.length < 2) {
    return {
      fundId,
      daily: 0,
      weekly: 0,
      monthly: 0,
      quarterly: 0,
      halfYearly: 0,
      yearly: 0,
      threeYear: 0,
      fiveYear: 0,
      cagr: 0
    };
  }

  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestNav = sortedHistory[0].nav;
  const getNavAtDaysAgo = (days: number): number => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - days);
    
    for (const h of sortedHistory) {
      if (new Date(h.date) <= targetDate) {
        return h.nav;
      }
    }
    return sortedHistory[sortedHistory.length - 1].nav;
  };

  const dailyNav = sortedHistory.length > 1 ? sortedHistory[1].nav : latestNav;
  const weeklyNav = getNavAtDaysAgo(7);
  const monthlyNav = getNavAtDaysAgo(30);
  const quarterlyNav = getNavAtDaysAgo(90);
  const halfYearlyNav = getNavAtDaysAgo(180);
  const yearlyNav = getNavAtDaysAgo(365);
  const threeYearNav = getNavAtDaysAgo(1095);
  const fiveYearNav = getNavAtDaysAgo(1825);

  return {
    fundId,
    daily: calculateReturn(latestNav, dailyNav),
    weekly: calculateReturn(latestNav, weeklyNav),
    monthly: calculateReturn(latestNav, monthlyNav),
    quarterly: calculateReturn(latestNav, quarterlyNav),
    halfYearly: calculateReturn(latestNav, halfYearlyNav),
    yearly: calculateReturn(latestNav, yearlyNav),
    threeYear: calculateCAGR(threeYearNav, latestNav, 3),
    fiveYear: calculateCAGR(fiveYearNav, latestNav, 5),
    cagr: calculateCAGR(sortedHistory[sortedHistory.length - 1].nav, latestNav, 
      (new Date().getTime() - new Date(sortedHistory[sortedHistory.length - 1].date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  };
};

// ============================================================
// ROLLING RETURNS CALCULATIONS
// ============================================================

export const calculateRollingReturns = (history: NAVHistory[], fundId: number): RollingReturns => {
  if (history.length < 30) {
    return {
      fundId,
      rolling1M: 0,
      rolling3M: 0,
      rolling6M: 0,
      rolling1Y: 0,
      rolling3Y: 0,
      rolling5Y: 0
    };
  }

  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const calculateAvgRollingReturn = (months: number): number => {
    const days = months * 30;
    const returns: number[] = [];
    
    for (let i = 0; i < Math.min(sortedHistory.length - days, 30); i++) {
      const endNav = sortedHistory[i].nav;
      const startNav = sortedHistory[i + days]?.nav;
      if (startNav) {
        returns.push(calculateReturn(endNav, startNav));
      }
    }
    
    if (returns.length === 0) return 0;
    return returns.reduce((a, b) => a + b, 0) / returns.length;
  };

  return {
    fundId,
    rolling1M: calculateAvgRollingReturn(1),
    rolling3M: calculateAvgRollingReturn(3),
    rolling6M: calculateAvgRollingReturn(6),
    rolling1Y: calculateAvgRollingReturn(12),
    rolling3Y: calculateAvgRollingReturn(36),
    rolling5Y: calculateAvgRollingReturn(60)
  };
};

// ============================================================
// RISK METRICS CALCULATIONS
// ============================================================

export const calculateVolatility = (history: NAVHistory[]): number => {
  if (history.length < 30) return 0;

  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dailyReturns: number[] = [];
  for (let i = 1; i < Math.min(sortedHistory.length, 252); i++) {
    dailyReturns.push(calculateReturn(sortedHistory[i].nav, sortedHistory[i - 1].nav));
  }

  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const squaredDiffs = dailyReturns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / dailyReturns.length;
  
  // Annualized volatility
  return Math.sqrt(variance * 252);
};

export const calculateSharpeRatio = (annualReturn: number, volatility: number, riskFreeRate: number = 6): number => {
  if (volatility === 0) return 0;
  return (annualReturn - riskFreeRate) / volatility;
};

export const calculateSortinoRatio = (history: NAVHistory[], annualReturn: number, riskFreeRate: number = 6): number => {
  if (history.length < 30) return 0;

  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const negativeReturns: number[] = [];
  for (let i = 1; i < Math.min(sortedHistory.length, 252); i++) {
    const ret = calculateReturn(sortedHistory[i].nav, sortedHistory[i - 1].nav);
    if (ret < 0) {
      negativeReturns.push(ret);
    }
  }

  if (negativeReturns.length === 0) return 3; // Very high if no negative returns

  const meanNegative = negativeReturns.reduce((a, b) => a + b, 0) / negativeReturns.length;
  const squaredDiffs = negativeReturns.map(r => Math.pow(r - meanNegative, 2));
  const downVariance = squaredDiffs.reduce((a, b) => a + b, 0) / negativeReturns.length;
  const downVolatility = Math.sqrt(downVariance * 252);

  if (downVolatility === 0) return 3;
  return (annualReturn - riskFreeRate) / downVolatility;
};

export const calculateRiskMetrics = (history: NAVHistory[], fundId: number, annualReturn: number): RiskMetrics => {
  const volatility = calculateVolatility(history);
  const sharpeRatio = calculateSharpeRatio(annualReturn, volatility);
  const sortinoRatio = calculateSortinoRatio(history, annualReturn);
  const drawdownData = calculateDrawdown(history, fundId);
  
  // Risk score: 0 (safest) to 100 (riskiest)
  const volatilityScore = Math.min(volatility / 40 * 100, 100);
  const drawdownScore = Math.min(Math.abs(drawdownData.maxDrawdown) / 50 * 100, 100);
  const riskScore = (volatilityScore * 0.6 + drawdownScore * 0.4);

  return {
    fundId,
    volatility,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown: drawdownData.maxDrawdown,
    recoveryDays: drawdownData.isRecovered ? 
      Math.floor((new Date(drawdownData.recoveryDate || '').getTime() - new Date(drawdownData.drawdownEnd).getTime()) / (1000 * 60 * 60 * 24)) : 0,
    riskScore,
    beta: 1 + (Math.random() * 0.6 - 0.3), // Simulated beta
    alpha: sharpeRatio * 2 // Simplified alpha
  };
};

// ============================================================
// DRAWDOWN CALCULATIONS
// ============================================================

export const calculateDrawdown = (history: NAVHistory[], fundId: number): DrawdownData => {
  if (history.length < 2) {
    return {
      fundId,
      currentDrawdown: 0,
      maxDrawdown: 0,
      drawdownStart: '',
      drawdownEnd: '',
      recoveryDate: null,
      isRecovered: true
    };
  }

  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let peak = sortedHistory[0].nav;
  let peakDate = sortedHistory[0].date;
  let maxDrawdown = 0;
  let maxDrawdownStart = '';
  let maxDrawdownEnd = '';
  let currentDrawdown = 0;

  for (const point of sortedHistory) {
    if (point.nav > peak) {
      peak = point.nav;
      peakDate = point.date;
    }
    
    const drawdown = ((point.nav - peak) / peak) * 100;
    
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownStart = peakDate;
      maxDrawdownEnd = point.date;
    }
  }

  // Current drawdown
  const latestNav = sortedHistory[sortedHistory.length - 1].nav;
  let highestNav = sortedHistory[0].nav;
  for (const point of sortedHistory) {
    if (point.nav > highestNav) {
      highestNav = point.nav;
    }
  }
  currentDrawdown = ((latestNav - highestNav) / highestNav) * 100;

  // Check if recovered
  const isRecovered = currentDrawdown >= -1;
  const recoveryDate = isRecovered ? sortedHistory[sortedHistory.length - 1].date : null;

  return {
    fundId,
    currentDrawdown,
    maxDrawdown,
    drawdownStart: maxDrawdownStart,
    drawdownEnd: maxDrawdownEnd,
    recoveryDate,
    isRecovered
  };
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercent = (value: number, decimals: number = 2): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(2)} K`;
  }
  return `₹${num.toFixed(0)}`;
};
