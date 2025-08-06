
'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Rocket, AlertTriangle, PartyPopper, Trash2 } from 'lucide-react';
import { seedDatabase } from '@/ai/flows/seed-database';
import { clearDatabase } from '@/ai/flows/clear-database';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function SeedDatabasePage() {
    const { toast } = useToast();
    const [isSeeding, startSeedingTransition] = useTransition();
    const [isClearing, startClearingTransition] = useTransition();
    const [seedResult, setSeedResult] = useState<{success: boolean; message: string} | null>(null);
    const [clearResult, setClearResult] = useState<{success: boolean; message: string} | null>(null);
    

    const handleSeed = () => {
        startSeedingTransition(async () => {
            setSeedResult(null);
            setClearResult(null);
            const result = await seedDatabase();
            setSeedResult(result);
            if (result.success) {
                toast({
                    title: 'Database Seeded!',
                    description: 'Your database has been populated with new content.',
                });
            } else {
                 toast({
                    title: 'Seeding Failed',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    };
    
    const handleClear = () => {
        startClearingTransition(async () => {
            setSeedResult(null);
            setClearResult(null);
            const result = await clearDatabase();
            setClearResult(result);
             if (result.success) {
                toast({
                    title: 'Database Cleared!',
                    description: 'All content has been removed from the database.',
                    variant: 'destructive'
                });
            } else {
                 toast({
                    title: 'Clearing Failed',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <Card className="max-w-2xl mx-auto border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Rocket />
                        Seed Database with Sample Content
                    </CardTitle>
                    <CardDescription>
                        This action will add 20 models, 20 videos, and 20 galleries to your Firestore database. This is useful for development and testing purposes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {seedResult && (
                        <Alert variant={seedResult.success ? 'default' : 'destructive'} className={seedResult.success ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : ''}>
                           {seedResult.success ? <PartyPopper className="h-4 w-4 text-green-600 dark:text-green-400" /> : <AlertTriangle className="h-4 w-4" />}
                            <AlertTitle className={seedResult.success ? 'text-green-800 dark:text-green-300' : ''}>{seedResult.success ? 'Success!' : 'Error'}</AlertTitle>
                            <AlertDescription className={seedResult.success ? 'text-green-700 dark:text-green-400' : ''}>
                                {seedResult.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSeed} disabled={isSeeding || isClearing}>
                        {isSeeding ? 'Seeding...' : 'Run Seeder'}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="max-w-2xl mx-auto border-destructive/50">
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle />
                        Clear Database
                    </CardTitle>
                    <CardDescription>
                       This action will permanently delete all content from the `models`, `videos`, `galleries`, and `tags` collections.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {clearResult && (
                        <Alert variant={clearResult.success ? 'default' : 'destructive'} className={clearResult.success ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : ''}>
                           {clearResult.success ? <PartyPopper className="h-4 w-4 text-green-600 dark:text-green-400" /> : <AlertTriangle className="h-4 w-4" />}
                            <AlertTitle className={clearResult.success ? 'text-green-800 dark:text-green-300' : ''}>{clearResult.success ? 'Success!' : 'Error'}</AlertTitle>
                            <AlertDescription className={clearResult.success ? 'text-green-700 dark:text-green-400' : ''}>
                                {clearResult.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                 <CardFooter>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" disabled={isSeeding || isClearing}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isClearing ? 'Clearing...' : 'Clear All Content'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all models, videos, and galleries from your database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleClear} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete everything
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
