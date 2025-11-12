'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '../../../firebase/clientApp';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SignInScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseConfigured, setFirebaseConfigured] = useState(!!auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setFirebaseConfigured(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth error:', error);
      setLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!firebaseConfigured) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background px-4 pt-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Firebase Configuration Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Firebase is not configured. Please set up your environment variables.
              </AlertDescription>
            </Alert>
            <div className="text-sm space-y-2">
              <p className="font-medium">Create a `.env.local` file with:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto">
              </pre>
              <p className="text-xs text-muted-foreground mt-3">
                Get these values from your Firebase project settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user) {
    // Redirect to BookList dashboard after successful login
    if (typeof window !== 'undefined') {
      window.location.href = '/BookList';
    }
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Redirecting to dashboard...</p>
      </div>
    );
  }

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4 pt-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">CampusNotes+ Admin Login</CardTitle>
          <CardDescription>Please sign in with your email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            {error && (
              <Alert className="border-destructive bg-destructive/10">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoggingIn}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
