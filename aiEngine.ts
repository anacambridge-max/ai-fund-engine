// ============================================================
// AI MUTUAL FUND INVESTMENT ENGINE PRO - AI SCORING ENGINE
// ============================================================

import { Fund, ReturnsData, RiskMetrics, RollingReturns, DrawdownData, AIScore, BuySignal, WeeklyRecommendation } from '../types';
import { FUNDS } from '../data/funds';

// ============================================================
// AI SCORE CALCULATION
// ============================================================

export const calculateAIScore = (
  fund: Fund,
  returns: ReturnsData,
  risk: RiskMetrics,
  rolling: RollingReturns,
  drawdown: DrawdownData
): AIScore => {
  // Return Score (0-100) - Higher returns = Higher score
  const returnScore = calculateReturnScore(returns);
  
  // Risk Score (0-100) - Lower risk = Higher score
  const riskScoreInverse = 100 - risk.riskScore;
  
  // Momentum Score (0-100) - Recent performance trend
  const momentumScore = calculateMomentumScore(returns, rolling);
  
  // Consistency Score (0-100) - Steady returns
  const consistencyScore = calculateConsistencyScore(rolling);
  
  // Drawdown Score (0-100) - Lower drawdown = Higher score
  const drawdownScore = calculateDrawdownScore(drawdown);
  
  // Weighted Overall Score
  const overallScore = (
    returnScore * 0.30 +
    riskScoreInverse * 0.20 +
    momentumScore * 0.25 +
    consistencyScore * 0.15 +
    drawdownScore * 0.10
  );

  // Generate Signal
  const signal = getSignalFromScore(overallScore);
  
  // Determine Trend
  const trend = getTrend(returns, rolling);
  
  // Generate Reasoning
  const reasoning = generateReasoning(fund, overallScore, returnScore, riskScoreInverse, momentumScore, signal);

  return {
    fundId: fund.id,
    overallScore: Math.round(overallScore),
    returnScore: Math.round(returnScore),
    riskScore: Math.round(riskScoreInverse),
    momentumScore: Math.round(momentumScore),
    consistencyScore: Math.round(consistencyScore),
    drawdownScore: Math.round(drawdownScore),
    signal,
    rank: 0, // Will be set after sorting
    trend,
    reasoning
  };
};

const calculateReturnScore = (returns: ReturnsData): number => {
  // Weight different return periods
  const weightedReturn = (
    returns.monthly * 0.10 +
    returns.quarterly * 0.15 +
    returns.halfYearly * 0.20 +
    returns.yearly * 0.25 +
    returns.threeYear * 0.30
  );
  
  // Normalize to 0-100 scale (assuming -20% to +50% range)
  const normalized = ((weightedReturn + 20) / 70) * 100;
  return Math.max(0, Math.min(100, normalized));
};

const calculateMomentumScore = (returns: ReturnsData, rolling: RollingReturns): number => {
  // Recent momentum indicators
  const shortTermMomentum = returns.weekly + returns.monthly;
  const mediumTermMomentum = returns.quarterly;
  const rollingMomentum = rolling.rolling1M + rolling.rolling3M;
  
  const totalMomentum = (shortTermMomentum * 0.4 + mediumTermMomentum * 0.3 + rollingMomentum * 0.3) / 3;
  
  // Normalize to 0-100 scale
  const normalized = ((totalMomentum + 15) / 30) * 100;
  return Math.max(0, Math.min(100, normalized));
};

const calculateConsistencyScore = (rolling: RollingReturns): number => {
  // Check if returns are consistent across periods
  const returns = [rolling.rolling1M, rolling.rolling3M, rolling.rolling6M, rolling.rolling1Y];
  const positiveCount = returns.filter(r => r > 0).length;
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  
  // Calculate variance
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  // Lower variance = higher consistency
  const varianceScore = Math.max(0, 100 - stdDev * 5);
  const positivityScore = (positiveCount / returns.length) * 100;
  
  return (varianceScore * 0.6 + positivityScore * 0.4);
};

const calculateDrawdownScore = (drawdown: DrawdownData): number => {
  // Lower drawdown = higher score
  const maxDDScore = Math.max(0, 100 + drawdown.maxDrawdown * 2);
  const currentDDScore = Math.max(0, 100 + drawdown.currentDrawdown * 3);
  const recoveryBonus = drawdown.isRecovered ? 10 : 0;
  
  return Math.min(100, (maxDDScore * 0.5 + currentDDScore * 0.4) + recoveryBonus);
};

const getSignalFromScore = (score: number): AIScore['signal'] => {
  if (score >= 80) return 'Strong Buy';
  if (score >= 65) return 'Buy';
  if (score >= 50) return 'Accumulate';
  if (score >= 35) return 'Hold';
  return 'Avoid';
};

const getTrend = (returns: ReturnsData, rolling: RollingReturns): AIScore['trend'] => {
  const recentTrend = returns.weekly + returns.monthly * 0.5;
  const mediumTrend = rolling.rolling1M;
  
  const combinedTrend = recentTrend * 0.6 + mediumTrend * 0.4;
  
  if (combinedTrend > 2) return 'Up';
  if (combinedTrend < -2) return 'Down';
  return 'Stable';
};

