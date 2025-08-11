
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
import { useToast } from '@/lib/use-toast';
import { ImageIcon, Upload } from 'lucide-react';

interface ChangeImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeImageModal({ open, onOpenChange }: ChangeImageModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUserImage } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    setLoading(true);
    try {
      await updateUserImage(imageUrl);
      toast({
        title: "Avatar updated!",
        description: "Your profile image has been updated successfully.",
      });
      onOpenChange(false);
      setImageUrl('');
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update your avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ImageIcon className="h-5 w-5" />
            Change Avatar
          </DialogTitle>
          <DialogDescription>
            Enter a URL to update your profile image. The image should be publicly accessible.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              placeholder="https://example.com/your-image.jpg"
              className="min-h-[44px] text-base"
            />
          </div>

          <DialogFooter className="flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto min-h-[44px] text-base"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !imageUrl.trim()}
              className="w-full sm:w-auto btn-luxury min-h-[44px] text-base font-semibold"
            >
              {loading ? 'Updating...' : 'Update Avatar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
