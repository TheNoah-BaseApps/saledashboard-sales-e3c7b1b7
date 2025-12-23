'use client';

import { useState, useEffect } from 'react';
import FunnelChart from '@/components/analytics/FunnelChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function FunnelAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFunnelData();
  }, []);

  const fetchFunnelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/analytics/funnel');
      
      if (!response.ok) {
        throw new Error('Failed to fetch funnel analytics');
      }
      
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching funnel analytics:', err);
      setError(err.message || 'Failed to load funnel analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
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

  const conversionMetrics = [
    {
      label: 'Website to Store',
      rate: data?.websiteToStoreRate || 0,
      color: 'text-blue-600'
    },
    {
      label: 'Store to Signup',
      rate: data?.storeToSignupRate || 0,
      color: 'text-green-600'
    },
    {
      label: 'Website to Signup',
      rate: data?.conversionRate || 0,
      color: 'text-purple-600'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Funnel Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze conversion rates across your sales funnel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {conversionMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.rate.toFixed(1)}%
                </div>
                {metric.rate > 50 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : metric.rate > 25 ? (
                  <Minus className="h-5 w-5 text-yellow-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FunnelChart data={data} />
    </div>
  );
}