'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StoreVisitForm from '@/components/store-visits/StoreVisitForm';
import { formatDate, formatTime } from '@/lib/formatters';

export default function StoreVisitDetailPage({ params }) {
  const router = useRouter();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchVisit();
  }, [params.id]);

  const fetchVisit = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/store-visits/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch store visit');
      }
      
      const data = await response.json();
      setVisit(data.data);
    } catch (err) {
      console.error('Error fetching store visit:', err);
      setError(err.message || 'Failed to load store visit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this visit?')) return;

    try {
      const response = await fetch(`/api/store-visits/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete visit');
      }

      router.push('/store-visits');
    } catch (err) {
      console.error('Error deleting visit:', err);
      alert('Failed to delete visit');
    }
  };

  const handleSuccess = () => {
    setIsEditModalOpen(false);
    fetchVisit();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{error || 'Visit not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Visit Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
              <p className="font-medium">{visit.owner_contact || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Number of Visits</p>
              <p className="font-medium">{visit.number_of_visits || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
              <p className="font-medium">{visit.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
              <p className="font-medium">{formatDate(visit.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
              <p className="font-medium">{formatTime(visit.time)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Store Visit</DialogTitle>
          </DialogHeader>
          <StoreVisitForm visit={visit} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}