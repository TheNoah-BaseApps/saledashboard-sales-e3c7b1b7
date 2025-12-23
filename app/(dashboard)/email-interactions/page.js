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
import { Mail, Plus, Trash2, Edit, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailInteractionsPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState(null);
  const [formData, setFormData] = useState({
    email_ids: '',
    email_domain: '',
    subject: '',
    message: '',
    attachments: '',
    time: '',
    date: '',
    thread: '',
    summary: '',
    sentiment: '',
    sender_id: '',
    receiver_id: '',
    cc_id: ''
  });

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    try {
      setLoading(true);
      const res = await fetch('/api/email-interactions');
      const data = await res.json();
      if (data.success) {
        setEmails(data.data);
      } else {
        toast.error('Failed to load email interactions');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to load email interactions');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = editingEmail ? `/api/email-interactions/${editingEmail.id}` : '/api/email-interactions';
      const method = editingEmail ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(editingEmail ? 'Email interaction updated' : 'Email interaction created');
        setIsAddOpen(false);
        setIsEditOpen(false);
        setFormData({
          email_ids: '',
          email_domain: '',
          subject: '',
          message: '',
          attachments: '',
          time: '',
          date: '',
          thread: '',
          summary: '',
          sentiment: '',
          sender_id: '',
          receiver_id: '',
          cc_id: ''
        });
        setEditingEmail(null);
        fetchEmails();
      } else {
        toast.error(data.error || 'Failed to save email interaction');
      }
    } catch (error) {
      console.error('Error saving email:', error);
      toast.error('Failed to save email interaction');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this email interaction?')) return;
    
    try {
      const res = await fetch(`/api/email-interactions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Email interaction deleted');
        fetchEmails();
      } else {
        toast.error('Failed to delete email interaction');
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Failed to delete email interaction');
    }
  }

  function openEditModal(email) {
    setEditingEmail(email);
    setFormData({
      email_ids: email.email_ids || '',
      email_domain: email.email_domain || '',
      subject: email.subject || '',
      message: email.message || '',
      attachments: email.attachments || '',
      time: email.time || '',
      date: email.date ? new Date(email.date).toISOString().split('T')[0] : '',
      thread: email.thread || '',
      summary: email.summary || '',
      sentiment: email.sentiment || '',
      sender_id: email.sender_id || '',
      receiver_id: email.receiver_id || '',
      cc_id: email.cc_id || ''
    });
    setIsEditOpen(true);
  }

  const stats = [
    {
      title: 'Total Emails',
      value: emails.length,
      icon: Mail,
      color: 'text-blue-600'
    },
    {
      title: 'Threads',
      value: new Set(emails.filter(e => e.thread).map(e => e.thread)).size,
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      title: 'This Month',
      value: emails.filter(e => {
        const emailDate = new Date(e.created_at);
        const now = new Date();
        return emailDate.getMonth() === now.getMonth() && emailDate.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'text-green-600'
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Interactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage email communications with sentiment analysis
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Email Interaction
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
          <CardTitle>Email Interactions</CardTitle>
          <CardDescription>View and manage all email interactions</CardDescription>
        </CardHeader>
        <CardContent>
          {emails.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No email interactions yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first email interaction</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Email Interaction
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Thread</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium">{email.subject || 'No subject'}</TableCell>
                    <TableCell>{email.sender_id || '-'}</TableCell>
                    <TableCell>{email.thread || '-'}</TableCell>
                    <TableCell>
                      {email.sentiment && (
                        <Badge variant={
                          email.sentiment === 'positive' ? 'default' : 
                          email.sentiment === 'negative' ? 'destructive' : 
                          'secondary'
                        }>
                          {email.sentiment}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{email.date ? new Date(email.date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(email)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(email.id)}>
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
          setEditingEmail(null);
          setFormData({
            email_ids: '',
            email_domain: '',
            subject: '',
            message: '',
            attachments: '',
            time: '',
            date: '',
            thread: '',
            summary: '',
            sentiment: '',
            sender_id: '',
            receiver_id: '',
            cc_id: ''
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEmail ? 'Edit' : 'Add'} Email Interaction</DialogTitle>
            <DialogDescription>
              {editingEmail ? 'Update the' : 'Enter'} email interaction details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email_ids">Email IDs</Label>
                <Input
                  id="email_ids"
                  value={formData.email_ids}
                  onChange={(e) => setFormData({ ...formData, email_ids: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_domain">Email Domain</Label>
                <Input
                  id="email_domain"
                  value={formData.email_domain}
                  onChange={(e) => setFormData({ ...formData, email_domain: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender_id">Sender ID</Label>
                <Input
                  id="sender_id"
                  value={formData.sender_id}
                  onChange={(e) => setFormData({ ...formData, sender_id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver_id">Receiver ID</Label>
                <Input
                  id="receiver_id"
                  value={formData.receiver_id}
                  onChange={(e) => setFormData({ ...formData, receiver_id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cc_id">CC ID</Label>
                <Input
                  id="cc_id"
                  value={formData.cc_id}
                  onChange={(e) => setFormData({ ...formData, cc_id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thread">Thread</Label>
                <Input
                  id="thread"
                  value={formData.thread}
                  onChange={(e) => setFormData({ ...formData, thread: e.target.value })}
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
                <Label htmlFor="attachments">Attachments</Label>
                <Input
                  id="attachments"
                  value={formData.attachments}
                  onChange={(e) => setFormData({ ...formData, attachments: e.target.value })}
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
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
                setEditingEmail(null);
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEmail ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}