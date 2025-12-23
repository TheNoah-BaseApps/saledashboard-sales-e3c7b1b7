'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MousePointerClick,
  Store,
  UserPlus,
  Users,
  BarChart3,
  TrendingUp,
  Map,
  Mail,
  Inbox,
  Phone,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Website Visits', href: '/website-visits', icon: MousePointerClick },
  { name: 'Store Visits', href: '/store-visits', icon: Store },
  { name: 'Login/Signups', href: '/login-signups', icon: UserPlus },
  { name: 'Contacts', href: '/contacts', icon: Users },
  {
    name: 'Analytics',
    icon: BarChart3,
    children: [
      { name: 'Funnel', href: '/analytics/funnel', icon: TrendingUp },
      { name: 'Engagement', href: '/analytics/engagement', icon: BarChart3 },
      { name: 'Geographic', href: '/analytics/geographic', icon: Map },
    ],
  },
  { name: 'Newsletter Blogs', href: '/newsletter-blogs', icon: Mail },
  { name: 'Email Interactions', href: '/email-interactions', icon: Inbox },
  { name: 'Call Interactions', href: '/call-interactions', icon: Phone },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ open }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-30',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <nav className="h-full overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.children ? (
                <div>
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                  <ul className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.href}
                          className={cn(
                            'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                            pathname === child.href
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          )}
                        >
                          <child.icon className="h-4 w-4 mr-3" />
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                    pathname === item.href
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}