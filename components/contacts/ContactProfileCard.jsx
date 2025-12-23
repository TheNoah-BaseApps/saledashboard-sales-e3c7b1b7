'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Activity } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

export default function ContactProfileCard({ contact }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span className="text-sm">Contact Information</span>
            </div>
            <p className="text-lg font-medium">{contact.contact_info}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Status</span>
            </div>
            <p className="text-lg font-medium">
              {contact.has_registered ? (
                <span className="text-green-600 dark:text-green-400">Registered User</span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">Visitor</span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">First Seen</span>
            </div>
            <p className="text-lg font-medium">{formatDate(contact.first_seen)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Last Activity</span>
            </div>
            <p className="text-lg font-medium">{formatDate(contact.last_activity)}</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Activity Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{contact.total_website_visits || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Website Visits</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{contact.total_store_visits || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Store Visits</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {(contact.total_website_visits || 0) + (contact.total_store_visits || 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Engagements</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}