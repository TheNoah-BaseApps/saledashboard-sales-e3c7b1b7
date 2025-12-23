'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import WebsiteVisitTable from '@/components/website-visits/WebsiteVisitTable';
import WebsiteVisitForm from '@/components/website-visits/WebsiteVisitForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function WebsiteVisitsPage() {
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
      const response = await fetch('/api/website-visits');
      
      if (!response.ok) {
        throw new Error('Failed to fetch website visits');
      }
      
      const data = await response.json();
      setVisits(data.data || []);
    } catch (err) {
      console.error('Error fetching website visits:', err);
      setError(err.message || 'Failed to load website visits');
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
            Website Visits
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and analyze website visitor behavior
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Visit
        </Button>
      </div>

      <WebsiteVisitTable visits={visits} onRefresh={fetchVisits} />

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Website Visit</DialogTitle>
          </DialogHeader>
          <WebsiteVisitForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}