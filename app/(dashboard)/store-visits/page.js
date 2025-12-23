'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import StoreVisitTable from '@/components/store-visits/StoreVisitTable';
import StoreVisitForm from '@/components/store-visits/StoreVisitForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoreVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/store-visits');
      
      if (!response.ok) {
        throw new Error('Failed to fetch store visits');
      }
      
      const data = await response.json();
      setVisits(data.data || []);
    } catch (err) {
      console.error('Error fetching store visits:', err);
      setError(err.message || 'Failed to load store visits');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchVisits();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Store Visits
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor physical store visit patterns
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Visit
        </Button>
      </div>

      <StoreVisitTable visits={visits} onRefresh={fetchVisits} />

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Store Visit</DialogTitle>
          </DialogHeader>
          <StoreVisitForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}