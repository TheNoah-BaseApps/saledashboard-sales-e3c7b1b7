'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Plus, Trash2, Edit, Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    location: '',
    time: '',
    date: '',
    frequency: '',
    status: 'active',
    newsletter_name: '',
    blogs: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      setLoading(true);
      const res = await fetch('/api/newsletter-blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      } else {
        toast.error('Failed to load newsletter blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load newsletter blogs');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = editingBlog ? `/api/newsletter-blogs/${editingBlog.id}` : '/api/newsletter-blogs';
      const method = editingBlog ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(editingBlog ? 'Newsletter blog updated' : 'Newsletter blog created');
        setIsAddOpen(false);
        setIsEditOpen(false);
        setFormData({
          email: '',
          location: '',
          time: '',
          date: '',
          frequency: '',
          status: 'active',
          newsletter_name: '',
          blogs: ''
        });
        setEditingBlog(null);
        fetchBlogs();
      } else {
        toast.error(data.error || 'Failed to save newsletter blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save newsletter blog');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this newsletter blog?')) return;
    
    try {
      const res = await fetch(`/api/newsletter-blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Newsletter blog deleted');
        fetchBlogs();
      } else {
        toast.error('Failed to delete newsletter blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete newsletter blog');
    }
  }

  function openEditModal(blog) {
    setEditingBlog(blog);
    setFormData({
      email: blog.email || '',
      location: blog.location || '',
      time: blog.time || '',
      date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : '',
      frequency: blog.frequency || '',
      status: blog.status || 'active',
      newsletter_name: blog.newsletter_name || '',
      blogs: blog.blogs || ''
    });
    setIsEditOpen(true);
  }

  const stats = [
    {
      title: 'Total Subscribers',
      value: blogs.length,
      icon: Mail,
      color: 'text-blue-600'
    },
    {
      title: 'Active',
      value: blogs.filter(b => b.status === 'active').length,
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'This Month',
      value: blogs.filter(b => {
        const blogDate = new Date(b.created_at);
        const now = new Date();
        return blogDate.getMonth() === now.getMonth() && blogDate.getFullYear() === now.getFullYear();
      }).length,
      icon: Clock,
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Blogs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage newsletter subscriptions and blog content
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Newsletter Blog
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
          <CardTitle>Newsletter Blogs</CardTitle>
          <CardDescription>View and manage all newsletter blog entries</CardDescription>
        </CardHeader>
        <CardContent>
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No newsletter blogs yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first newsletter blog entry</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Newsletter Blog
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Newsletter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.email}</TableCell>
                    <TableCell>{blog.newsletter_name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={blog.status === 'active' ? 'default' : 'secondary'}>
                        {blog.status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{blog.frequency || '-'}</TableCell>
                    <TableCell>{blog.location || '-'}</TableCell>
                    <TableCell>{blog.date ? new Date(blog.date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(blog)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(blog.id)}>
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
          setEditingBlog(null);
          setFormData({
            email: '',
            location: '',
            time: '',
            date: '',
            frequency: '',
            status: 'active',
            newsletter_name: '',
            blogs: ''
          });
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit' : 'Add'} Newsletter Blog</DialogTitle>
            <DialogDescription>
              {editingBlog ? 'Update the' : 'Enter'} newsletter blog information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter_name">Newsletter Name</Label>
                <Input
                  id="newsletter_name"
                  value={formData.newsletter_name}
                  onChange={(e) => setFormData({ ...formData, newsletter_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blogs">Blogs</Label>
              <Input
                id="blogs"
                value={formData.blogs}
                onChange={(e) => setFormData({ ...formData, blogs: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
                setEditingBlog(null);
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingBlog ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}