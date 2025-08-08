
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/lib/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Rocket, AlertTriangle, PartyPopper, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { initializeLocalStorage, clearLocalStorage } from '@/lib/localStorage';

export default function SeedDatabasePage() {
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [seedResult, setSeedResult] = useState<{success: boolean; message: string} | null>(null);
    const [clearResult, setClearResult] = useState<{success: boolean; message: string} | null>(null);
    

    const handleSeed = () => {
        setIsSeeding(true);
        setSeedResult(null);
        setClearResult(null);
        try {
            // Force clear and re-seed
            clearLocalStorage();
            initializeLocalStorage();
            setSeedResult({ success: true, message: 'Local storage has been successfully seeded with sample content.'});
            toast({
                title: 'Database Seeded!',
                description: 'Your local storage has been populated with new content.',
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            setSeedResult({ success: false, message });
            toast({
                title: 'Seeding Failed',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setIsSeeding(false);
        }
    };
    
    const handleClear = () => {
        setIsClearing(true);
        setSeedResult(null);
        setClearResult(null);
        try {
            clearLocalStorage();
            setClearResult({ success: true, message: 'All content has been cleared from local storage.' });
             toast({
                title: 'Database Cleared!',
                description: 'All content has been removed from your local storage.',
                variant: 'destructive'
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            setClearResult({ success: false, message });
             toast({
                title: 'Clearing Failed',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setIsClearing(false);
        }
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <Card className="max-w-2xl mx-auto border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Rocket />
                        Seed Local Storage
                    </CardTitle>
                    <CardDescription>
                        This action will clear and re-populate your browser's local storage with sample data for models, videos, and galleries. This is useful for development and testing purposes.
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
                        Clear Local Storage
                    </CardTitle>
                    <CardDescription>
                       This action will permanently delete all content from your browser's local storage for this site.
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
                            This action cannot be undone. This will permanently delete all models, videos, and galleries from your local storage.
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
