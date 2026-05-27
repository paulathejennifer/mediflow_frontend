'use client';

import React, { useEffect, useState } from 'react';
import { OverviewCard } from '@/components/shared/OverviewCard';
import { Users, FileText, Building2, Activity, TrendingUp } from 'lucide-react';
import { analyticsService, AnalyticsMetrics } from '@/features/analytics/services/analytics.service';

export const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsService.getDashboardKpis();
        console.log("📊 DASHBOARD KPI DATA:", data);
        setKpis(data);
      } catch (err: any) {
        console.error("Dashboard Load Error:", err.response?.status, err.response?.data);
        setError(err.response?.data?.detail || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse text-muted-foreground">Gathering insights...</div>;
  if (error) return <div className="p-8 text-red-500 bg-red-50 rounded-lg m-4 border border-red-200">Error: {error}</div>;
  if (!kpis) return null; // Ensure kpis is not null before rendering

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard 
          title="Total Referrals" 
          value={kpis.totalReferrals ?? 0} 
          trend={kpis.totalReferralsTrend ?? 0} 
          trendLabel="vs last month"
          icon={<FileText className="h-5 w-5" />}
        />
        <OverviewCard 
          title="Total Facilities" 
          value={kpis.total_facilities ?? 0} 
          trend={0} 
          trendLabel="vs last month"
          icon={<Building2 className="h-5 w-5" />}
        />
        <OverviewCard 
          title="Total Users" 
          value={kpis.totalUsers ?? 0} 
          trend={kpis.totalUsersTrend ?? 0} 
          trendLabel="vs last month"
          icon={<Users className="h-5 w-5" />}
        />
        <OverviewCard 
          title="AI Documents (Processed)" 
          value={kpis.totalDocuments ?? 0} 
          trend={kpis.totalDocumentsTrend ?? 0} 
          trendLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>
      {/* Charts would go here */}
    </div>
  );
};