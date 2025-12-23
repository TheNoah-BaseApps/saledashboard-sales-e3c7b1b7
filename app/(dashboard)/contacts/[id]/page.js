'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MousePointerClick, Store, UserPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ContactProfileCard from '@/components/contacts/ContactProfileCard';
import { formatDate } from '@/lib/formatters';

export default function ContactDetailPage({ params }) {
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContact();
  }, [params.id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/contacts/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contact');
      }
      
      const data = await response.json();
      setContact(data.data);
    } catch (err) {
      console.error('Error fetching contact:', err);
      setError(err.message || 'Failed to load contact');
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

  if (error || !contact) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{error || 'Contact not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const activities = [
    {
      title: 'Website Visits',
      value: contact.total_website_visits || 0,
      icon: MousePointerClick,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Store Visits',
      value: contact.total_store_visits || 0,
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Registration Status',
      value: contact.has_registered ? 'Registered' : 'Not Registered',
      icon: UserPlus,
      color: contact.has_registered ? 'text-purple-600' : 'text-gray-400',
      bgColor: contact.has_registered ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-gray-100 dark:bg-gray-800'
    },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <ContactProfileCard contact={contact} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activities.map((activity, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {activity.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {activity.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">First Seen</p>
              <p className="font-medium">{formatDate(contact.first_seen)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last Activity</p>
              <p className="font-medium">{formatDate(contact.last_activity)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}