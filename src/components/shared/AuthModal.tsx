

'use client';

import React, { useState, useEffect } from 'react';
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
import { Lock, UserPlus } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setIsLoginView(true);
    }
  }, [open]);

  const handleAuthAction = async () => {
    setIsLoading(true);
    setError('');

    let result;
    if (isLoginView) {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }

    if (result.success) {
      toast({
        title: isLoginView ? 'Login Successful' : 'Registration Successful',
        description: `Welcome!`,
      });
      onOpenChange(false);
    } else {
      setError(result.error || 'An unexpected error occurred.');
      setPassword(''); // Clear password on failure
    }

    setIsLoading(false);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthAction();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
        <DialogHeader className="text-center items-center">
            <div className="bg-muted p-3 rounded-full border border-border mb-2">
                {isLoginView ? <Lock className="h-6 w-6 text-accent" /> : <UserPlus className="h-6 w-6 text-accent" />}
            </div>
          <DialogTitle className="text-2xl">{isLoginView ? 'Sign In' : 'Create Account'}</DialogTitle>
          <DialogDescription>
            {isLoginView ? 'Enter your credentials to access your account.' : 'Create an account to get started.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
                {!isLoginView && (
                    <div className="space-y-2">
                        <Label htmlFor="name-input">Name</Label>
                        <Input
                            id="name-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jane Doe"
                            required
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email-input">Email</Label>
                    <Input
                        id="email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password-input">Password</Label>
                    <Input
                        id="password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading 
                    ? (isLoginView ? 'Signing In...' : 'Creating Account...') 
                    : (isLoginView ? 'Sign In' : 'Create Account')}
            </Button>
            <Button type="button" variant="link" onClick={() => setIsLoginView(!isLoginView)}>
                {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
