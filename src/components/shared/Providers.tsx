
'use client';

import { AuthProvider } from "@/lib/auth";
import { DataSaverProvider } from "@/contexts/DataSaverContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <DataSaverProvider>
                {children}
            </DataSaverProvider>
        </AuthProvider>
    )
}
