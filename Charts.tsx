// ============================================================
// CHARTS COMPONENTS
// ============================================================

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Fund, PortfolioHolding, AIScore, ReturnsData } from '../types';
import { SECTOR_COLORS, CATEGORY_COLORS } from '../data/funds';
import { FUNDS } from '../data/funds';

// ============================================================
// PORTFOLIO ALLOCATION PIE CHART
// ============================================================

interface AllocationChartProps {
  portfolio: PortfolioHolding[];
  funds: Fund[];
}

export const AllocationChart = ({ portfolio, funds }: AllocationChartProps) => {
  const data = portfolio.map(holding => {
    const fund = funds.find(f => f.id === holding.fundId);
    return {
      name: fund?.shortName || 'Unknown',
      value: holding.currentValue,
      color: SECTOR_COLORS[fund?.sector || 'Multi-Sector'] || '#6366F1'
    };
  }).filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-purple-400">₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">Portfolio Allocation</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.slice(0, 6).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-400 truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// SECTOR ALLOCATION CHART
// ============================================================

interface SectorChartProps {
  funds: Fund[];
  portfolio: PortfolioHolding[];
}

export const SectorChart = ({ funds, portfolio }: SectorChartProps) => {
  const sectorData: Record<string, number> = {};
  
  portfolio.forEach(holding => {
    const fund = funds.find(f => f.id === holding.fundId);
    if (fund) {
      sectorData[fund.sector] = (sectorData[fund.sector] || 0) + holding.currentValue;
    }
  });

  const data = Object.entries(sectorData).map(([sector, value]) => ({
    name: sector,
    value,
    color: SECTOR_COLORS[sector] || '#6366F1'
  }));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">Sector Exposure</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================================
// AI SCORE BAR CHART
// ============================================================

interface AIScoreChartProps {
  aiScores: AIScore[];
}

export const AIScoreChart = ({ aiScores }: AIScoreChartProps) => {
  const sortedScores = [...aiScores].sort((a, b) => b.overallScore - a.overallScore);
  
  const data = sortedScores.map(score => {
    const fund = FUNDS.find(f => f.id === score.fundId);
    return {
      name: fund?.shortName || 'Unknown',
      score: score.overallScore,
      fill: score.overallScore >= 70 ? '#22C55E' : score.overallScore >= 50 ? '#F59E0B' : '#EF4444'
    };
  });

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">AI Score Rankings</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis type="category" dataKey="name" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} width={75} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#F8FAFC' }}
              itemStyle={{ color: '#A78BFA' }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================================
// RETURNS HEATMAP
// ============================================================

interface ReturnsHeatmapProps {
  funds: Fund[];
  returns: Map<number, ReturnsData>;
}

export const ReturnsHeatmap = ({ funds, returns }: ReturnsHeatmapProps) => {
  const getColorForReturn = (value: number): string => {
    if (value >= 20) return 'bg-green-600';
    if (value >= 10) return 'bg-green-500';
    if (value >= 5) return 'bg-green-400';
    if (value >= 0) return 'bg-green-300/50';
    if (value >= -5) return 'bg-red-300/50';
    if (value >= -10) return 'bg-red-400';
    if (value >= -20) return 'bg-red-500';
    return 'bg-red-600';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 overflow-x-auto">
      <h3 className="text-lg font-semibold text-white mb-4">Returns Heatmap</h3>
      
      {/* Headers */}
      <div className="grid grid-cols-8 gap-1 mb-2 text-xs text-slate-400">
        <div className="p-2">Fund</div>
        <div className="p-2 text-center">1D</div>
        <div className="p-2 text-center">1W</div>
        <div className="p-2 text-center">1M</div>
        <div className="p-2 text-center">3M</div>
        <div className="p-2 text-center">6M</div>
        <div className="p-2 text-center">1Y</div>
        <div className="p-2 text-center">3Y</div>
      </div>
      
      {/* Rows */}
      <div className="space-y-1">
        {funds.map(fund => {
          const ret = returns.get(fund.id);
          const periods = [
            ret?.daily || 0,
            ret?.weekly || 0,
            ret?.monthly || 0,
            ret?.quarterly || 0,
            ret?.halfYearly || 0,
            ret?.yearly || 0,
            ret?.threeYear || 0
          ];
          
          return (
            <div key={fund.id} className="grid grid-cols-8 gap-1">
              <div className="p-2 text-xs text-white truncate">{fund.shortName}</div>
              {periods.map((val, idx) => (
                <div 
                  key={idx}
                  className={`p-2 text-center text-xs text-white rounded ${getColorForReturn(val)}`}
                >
                  {val.toFixed(1)}%
                </div>
              ))}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-slate-400">Negative</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-slate-600 rounded" />
          <span className="text-slate-400">Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-slate-400">Positive</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CATEGORY DISTRIBUTION
// ============================================================

interface CategoryChartProps {
  funds: Fund[];
}

export const CategoryChart = ({ funds }: CategoryChartProps) => {
  const categoryCount: Record<string, number> = {};
  funds.forEach(fund => {
    categoryCount[fund.category] = (categoryCount[fund.category] || 0) + 1;
  });

  const data = Object.entries(categoryCount).map(([category, count]) => ({
    name: category,
    value: count,
    color: CATEGORY_COLORS[category] || '#6366F1'
  }));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#F8FAFC' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
