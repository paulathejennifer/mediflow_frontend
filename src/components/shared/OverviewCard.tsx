'use client';
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: number | string;
  trend: number; // This is the percentage value
  trendLabel?: string; // New prop for custom trend label
  icon: React.ReactNode;
  suffix?: string;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, trend = 0, trendLabel, icon, suffix = "" }) => {
  const numericTrend = typeof trend === 'number' ? trend : parseFloat(trend as any) || 0;
  const isPositive = numericTrend >= 0;
  
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {value}{suffix}
          </h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          {Math.abs(numericTrend).toFixed(1)}% 
        </span>
        <span className="ml-2 text-sm text-gray-400">{trendLabel || 'vs last month'}</span>
      </div>
    </div>
  );
};