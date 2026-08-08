// ============================================================
// AI MUTUAL FUND INVESTMENT ENGINE PRO - FUNDS DATABASE
// ============================================================
// FIXED 15 FUNDS - NO ADDITIONS ALLOWED
// ============================================================

import { Fund } from '../types';

export const FUNDS: Fund[] = [
  {
    id: 1,
    name: 'Quant Flexi Cap Direct Growth',
    shortName: 'Quant Flexi Cap',
    amfiCode: '120828',
    category: 'Flexi Cap',
    sector: 'Multi-Sector',
    riskLevel: 'Very High',
    amc: 'Quant'
  },
  {
    id: 2,
    name: 'Quant Large & Mid Cap Direct Growth',
    shortName: 'Quant Large & Mid',
    amfiCode: '120833',
    category: 'Large & Mid Cap',
    sector: 'Multi-Sector',
    riskLevel: 'Very High',
    amc: 'Quant'
  },
  {
    id: 3,
    name: 'Quant Multi Cap Direct Growth',
    shortName: 'Quant Multi Cap',
    amfiCode: '150480',
    category: 'Multi Cap',
    sector: 'Multi-Sector',
    riskLevel: 'Very High',
    amc: 'Quant'
  },
  {
    id: 4,
    name: 'Quant Multi Asset Direct Growth',
    shortName: 'Quant Multi Asset',
    amfiCode: '120847',
    category: 'Multi Asset',
    sector: 'Multi-Asset',
    riskLevel: 'High',
    amc: 'Quant'
  },
  {
    id: 5,
    name: 'Quant Infrastructure Direct Growth',
    shortName: 'Quant Infra',
    amfiCode: '120465',
    category: 'Sectoral',
    sector: 'Infrastructure',
    riskLevel: 'Very High',
    amc: 'Quant'
  },
  {
    id: 6,
    name: 'Quant BFSI Direct Growth',
    shortName: 'Quant BFSI',
    amfiCode: '147949',
    category: 'Sectoral',
    sector: 'BFSI',
    riskLevel: 'Very High',
    amc: 'Quant'
  },
  {
    id: 7,
    name: 'Tata Digital India Direct Growth',
    shortName: 'Tata Digital India',
    amfiCode: '135804',
    category: 'Sectoral',
    sector: 'Technology',
    riskLevel: 'Very High',
    amc: 'Tata'
  },
  {
    id: 8,
    name: 'SBI Nifty 50 Index Fund Direct Growth',
    shortName: 'SBI Nifty 50',
    amfiCode: '119597',
    category: 'Index Fund',
    sector: 'Large Cap',
    riskLevel: 'Moderate',
    amc: 'SBI'
  },
  {
    id: 9,
    name: 'UTI Nifty Next 50 Index Fund Direct Growth',
    shortName: 'UTI Nifty Next 50',
    amfiCode: '130427',
    category: 'Index Fund',
    sector: 'Large Cap',
    riskLevel: 'High',
    amc: 'UTI'
  },
  {
    id: 10,
    name: 'HDFC Mid Cap Opportunities Direct Growth',
    shortName: 'HDFC Mid Cap',
    amfiCode: '100534',
    category: 'Mid Cap',
    sector: 'Mid Cap',
    riskLevel: 'High',
    amc: 'HDFC'
  },
  {
    id: 11,
    name: 'SBI Small Cap Direct Growth',
    shortName: 'SBI Small Cap',
    amfiCode: '125497',
    category: 'Small Cap',
    sector: 'Small Cap',
    riskLevel: 'Very High',
    amc: 'SBI'
  },
  {
    id: 12,
    name: 'Bandhan Small Cap Direct Growth',
    shortName: 'Bandhan Small Cap',
    amfiCode: '145455',
    category: 'Small Cap',
    sector: 'Small Cap',
    riskLevel: 'Very High',
    amc: 'Bandhan'
  },
  {
    id: 13,
    name: 'ICICI Prudential Value Discovery Direct Growth',
    shortName: 'ICICI Value',
    amfiCode: '100666',
    category: 'Value',
    sector: 'Multi-Sector',
    riskLevel: 'High',
    amc: 'ICICI'
  },
  {
    id: 14,
    name: 'Axis ELSS Tax Saver Direct Growth',
    shortName: 'Axis ELSS',
    amfiCode: '120503',
    category: 'ELSS',
    sector: 'Multi-Sector',
    riskLevel: 'High',
    amc: 'Axis'
  },
  {
    id: 15,
    name: 'UTI Gold ETF FoF Direct Growth',
    shortName: 'UTI Gold',
    amfiCode: '119850',
    category: 'Gold Fund',
    sector: 'Commodities',
    riskLevel: 'Moderate',
    amc: 'UTI'
  }
];

// Fund lookup by ID
export const getFundById = (id: number): Fund | undefined => {
  return FUNDS.find(fund => fund.id === id);
};

// Fund lookup by AMFI Code
export const getFundByAmfiCode = (amfiCode: string): Fund | undefined => {
  return FUNDS.find(fund => fund.amfiCode === amfiCode);
};

// Get all AMFI codes
export const getAllAmfiCodes = (): string[] => {
  return FUNDS.map(fund => fund.amfiCode);
};

// Category distribution
export const CATEGORY_COLORS: Record<string, string> = {
  'Flexi Cap': '#3B82F6',
  'Large & Mid Cap': '#8B5CF6',
  'Multi Cap': '#EC4899',
  'Multi Asset': '#F59E0B',
  'Sectoral': '#10B981',
  'Index Fund': '#6366F1',
  'Mid Cap': '#14B8A6',
  'Small Cap': '#F97316',
  'Value': '#84CC16',
  'ELSS': '#EF4444',
  'Gold Fund': '#EAB308'
};

// Sector colors
export const SECTOR_COLORS: Record<string, string> = {
  'Multi-Sector': '#3B82F6',
  'Multi-Asset': '#8B5CF6',
  'Infrastructure': '#10B981',
  'BFSI': '#F59E0B',
  'Technology': '#EC4899',
  'Large Cap': '#6366F1',
  'Mid Cap': '#14B8A6',
  'Small Cap': '#F97316',
  'Commodities': '#EAB308'
};

// Risk level colors
export const RISK_COLORS: Record<string, string> = {
  'Low': '#22C55E',
  'Moderate': '#84CC16',
  'High': '#F59E0B',
  'Very High': '#EF4444'
};

// Signal colors
export const SIGNAL_COLORS: Record<string, string> = {
  'Strong Buy': '#22C55E',
  'Buy': '#84CC16',
  'Accumulate': '#3B82F6',
  'Hold': '#F59E0B',
  'Avoid': '#EF4444'
};

// AMC colors for charts
export const AMC_COLORS: Record<string, string> = {
  'Quant': '#8B5CF6',
  'Tata': '#3B82F6',
  'SBI': '#10B981',
  'UTI': '#F59E0B',
  'HDFC': '#EF4444',
  'Bandhan': '#EC4899',
  'ICICI': '#6366F1',
  'Axis': '#14B8A6'
};
