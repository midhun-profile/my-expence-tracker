import React, { useState, useEffect, useMemo } from 'react';
import ExpenseForm from './components/ExpenseForm';
import Reports from './components/Reports';
import AIInsightsView from './components/AIInsightsView';
import SettingsView from './components/SettingsView';
import { Expense, AppSettings } from './types';
import { CATEGORIES, getCategoryColor } from './constants';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'reports' | 'ai' | 'settings'>('daily');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [settings, setSettings] = useState<AppSettings>({
    currencySymbol: '$',
    currencyFormat: 'standard',
    theme: 'light',
    enableAI: true
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Date Range State
  const getDefaultDateRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    return { start: firstDay, end: lastDay };
  };

  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  // Helper for currency formatting
  const formatCurrency = (amount: number) => {
    const space = settings.currencyFormat === 'space' ? ' ' : '';
    return `${settings.currencySymbol}${space}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Initialize from LocalStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('spendwise_expenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error("Failed to parse expenses");
      }
    }

    const savedSettings = localStorage.getItem('spendwise_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (!parsed.theme) parsed.theme = 'light';
        if (parsed.enableAI === undefined) parsed.enableAI = true;
        setSettings(parsed);
      } catch (e) {
        console.error("Failed to parse settings");
      }
    }
  }, []);

  // Sync theme with document class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Handle AI tab being disabled while active
  useEffect(() => {
    if (!settings.enableAI && activeTab === 'ai') {
      setActiveTab('daily');
    }
  }, [settings.enableAI, activeTab]);

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('spendwise_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('spendwise_settings', JSON.stringify(settings));
  }, [settings]);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const todayExpenses = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return expenses.filter(e => e.date.startsWith(todayStr));
  }, [expenses]);

  const todayTotal = todayExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = e.date.split('T')[0];
      return d >= dateRange.start && d <= dateRange.end;
    });
  }, [expenses, dateRange]);

  const rangeTotal = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const tabs = (['daily', 'reports', 'ai', 'settings'] as const).filter(t => t !== 'ai' || settings.enableAI);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pb-8 transition-colors duration-300">
      {isOffline && (
        <div className="bg-amber-500 text-white text-[10px] font-bold py-1 px-4 text-center sticky top-0 z-50 animate-pulse uppercase tracking-widest">
          Offline Mode - Data saved locally
        </div>
      )}

      <header className={`bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky ${isOffline ? 'top-[20px]' : 'top-0'} z-30 px-6 py-4 transition-colors`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-100 dark:shadow-none">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">SpendWise</h1>
          </div>
          <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'daily' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Today's Total</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{formatCurrency(todayTotal)}</p>
              </div>
              <ExpenseForm onAdd={addExpense} currencySymbol={settings.currencySymbol} />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">Filter Activity</h3>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="flex-1 sm:w-36 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 font-bold text-xs uppercase">to</span>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="flex-1 sm:w-36 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button 
                  onClick={() => setDateRange(getDefaultDateRange())}
                  className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline px-2 py-1"
                >
                  THIS MONTH
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Transaction List</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                      Range Total: <span className="text-blue-600 dark:text-blue-400">{formatCurrency(rangeTotal)}</span>
                    </p>
                  </div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {filteredExpenses.length} Results
                  </span>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
                  {filteredExpenses.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                      <p>No expenses found in this range.</p>
                    </div>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <div key={expense.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center group">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: `${getCategoryColor(expense.category)}20` }}>
                           <svg className="w-6 h-6" style={{ color: getCategoryColor(expense.category) }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             {CATEGORIES.find(c => c.name === expense.category)?.icon}
                           </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 dark:text-slate-200 font-bold truncate">{expense.description}</p>
                          <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mt-1">
                            <span className="font-medium">{expense.category}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-slate-900 dark:text-white font-black">{formatCurrency(expense.amount)}</p>
                          <button 
                            onClick={() => deleteExpense(expense.id)}
                            className="text-xs text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Monthly Performance</h2>
                <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-bold shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
             </div>
             <Reports expenses={expenses} selectedMonth={selectedMonth} settings={settings} />
          </div>
        )}

        {activeTab === 'ai' && settings.enableAI && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Smart Financial Advisor</h2>
             <AIInsightsView expenses={expenses} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">App Settings</h2>
            <SettingsView settings={settings} onUpdate={setSettings} />
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around p-3 md:hidden z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === tab ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <div className="mb-1">
              {tab === 'daily' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
              {tab === 'reports' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
              {tab === 'ai' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              {tab === 'settings' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">{tab}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
