
import React from 'react';
import { ModelsAdminClient } from '@/components/admin/ModelsAdminClient';

export const metadata = {
  title: 'Admin: Manage Models',
};

export default async function ManageModelsPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Models</h1>
      <ModelsAdminClient />
    </div>
  );
}
