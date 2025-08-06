

'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Sparkles, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { generateAvatar } from '@/ai/flows/generate-avatar';

export const AIAvatarGenerator: React.FC<{ onAvatarGenerated: (url: string) => void }> = ({ onAvatarGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!prompt) {
            toast({ title: "Prompt is required", variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        try {
            const result = await generateAvatar({ prompt });
            onAvatarGenerated(result.imageUrl);
            toast({ title: "Avatar Generated!", description: "The new avatar has been set." });
            setIsOpen(false);
        } catch (error) {
            toast({ title: "Generation Failed", description: "Could not generate an avatar. Please try again.", variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" size="sm" variant="outline"><Sparkles className="mr-2 h-4 w-4" /> Generate AI Avatar</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle>Generate AI Avatar</DialogTitle>
                    <DialogDescription>
                        Describe the avatar you want to create. e.g., "ethereal, celestial, profile picture"
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <label htmlFor="prompt" className="text-sm font-medium">Prompt</label>
                    <Input id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A studio portrait..." />
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="button" onClick={handleGenerate} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
