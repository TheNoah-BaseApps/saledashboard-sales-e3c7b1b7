'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MousePointerClick, Store, Calendar } from 'lucide-react';

export default function EngagementMetrics({ data }) {
  const metrics = [
    {
      title: 'Avg. Session Duration',
      value: `${Math.round((data?.avgSessionDuration || 0) / 60)} min`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Avg. Page Views',
      value: (data?.avgPageViews || 0).toFixed(1),
      icon: MousePointerClick,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Avg. Store Visits',
      value: (data?.avgStoreVisits || 0).toFixed(1),
      icon: Store,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Active Days',
      value: data?.activeDays || 0,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}