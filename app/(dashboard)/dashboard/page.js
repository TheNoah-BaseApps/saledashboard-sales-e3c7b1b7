'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, MousePointerClick, Store, UserPlus, TrendingUp, Mail, Inbox, Phone } from 'lucide-react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [funnelRes, engagementRes] = await Promise.all([
        fetch('/api/analytics/funnel'),
        fetch('/api/analytics/engagement')
      ]);

      if (!funnelRes.ok || !engagementRes.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const [funnelData, engagementData] = await Promise.all([
        funnelRes.json(),
        engagementRes.json()
      ]);

      setMetrics({
        funnel: funnelData.data || {},
        engagement: engagementData.data || {}
      });
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const stats = [
    {
      title: 'Total Website Visits',
      value: metrics?.funnel?.totalWebsiteVisits || 0,
      icon: MousePointerClick,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Store Visits',
      value: metrics?.funnel?.totalStoreVisits || 0,
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Signups',
      value: metrics?.funnel?.totalSignups || 0,
      icon: UserPlus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics?.funnel?.conversionRate || 0}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  const workflows = [
    {
      title: 'Newsletter Blogs',
      description: 'Manage newsletter subscriptions and blog content',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      href: '/newsletter-blogs'
    },
    {
      title: 'Email Interactions',
      description: 'Track email communications with sentiment analysis',
      icon: Inbox,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      href: '/email-interactions'
    },
    {
      title: 'Call Interactions',
      description: 'Monitor call transcripts and purchase intent',
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      href: '/call-interactions'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your sales funnel performance and customer engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Workflows
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your customer interaction workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(workflow.href)}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-lg ${workflow.bgColor}`}>
                    <workflow.icon className={`h-6 w-6 ${workflow.color}`} />
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {workflow.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {workflow.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  router.push(workflow.href);
                }}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}