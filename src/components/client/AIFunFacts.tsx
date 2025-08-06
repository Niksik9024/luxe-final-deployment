

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import { generateFunFacts } from '@/ai/flows/generate-fun-facts';
import DOMPurify from 'isomorphic-dompurify';


export const AIFunFacts: React.FC<{ modelName: string }> = ({ modelName }) => {
    const [facts, setFacts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateFacts = async () => {
        setIsLoading(true);
        setFacts([]); // Clear previous facts immediately for a better loading experience
        try {
            const result = await generateFunFacts({ modelName });
            setFacts(result.facts);
        } catch (error) {
            setFacts(["Could not generate fun facts at this time."]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="sticky top-24 bg-card border-border shadow-lg">
            <CardHeader className="flex flex-row items-center gap-2">
                <Sparkles className="text-accent w-6 h-6"/>
                <CardTitle className="text-xl">AI Fun Facts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 mb-6 min-h-[150px]">
                    {isLoading ? (
                        <div className="space-y-3">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-5/6" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-4/6" />
                        </div>
                    ) : facts.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                           {facts.map((fact, i) => {
                                const cleanFact = DOMPurify.sanitize(fact);
                                return <li key={i} dangerouslySetInnerHTML={{ __html: cleanFact }} />;
                           })}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">Click the button to generate some fun facts about {modelName}!</p>
                    )}
                </div>
                 <Button onClick={handleGenerateFacts} className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                    {isLoading ? 'Generating...' : `Generate for ${modelName}`}
                </Button>
            </CardContent>
        </Card>
    )
}
