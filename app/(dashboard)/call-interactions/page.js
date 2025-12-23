'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Phone, Plus, Trash2, Edit, Clock, TrendingUp, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function CallInteractionsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCall, setEditingCall] = useState(null);
  const [formData, setFormData] = useState({
    time: '',
    date: '',
    email_ids: '',
    name: '',
    call_duration: '',
    voice_recordings: '',
    transcripts: '',
    summary: '',
    sentiment: '',
    action_items: '',
    purchase_intent_score: '',
    sales_highlights: ''
  });

  useEffect(() => {
    fetchCalls();
  }, []);

  async function fetchCalls() {
    try {
      setLoading(true);
      const res = await fetch('/api/call-interactions');
      const data = await res.json();
      if (data.success) {
        setCalls(data.data);
      } else {
        toast.error('Failed to load call interactions');
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
      toast.error('Failed to load call interactions');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = editingCall ? `/api/call-interactions/${editingCall.id}` : '/api/call-interactions';
      const method = editingCall ? 'PUT' : 'POST';
      
      const submitData = {
        ...formData,
        purchase_intent_score: formData.purchase_intent_score ? parseInt(formData.purchase_intent_score) : null
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(editingCall ? 'Call interaction updated' : 'Call interaction created');
        setIsAddOpen(false);
        setIsEditOpen(false);
        setFormData({
          time: '',
          date: '',
          email_ids: '',
          name: '',
          call_duration: '',
          voice_recordings: '',
          transcripts: '',
          summary: '',
          sentiment: '',
          action_items: '',
          purchase_intent_score: '',
          sales_highlights: ''
        });
        setEditingCall(null);
        fetchCalls();
      } else {
        toast.error(data.error || 'Failed to save call interaction');
      }
    } catch (error) {
      console.error('Error saving call:', error);
      toast.error('Failed to save call interaction');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this call interaction?')) return;
    
    try {
      const res = await fetch(`/api/call-interactions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Call interaction deleted');
        fetchCalls();
      } else {
        toast.error('Failed to delete call interaction');
      }
    } catch (error) {
      console.error('Error deleting call:', error);
      toast.error('Failed to delete call interaction');
    }
  }

  function openEditModal(call) {
    setEditingCall(call);
    setFormData({
      time: call.time || '',
      date: call.date ? new Date(call.date).toISOString().split('T')[0] : '',
      email_ids: call.email_ids || '',
      name: call.name || '',
      call_duration: call.call_duration || '',
      voice_recordings: call.voice_recordings || '',
      transcripts: call.transcripts || '',
      summary: call.summary || '',
      sentiment: call.sentiment || '',
      action_items: call.action_items || '',
      purchase_intent_score: call.purchase_intent_score?.toString() || '',
      sales_highlights: call.sales_highlights || ''
    });
    setIsEditOpen(true);
  }

  const avgPurchaseIntent = calls.length > 0 
    ? Math.round(calls.filter(c => c.purchase_intent_score).reduce((sum, c) => sum + (c.purchase_intent_score || 0), 0) / calls.filter(c => c.purchase_intent_score).length) 
    : 0;

  const stats = [
    {
      title: 'Total Calls',
      value: calls.length,
      icon: Phone,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Purchase Intent',
      value: avgPurchaseIntent || 'N/A',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'This Month',
      value: calls.filter(c => {
        const callDate = new Date(c.created_at);
        const now = new Date();
        return callDate.getMonth() === now.getMonth() && callDate.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Call Interactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track call transcripts, sentiment, and purchase intent
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Call Interaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Call Interactions</CardTitle>
          <CardDescription>View and manage all call interactions</CardDescription>
        </CardHeader>
        <CardContent>
          {calls.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No call interactions yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first call interaction</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Call Interaction
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Purchase Intent</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">{call.name || 'Unknown'}</TableCell>
                    <TableCell>{call.call_duration || '-'}</TableCell>
                    <TableCell>
                      {call.sentiment && (
                        <Badge variant={
                          call.sentiment === 'positive' ? 'default' : 
                          call.sentiment === 'negative' ? 'destructive' : 
                          'secondary'
                        }>
                          {call.sentiment}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {call.purchase_intent_score && (
                        <Badge variant={call.purchase_intent_score >= 7 ? 'default' : 'secondary'}>
                          {call.purchase_intent_score}/10
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{call.date ? new Date(call.date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(call)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(call.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setIsEditOpen(false);
          setEditingCall(null);
          setFormData({
            time: '',
            date: '',
            email_ids: '',
            name: '',
            call_duration: '',
            voice_recordings: '',
            transcripts: '',
            summary: '',
            sentiment: '',
            action_items: '',
            purchase_intent_score: '',
            sales_highlights: ''
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCall ? 'Edit' : 'Add'} Call Interaction</DialogTitle>
            <DialogDescription>
              {editingCall ? 'Update the' : 'Enter'} call interaction details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_ids">Email IDs</Label>
                <Input
                  id="email_ids"
                  value={formData.email_ids}
                  onChange={(e) => setFormData({ ...formData, email_ids: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="call_duration">Call Duration</Label>
                <Input
                  id="call_duration"
                  value={formData.call_duration}
                  onChange={(e) => setFormData({ ...formData, call_duration: e.target.value })}
                  placeholder="e.g., 15 min"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sentiment">Sentiment</Label>
                <Input
                  id="sentiment"
                  value={formData.sentiment}
                  onChange={(e) => setFormData({ ...formData, sentiment: e.target.value })}
                  placeholder="positive, neutral, negative"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_intent_score">Purchase Intent Score (1-10)</Label>
                <Input
                  id="purchase_intent_score"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.purchase_intent_score}
                  onChange={(e) => setFormData({ ...formData, purchase_intent_score: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voice_recordings">Voice Recordings URL</Label>
                <Input
                  id="voice_recordings"
                  value={formData.voice_recordings}
                  onChange={(e) => setFormData({ ...formData, voice_recordings: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="transcripts">Transcripts</Label>
                <Textarea
                  id="transcripts"
                  value={formData.transcripts}
                  onChange={(e) => setFormData({ ...formData, transcripts: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="action_items">Action Items</Label>
                <Textarea
                  id="action_items"
                  value={formData.action_items}
                  onChange={(e) => setFormData({ ...formData, action_items: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="sales_highlights">Sales Highlights</Label>
                <Textarea
                  id="sales_highlights"
                  value={formData.sales_highlights}
                  onChange={(e) => setFormData({ ...formData, sales_highlights: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
                setEditingCall(null);
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCall ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}