'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';

export default function FunnelChart({ data }) {
  const stages = [
    {
      name: 'Website Visits',
      value: data?.totalWebsiteVisits || 0,
      percentage: 100,
      color: 'bg-blue-500'
    },
    {
      name: 'Store Visits',
      value: data?.totalStoreVisits || 0,
      percentage: data?.websiteToStoreRate || 0,
      color: 'bg-green-500'
    },
    {
      name: 'Signups',
      value: data?.totalSignups || 0,
      percentage: data?.storeToSignupRate || 0,
      color: 'bg-purple-500'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{stage.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stage.value.toLocaleString()} visitors
                  </p>
                </div>
                {index > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {(100 - stage.percentage).toFixed(1)}% drop-off
                    </span>
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-center text-white font-medium`}
                    style={{ width: `${stage.percentage}%` }}
                  >
                    {stage.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}