'use client';

import DataTable from '@/components/shared/DataTable';
import { useRouter } from 'next/navigation';
import { formatDate, formatTime } from '@/lib/formatters';

export default function WebsiteVisitTable({ visits, onRefresh }) {
  const router = useRouter();

  const columns = [
    {
      key: 'ip',
      label: 'IP Address',
      sortable: true,
    },
    {
      key: 'owner_contact',
      label: 'Contact',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'number_of_visits',
      label: 'Visits',
      sortable: true,
    },
    {
      key: 'website_duration',
      label: 'Duration',
      render: (value) => `${value}s`,
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
      data={visits}
      columns={columns}
      onRowClick={(visit) => router.push(`/website-visits/${visit.id}`)}
    />
  );
}