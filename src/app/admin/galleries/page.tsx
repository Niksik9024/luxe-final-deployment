

import React from 'react';
import { GalleriesAdminClient } from '@/components/admin/GalleriesAdminClient';

export const metadata = {
  title: 'Admin: Manage Galleries',
};


export default async function ManageGalleriesPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Galleries</h1>
      <GalleriesAdminClient />
    </div>
  );
}
