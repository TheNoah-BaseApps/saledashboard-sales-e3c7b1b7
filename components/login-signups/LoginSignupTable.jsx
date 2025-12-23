'use client';

import DataTable from '@/components/shared/DataTable';
import { useRouter } from 'next/navigation';
import { formatDate, formatTime } from '@/lib/formatters';

export default function LoginSignupTable({ signups, onRefresh }) {
  const router = useRouter();

  const columns = [
    {
      key: 'username',
      label: 'Username',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'time',
      label: 'Time',
      render: (value) => formatTime(value),
    },
  ];

  return (
    <DataTable
      data={signups}
      columns={columns}
      onRowClick={(signup) => router.push(`/login-signups/${signup.id}`)}
    />
  );
}