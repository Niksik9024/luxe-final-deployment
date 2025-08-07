
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';

interface SecretCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SECRET_CODE = "LUXE-PASS";

export default function SecretCodeModal({ isOpen, onClose, onSuccess }: SecretCodeModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerifyCode = () => {
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (code === SECRET_CODE) {
        toast({
          title: "Access Granted",
          description: "Welcome to LUXE.",
        });
        onSuccess();
      } else {
        setError("Invalid access code. Please try again.");
        toast({
          title: "Access Denied",
          description: "The code you entered is incorrect.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyCode();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
        <DialogHeader className="text-center items-center">
            <div className="bg-muted p-3 rounded-full border border-border mb-2">
                <KeyRound className="h-6 w-6 text-accent" />
            </div>
            <DialogTitle className="text-2xl">Premium Access</DialogTitle>
            <DialogDescription>
                Please enter your access code to proceed.
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="secret-code-input">Access Code</Label>
                    <Input
                        id="secret-code-input"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter your code"
                        required
                        autoFocus
                    />
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Unlock Access'}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
