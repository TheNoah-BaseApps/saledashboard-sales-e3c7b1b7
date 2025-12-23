'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function StoreVisitForm({ visit, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    owner_contact: visit?.owner_contact || '',
    number_of_visits: visit?.number_of_visits || 1,
    location: visit?.location || '',
    time: visit?.time || '',
    date: visit?.date || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        number_of_visits: parseInt(formData.number_of_visits),
      };

      const url = visit ? `/api/store-visits/${visit.id}` : '/api/store-visits';
      const method = visit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save store visit');
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error saving store visit:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner_contact">Owner Contact *</Label>
          <Input
            id="owner_contact"
            value={formData.owner_contact}
            onChange={(e) => setFormData({ ...formData, owner_contact: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number_of_visits">Number of Visits</Label>
          <Input
            id="number_of_visits"
            type="number"
            min="1"
            value={formData.number_of_visits}
            onChange={(e) => setFormData({ ...formData, number_of_visits: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {visit ? 'Update' : 'Create'} Visit
        </Button>
      </div>
    </form>
  );
}