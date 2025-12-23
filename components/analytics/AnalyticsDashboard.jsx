'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FunnelChart from './FunnelChart';
import EngagementMetrics from './EngagementMetrics';
import GeographicMap from './GeographicMap';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsDashboard() {
  const [funnelData, setFunnelData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      const [funnel, engagement, geo] = await Promise.all([
        fetch('/api/analytics/funnel').then(r => r.json()),
        fetch('/api/analytics/engagement').then(r => r.json()),
        fetch('/api/analytics/geographic').then(r => r.json()),
      ]);

      setFunnelData(funnel.data);
      setEngagementData(engagement.data);
      setGeoData(geo.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96" />;
  }

  return (
    <Tabs defaultValue="funnel" className="space-y-4">
      <TabsList>
        <TabsTrigger value="funnel">Funnel</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
        <TabsTrigger value="geographic">Geographic</TabsTrigger>
      </TabsList>

      <TabsContent value="funnel" className="space-y-4">
        <FunnelChart data={funnelData} />
      </TabsContent>

      <TabsContent value="engagement" className="space-y-4">
        <EngagementMetrics data={engagementData} />
      </TabsContent>

      <TabsContent value="geographic" className="space-y-4">
        <GeographicMap data={geoData} />
      </TabsContent>
    </Tabs>
  );
}