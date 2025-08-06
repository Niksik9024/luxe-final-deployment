
'use client';

// This will be used for Context Providers in later steps.
// For now, it just passes children through.

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
        </>
    )
}
