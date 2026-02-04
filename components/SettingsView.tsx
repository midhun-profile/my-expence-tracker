
import React from 'react';
import { AppSettings } from '../types';
import { CURRENCY_OPTIONS } from '../constants';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const handleChange = (field: keyof AppSettings, value: any) => {
    onUpdate({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Appearance
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleChange('theme', 'light')}
            className={`flex-1 p-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              settings.theme === 'light'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Light
          </button>
          <button
            onClick={() => handleChange('theme', 'dark')}
            className={`flex-1 p-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              settings.theme === 'dark'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Dark
          </button>
        </div>
      </div>

      {/* AI Features Toggle */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">AI Features</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Smart insights powered by Google Gemini</p>
            </div>
          </div>
          <button
            onClick={() => handleChange('enableAI', !settings.enableAI)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              settings.enableAI ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.enableAI ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Currency Preferences
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Preferred Currency</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CURRENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleChange('currencySymbol', opt.value)}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                    settings.currencySymbol === opt.value
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-lg mb-1">{opt.value}</span>
                  <span className="text-[10px] uppercase opacity-60 truncate">{opt.label.split('(')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Display Format</label>
            <div className="flex gap-4">
              <button
                onClick={() => handleChange('currencyFormat', 'standard')}
                className={`flex-1 p-4 rounded-xl border text-sm font-bold transition-all ${
                  settings.currencyFormat === 'standard'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {settings.currencySymbol}100.00
                <span className="block text-[10px] font-medium opacity-50 mt-1 uppercase">Standard</span>
              </button>
              <button
                onClick={() => handleChange('currencyFormat', 'space')}
                className={`flex-1 p-4 rounded-xl border text-sm font-bold transition-all ${
                  settings.currencyFormat === 'space'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {settings.currencySymbol} 100.00
                <span className="block text-[10px] font-medium opacity-50 mt-1 uppercase">With Space</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-100 dark:shadow-none flex items-center justify-between">
         <div>
            <h4 className="font-bold text-lg mb-1">Backup your data</h4>
            <p className="text-blue-100 text-sm">Download your expenses as a JSON file to keep them safe.</p>
         </div>
         <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
         </button>
      </div>
    </div>
  );
};

export default SettingsView;
