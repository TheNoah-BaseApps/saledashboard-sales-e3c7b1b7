'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import LoginSignupTable from '@/components/login-signups/LoginSignupTable';
import LoginSignupForm from '@/components/login-signups/LoginSignupForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginSignupsPage() {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/login-signups');
      
      if (!response.ok) {
        throw new Error('Failed to fetch login/signup activities');
      }
      
      const data = await response.json();
      setSignups(data.data || []);
    } catch (err) {
      console.error('Error fetching login/signup activities:', err);
      setError(err.message || 'Failed to load login/signup activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchSignups();
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
            Login & Signup Activities
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track user registrations and login activities
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>

      <LoginSignupTable signups={signups} onRefresh={fetchSignups} />

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Login/Signup Activity</DialogTitle>
          </DialogHeader>
          <LoginSignupForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}