const generateReasoning = (
  fund: Fund,
  _overall: number,
  returnScore: number,
  riskScore: number,
  momentumScore: number,
  _signal: AIScore['signal']
): string => {
  const reasons: string[] = [];
  
  if (returnScore >= 70) {
    reasons.push('Strong historical returns');
  } else if (returnScore < 40) {
    reasons.push('Below average returns');
  }
  
  if (riskScore >= 70) {
    reasons.push('Low risk profile');
  } else if (riskScore < 40) {
    reasons.push('Higher volatility');
  }
  
  if (momentumScore >= 70) {
    reasons.push('Positive momentum');
  } else if (momentumScore < 40) {
    reasons.push('Weak momentum');
  }
  
  if (fund.category === 'Index Fund') {
    reasons.push('Market-tracking stability');
  }
  
  if (fund.category === 'ELSS') {
    reasons.push('Tax benefits under 80C');
  }
  
  if (reasons.length === 0) {
    reasons.push('Moderate performance');
  }
  
  return reasons.slice(0, 2).join('. ') + '.';
};

// ============================================================
// BUY SIGNAL GENERATION
// ============================================================

export const generateBuySignals = (aiScores: AIScore[]): BuySignal[] => {
  const sortedScores = [...aiScores].sort((a, b) => b.overallScore - a.overallScore);
  
  // Assign ranks
  sortedScores.forEach((score, index) => {
    score.rank = index + 1;
  });
  
  return sortedScores.map((score, index) => {
    // Calculate suggested amount based on rank and score
    const baseAmount = 5000;
    const scoreMultiplier = score.overallScore / 100;
    const rankMultiplier = Math.max(0.5, 1 - (index * 0.1));
    const suggestedAmount = Math.round((baseAmount * scoreMultiplier * rankMultiplier) / 500) * 500;
    
    // Target allocation based on rank
    const targetAllocation = index < 3 ? 10 - index * 2 : 5;
    
    return {
      fundId: score.fundId,
      signal: score.signal,
      strength: score.overallScore,
      reason: score.reasoning,
      suggestedAmount: Math.max(500, suggestedAmount),
      targetAllocation,
      rank: index + 1
    };
  });
};

// ============================================================
// WEEKLY RECOMMENDATIONS
// ============================================================

export const generateWeeklyRecommendations = (
  aiScores: AIScore[],
  returns: Map<number, ReturnsData>,
  drawdowns: Map<number, DrawdownData>,
  _risks: Map<number, RiskMetrics>
): WeeklyRecommendation[] => {
  // Sort by AI score
  const sortedScores = [...aiScores].sort((a, b) => b.overallScore - a.overallScore);
  
  // Take top 3
  const top3 = sortedScores.slice(0, 3);
  
  return top3.map((score, index) => {
    const fund = FUNDS.find(f => f.id === score.fundId);
    const fundReturns = returns.get(score.fundId);
    const fundDrawdown = drawdowns.get(score.fundId);
    
    // Generate specific reason for each rank
    let reason = '';
    if (index === 0) {
      reason = `Top performer with ${score.overallScore} AI Score. ${score.reasoning}`;
    } else if (index === 1) {
      reason = `Strong contender with balanced risk-return. ${score.reasoning}`;
    } else {
      reason = `Solid choice for diversification. ${score.reasoning}`;
    }
    
    // Calculate suggested amount based on rank
    const baseAmounts = [5000, 3000, 2000];
    const suggestedAmount = baseAmounts[index];
    
    return {
      fundId: score.fundId,
      rank: index + 1,
      reason,
      aiScore: score.overallScore,
      weeklyReturn: fundReturns?.weekly || 0,
      drawdown: fundDrawdown?.currentDrawdown || 0,
      riskLevel: fund?.riskLevel || 'Moderate',
      suggestedAmount
    };
  });
};

// ============================================================
// BUY METER CALCULATION
// ============================================================

export const calculateBuyMeter = (aiScores: AIScore[]): number => {
  if (aiScores.length === 0) return 50;
  
  const avgScore = aiScores.reduce((sum, s) => sum + s.overallScore, 0) / aiScores.length;
  const strongBuyCount = aiScores.filter(s => s.signal === 'Strong Buy').length;
  const buyCount = aiScores.filter(s => s.signal === 'Buy').length;
  const avoidCount = aiScores.filter(s => s.signal === 'Avoid').length;
  
  // Calculate meter based on signals and scores
  const signalBonus = (strongBuyCount * 5) + (buyCount * 3) - (avoidCount * 5);
  const meterValue = avgScore + signalBonus;
  
  return Math.max(0, Math.min(100, meterValue));
};

// ============================================================
// RISK METER CALCULATION
// ============================================================

export const calculateRiskMeter = (risks: Map<number, RiskMetrics>): number => {
  if (risks.size === 0) return 50;
  
  const riskScores = Array.from(risks.values()).map(r => r.riskScore);
  const avgRiskScore = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
  
  return Math.round(avgRiskScore);
};
