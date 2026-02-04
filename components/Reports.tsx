
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Expense, AppSettings } from '../types';
import { CATEGORIES, getCategoryColor } from '../constants';

interface ReportsProps {
  expenses: Expense[];
  selectedMonth: string; // YYYY-MM
  settings: AppSettings;
}

const Reports: React.FC<ReportsProps> = ({ expenses, selectedMonth, settings }) => {
  const isDark = settings.theme === 'dark';

  const formatCurrency = (amount: number) => {
    const space = settings.currencyFormat === 'space' ? ' ' : '';
    return `${settings.currencySymbol}${space}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    monthlyExpenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [monthlyExpenses]);

  const dailyData = useMemo(() => {
    const daysInMonth = new Date(
      parseInt(selectedMonth.split('-')[0]),
      parseInt(selectedMonth.split('-')[1]),
      0
    ).getDate();

    const data = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      amount: 0,
    }));

    monthlyExpenses.forEach(e => {
      const day = new Date(e.date).getDate();
      if (data[day - 1]) data[day - 1].amount += e.amount;
    });

    return data;
  }, [monthlyExpenses, selectedMonth]);

  const totalSpent = monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  if (monthlyExpenses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center transition-colors">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
           <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">No expenses logged for this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke={isDark ? '#0f172a' : '#fff'}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name as any)} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f1f5f9' : '#000'
                  }}
                  itemStyle={{ color: isDark ? '#cbd5e1' : '#475569' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getCategoryColor(item.name as any) }} />
                <span className="truncate">{item.name}: {formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending Trend */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Daily Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis 
                  dataKey="day" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
                  formatter={(value: number) => [formatCurrency(value), 'Spent']}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f1f5f9' : '#000'
                  }}
                  itemStyle={{ color: isDark ? '#cbd5e1' : '#475569' }}
                />
                <Bar dataKey="amount" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors">
             <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Monthly Expenditure</p>
             <p className="text-2xl font-black text-blue-900 dark:text-blue-200">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
