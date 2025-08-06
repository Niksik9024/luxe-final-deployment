
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Image } from 'lucide-react';

interface ChangeImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangeImageModal: React.FC<ChangeImageModalProps> = ({ open, onOpenChange }) => {
  const { currentUser, updateUserImage } = useAuth();
  const [imageUrl, setImageUrl] = useState(currentUser?.image || '');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSave = async () => {
    setError('');
    if (!imageUrl || !imageUrl.startsWith('http')) {
        setError('Please enter a valid image URL.');
        return;
    }
    await updateUserImage(imageUrl);
    toast({
        title: 'Profile Picture Updated',
        description: 'Your new profile picture has been saved.',
    });
    onOpenChange(false);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  }

  // Update local state if the modal is reopened and the user image has changed elsewhere
  React.useEffect(() => {
    if (open) {
      setImageUrl(currentUser?.image || '');
    }
  }, [open, currentUser?.image]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
        <DialogHeader className="text-center items-center">
            <div className="bg-muted p-3 rounded-full border border-border mb-2">
                <Image className="h-6 w-6 text-accent" />
            </div>
          <DialogTitle className="text-2xl">Change Profile Picture</DialogTitle>
          <DialogDescription>
            Enter a new image URL to update your profile picture.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="image-url-input">
                    Image URL
                    </Label>
                    <Input
                    id="image-url-input"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.png"
                    autoFocus
                    />
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                Save Changes
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
