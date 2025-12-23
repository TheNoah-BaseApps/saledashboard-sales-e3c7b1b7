'use client';

import DataTable from '@/components/shared/DataTable';
import { useRouter } from 'next/navigation';
import { formatDate, formatTime } from '@/lib/formatters';

export default function StoreVisitTable({ visits, onRefresh }) {
  const router = useRouter();

  const columns = [
    {
      key: 'owner_contact',
      label: 'Contact',
      sortable: true,
    },
    {
      key: 'number_of_visits',
      label: 'Visits',
      sortable: true,
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
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
      onRowClick={(visit) => router.push(`/store-visits/${visit.id}`)}
    />
  );
}