

import React from 'react';
import { VideosAdminClient } from '@/components/admin/VideosAdminClient';

export default async function ManageVideosPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Videos</h1>
      <VideosAdminClient />
    </div>
  );
}
