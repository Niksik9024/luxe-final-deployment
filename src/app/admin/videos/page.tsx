

import React from 'react';
import { VideosAdminClient } from '@/components/admin/VideosAdminClient';

export default async function ManageVideosPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Videos</h1>
      </div>
      <VideosAdminClient />
    </div>
  );
}
