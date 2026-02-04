
import React from 'react';
import { Category } from './types';

export const CATEGORIES: { name: Category; color: string; icon: React.ReactNode }[] = [
  { name: 'Food & Drinks', color: '#f87171', icon: <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" /> },
  { name: 'Transportation', color: '#60a5fa', icon: <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /> },
  { name: 'Housing & Rent', color: '#34d399', icon: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
  { name: 'Entertainment', color: '#a78bfa', icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /> },
  { name: 'Shopping', color: '#fbbf24', icon: <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /> },
  { name: 'Health', color: '#f472b6', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
  { name: 'Utilities', color: '#2dd4bf', icon: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /> },
  { name: 'Education', color: '#818cf8', icon: <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /> },
  { name: 'Other', color: '#94a3b8', icon: <circle cx="12" cy="12" r="10" /> }
];

export const getCategoryColor = (name: Category) => CATEGORIES.find(c => c.name === name)?.color || '#94a3b8';

export const CURRENCY_OPTIONS = [
  { label: 'US Dollar ($)', value: '$' },
  { label: 'Euro (€)', value: '€' },
  { label: 'British Pound (£)', value: '£' },
  { label: 'Japanese Yen (¥)', value: '¥' },
  { label: 'Indian Rupee (₹)', value: '₹' },
  { label: 'Nigerian Naira (₦)', value: '₦' },
  { label: 'Brazilian Real (R$)', value: 'R$' },
  { label: 'Australian Dollar (A$)', value: 'A$' }
];
