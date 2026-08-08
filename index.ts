// ============================================================
// AI MUTUAL FUND INVESTMENT ENGINE PRO - TYPE DEFINITIONS
// ============================================================

export interface Fund {
  id: number;
  name: string;
  shortName: string;
  amfiCode: string;
  category: string;
  sector: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  amc: string;
}

export interface NAVData {
  fundId: number;
  amfiCode: string;
  nav: number;
  date: string;
  previousNav: number;
  dailyReturn: number;
}

export interface NAVHistory {
  date: string;
  nav: number;
}

export interface ReturnsData {
  fundId: number;
  daily: number;
  weekly: number;
  monthly: number;
  quarterly: number;
  halfYearly: number;
  yearly: number;
  threeYear: number;
  fiveYear: number;
  cagr: number;
}

export interface RollingReturns {
  fundId: number;
  rolling1M: number;
  rolling3M: number;
  rolling6M: number;
  rolling1Y: number;
  rolling3Y: number;
  rolling5Y: number;
}

export interface RiskMetrics {
  fundId: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  recoveryDays: number;
  riskScore: number; // 0-100
  beta: number;
  alpha: number;
}

export interface DrawdownData {
  fundId: number;
  currentDrawdown: number;
  maxDrawdown: number;
  drawdownStart: string;
  drawdownEnd: string;
  recoveryDate: string | null;
  isRecovered: boolean;
}

export interface AIScore {
  fundId: number;
  overallScore: number; // 0-100
  returnScore: number;
  riskScore: number;
  momentumScore: number;
  consistencyScore: number;
  drawdownScore: number;
  signal: 'Strong Buy' | 'Buy' | 'Accumulate' | 'Hold' | 'Avoid';
  rank: number;
  trend: 'Up' | 'Down' | 'Stable';
  reasoning: string;
}

export interface BuySignal {
  fundId: number;
  signal: 'Strong Buy' | 'Buy' | 'Accumulate' | 'Hold' | 'Avoid';
  strength: number; // 0-100
  reason: string;
  suggestedAmount: number;
  targetAllocation: number;
  rank: number;
}

export interface PortfolioHolding {
  fundId: number;
  units: number;
  avgBuyPrice: number;
  investedAmount: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  allocation: number;
  targetAllocation: number;
  rebalanceAmount: number;
}

export interface Transaction {
  id: string;
  fundId: number;
  type: 'BUY' | 'SELL' | 'SIP';
  units: number;
  nav: number;
  amount: number;
  date: string;
}

export interface WeeklyRecommendation {
  fundId: number;
  rank: number;
  reason: string;
  aiScore: number;
  weeklyReturn: number;
  drawdown: number;
  riskLevel: string;
  suggestedAmount: number;
}

export interface DashboardMetrics {
  totalInvested: number;
  currentValue: number;
  totalProfit: number;
  profitPercent: number;
  todaysGain: number;
  topAIFund: Fund | null;
  topWeeklyFund: Fund | null;
  topMonthlyFund: Fund | null;
  buyMeterValue: number; // 0-100
  riskMeterValue: number; // 0-100
  lastUpdated: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface PerformanceDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface SectorAllocation {
  sector: string;
  allocation: number;
  color: string;
}

export interface MarketData {
  nifty50: number;
  nifty50Change: number;
  niftyNext50: number;
  niftyNext50Change: number;
  sensex: number;
  sensexChange: number;
  marketSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  lastUpdated: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  module: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  lastValidated: string;
}

export interface AppState {
  funds: Fund[];
  navData: Map<number, NAVData>;
  navHistory: Map<number, NAVHistory[]>;
  returns: Map<number, ReturnsData>;
  rollingReturns: Map<number, RollingReturns>;
  riskMetrics: Map<number, RiskMetrics>;
  drawdowns: Map<number, DrawdownData>;
  aiScores: Map<number, AIScore>;
  buySignals: BuySignal[];
  portfolio: PortfolioHolding[];
  transactions: Transaction[];
  weeklyRecommendations: WeeklyRecommendation[];
  dashboardMetrics: DashboardMetrics;
  marketData: MarketData;
  logs: LogEntry[];
  isLoading: boolean;
  lastUpdated: string | null;
  error: string | null;
}
