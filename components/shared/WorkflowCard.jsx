'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WorkflowCard({ title, description, icon: Icon, count, href, color }) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(href)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
          </div>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full justify-between" onClick={() => router.push(href)}>
          View Details
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}