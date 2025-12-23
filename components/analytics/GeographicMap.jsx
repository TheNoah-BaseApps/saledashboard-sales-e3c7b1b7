'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function GeographicMap({ data }) {
  const locations = data?.locationBreakdown || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Geographic Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locations.length > 0 ? (
            locations.map((location, index) => {
              const total = location.website_visits + location.store_visits + location.signups;
              const maxTotal = Math.max(...locations.map(l => l.website_visits + l.store_visits + l.signups));
              const percentage = (total / maxTotal) * 100;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {location.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {total} total activities
                    </p>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>Website: {location.website_visits}</span>
                    <span>Store: {location.store_visits}</span>
                    <span>Signups: {location.signups}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-8">No location data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}