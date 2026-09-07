'use client';

import React from 'react';
import { 
  Phone, 
  ShieldAlert, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  BarChart3, 
  PieChart as PieIcon, 
  Activity 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';
import { AnalyticsSummaryStats } from '../lib/types';

interface AnalyticsSummaryProps {
  stats: AnalyticsSummaryStats;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Likely Safe': '#10B981',      // Emerald green
  'Uncertain': '#F59E0B',        // Amber
  'Likely Spam': '#EF4444',       // Rose red
  'Possibly Urgent': '#8B5CF6',   // Purple/Indigo
};

const DISTRIBUTION_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#3B82F6', '#10B981'];

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ stats }) => {
  const pieData = Object.entries(stats.categoryCounts).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#94A3B8',
  }));

  return (
    <div className="space-y-6">
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Total Calls Analyzed */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Logged Calls
            </span>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Phone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalCalls.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-500 flex items-center">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              100% evaluated
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Synthesized telecom log history
          </p>
        </div>

        {/* Stat 2: Static Spam Flagged */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Static Spam Tagged
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.staticSpamPercent}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              ({stats.staticSpamCount} calls)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Raw telecom crowd database tags
          </p>
        </div>

        {/* Stat 3: Rescued / Urgency Overridden */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Rescued / Urgent
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {stats.rescuedUrgentCount}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
              {stats.rescuedUrgentPercent}% rescued
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            False static spam tags overridden
          </p>
        </div>

        {/* Stat 4: Average Trust Score */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mean Trust Score
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.averageTrustScore}<span className="text-lg text-slate-400 font-normal">/100</span>
            </span>
            <span className="text-xs font-medium text-emerald-500">
              Optimal threshold
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Dynamic behavioral aggregate
          </p>
        </div>

      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Category Breakdown Donut */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-emerald-500" />
                Category Breakdown
              </h3>
              <span className="text-[11px] text-slate-400">Trust Engine Output</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Distribution of incoming calls across the 4 trust tiers.
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Category Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white font-mono ml-1">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Trust Score Distribution Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Score Distribution
              </h3>
              <span className="text-[11px] text-slate-400">0 - 100 Range</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Number of call records grouped by score ranges.
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.scoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415522" />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#94A3B8' }} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.scoreDistribution.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Critical &lt; 40: High Risk</span>
            <span>70+: Safe Threshold</span>
          </div>
        </div>

        {/* Chart 3: 7-Day Spam vs Rescued Call Timeline */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                7-Day Call Timeline
              </h3>
              <span className="text-[11px] text-slate-400">Static vs Rescued</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Comparing static spam flags vs rescued calls over time.
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRescued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415522" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTotal)" name="Total Calls" />
                <Area type="monotone" dataKey="rescued" stroke="#10B981" fillOpacity={1} fill="url(#colorRescued)" name="Rescued Calls" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Total Calls</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Rescued Calls</span>
          </div>
        </div>

      </div>

    </div>
  );
};
