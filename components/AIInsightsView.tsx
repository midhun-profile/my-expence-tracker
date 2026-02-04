
import React, { useState } from 'react';
import { Expense, AIInsight } from '../types';
import { getSpendingInsights } from '../services/geminiService';

interface AIInsightsViewProps {
  expenses: Expense[];
}

const AIInsightsView: React.FC<AIInsightsViewProps> = ({ expenses }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await getSpendingInsights(expenses);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">AI Financial Insights</h2>
          <p className="text-indigo-100 text-sm opacity-90">Let Gemini analyze your spending habits</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || expenses.length === 0}
          className="px-6 py-2 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze Spending'}
        </button>
      </div>

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
          <div className="h-24 bg-white/20 rounded w-full mt-6"></div>
        </div>
      )}

      {insight && !loading && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20">
            <h3 className="font-bold text-lg mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analysis
            </h3>
            <p className="text-indigo-50 leading-relaxed text-sm italic">
              "{insight.analysis}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insight.recommendations.map((rec, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-start">
                <div className="mr-3 mt-1 bg-green-400/30 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!insight && !loading && expenses.length === 0 && (
        <p className="text-center py-8 text-indigo-200">Add some expenses first to get insights!</p>
      )}

      {!insight && !loading && expenses.length > 0 && (
        <div className="flex flex-col items-center py-8 text-indigo-200">
           <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
           <p className="text-sm">Click Analyze to see where your money goes</p>
        </div>
      )}
    </div>
  );
};

export default AIInsightsView;
