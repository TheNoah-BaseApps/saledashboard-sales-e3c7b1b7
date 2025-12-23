'use client';

import { useState, useEffect } from 'react';
import EngagementMetrics from '@/components/analytics/EngagementMetrics';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function EngagementAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEngagementData();
  }, []);

  const fetchEngagementData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/analytics/engagement');
      
      if (!response.ok) {
        throw new Error('Failed to fetch engagement analytics');
      }
      
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching engagement analytics:', err);
      setError(err.message || 'Failed to load engagement analytics');
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Engagement Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor customer engagement across all touchpoints
        </p>
      </div>

      <EngagementMetrics data={data} />
    </div>
  );
}