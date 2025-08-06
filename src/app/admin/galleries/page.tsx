

import React from 'react';
import { GalleriesAdminClient } from '@/components/admin/GalleriesAdminClient';

export const metadata = {
  title: 'Admin: Manage Galleries',
};


export default async function ManageGalleriesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Galleries</h1>
      </div>
      <GalleriesAdminClient />
    </div>
  );
}
