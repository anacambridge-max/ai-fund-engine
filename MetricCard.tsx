// ============================================================
// METRIC CARD COMPONENT
// ============================================================

import { LucideIcon } from 'lucide-react';
import { formatLargeNumber, formatPercent } from '../utils/calculations';

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: LucideIcon;
  type: 'currency' | 'percent' | 'number' | 'score';
  trend?: 'up' | 'down' | 'neutral';
  accentColor: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  type, 
  trend,
  accentColor 
}: MetricCardProps) => {
  const formatValue = () => {
    switch (type) {
      case 'currency':
        return formatLargeNumber(value);
      case 'percent':
        return formatPercent(value);
      case 'score':
        return value.toFixed(0);
      default:
        return value.toFixed(2);
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-slate-400';
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${accentColor} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-500/20 text-green-400' :
            trend === 'down' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-slate-400 text-sm mb-1">{title}</p>
        <p className={`text-2xl font-bold ${getTrendColor()} ${type === 'currency' || type === 'score' ? 'text-white' : ''}`}>
          {formatValue()}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

// Gauge Meter Component
interface GaugeMeterProps {
  title: string;
  value: number;
  type: 'buy' | 'risk';
}

export const GaugeMeter = ({ title, value, type }: GaugeMeterProps) => {
  const getColor = () => {
    if (type === 'buy') {
      if (value >= 70) return 'from-green-500 to-emerald-500';
      if (value >= 40) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-rose-500';
    } else {
      if (value <= 30) return 'from-green-500 to-emerald-500';
      if (value <= 60) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-rose-500';
    }
  };

  const getLabel = () => {
    if (type === 'buy') {
      if (value >= 70) return 'Strong Buy Zone';
      if (value >= 40) return 'Neutral Zone';
      return 'Cautious Zone';
    } else {
      if (value <= 30) return 'Low Risk';
      if (value <= 60) return 'Moderate Risk';
      return 'High Risk';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
      <h3 className="text-slate-400 text-sm mb-4">{title}</h3>
      
      {/* Gauge */}
      <div className="relative h-24 mb-4">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background Arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${value * 2.5} 250`}
            className="transition-all duration-500"
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`${type === 'buy' ? 'text-green-500' : 'text-green-500'}`} stopColor="currentColor" />
              <stop offset="50%" className="text-yellow-500" stopColor="currentColor" />
              <stop offset="100%" className={`${type === 'buy' ? 'text-green-500' : 'text-red-500'}`} stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Value */}
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <span className={`text-3xl font-bold bg-gradient-to-r ${getColor()} bg-clip-text text-transparent`}>
            {value}
          </span>
        </div>
      </div>
      
      <p className={`text-center text-sm font-medium bg-gradient-to-r ${getColor()} bg-clip-text text-transparent`}>
        {getLabel()}
      </p>
    </div>
  );
};
