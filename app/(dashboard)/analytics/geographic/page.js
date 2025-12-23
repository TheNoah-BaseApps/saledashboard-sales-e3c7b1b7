'use client';

import { useState, useEffect } from 'react';
import GeographicMap from '@/components/analytics/GeographicMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function GeographicAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGeographicData();
  }, []);

  const fetchGeographicData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/analytics/geographic');
      
      if (!response.ok) {
        throw new Error('Failed to fetch geographic analytics');
      }
      
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching geographic analytics:', err);
      setError(err.message || 'Failed to load geographic analytics');
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
          Geographic Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze customer engagement by location
        </p>
      </div>

      <GeographicMap data={data} />

      <Card>
        <CardHeader>
          <CardTitle>Top Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.topLocations && data.topLocations.length > 0 ? (
              data.topLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{location.location}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {location.website_visits} website | {location.store_visits} store | {location.signups} signups
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{location.total}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">total activities</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No location data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}