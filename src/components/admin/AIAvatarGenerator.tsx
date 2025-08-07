
'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Sparkles, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";

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
        // Simulate AI generation with a placeholder
        setTimeout(() => {
            const seed = encodeURIComponent(prompt.substring(0, 20));
            const url = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&h=600&auto=format&fit=crop&seed=${seed}`;
            onAvatarGenerated(url);
            toast({ title: "Avatar Generated!", description: "The new avatar has been set." });
            setIsOpen(false);
            setIsLoading(false);
        }, 1500);
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
