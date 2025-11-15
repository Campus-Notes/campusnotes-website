'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '../../../firebase/clientApp'; // keep this if your clientApp exports auth
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebase/clientApp'; // ensure clientApp exports firestore (or rename to db)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

export default function SignInScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseConfigured, setFirebaseConfigured] = useState(!!auth && !!firestore);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false); // only redirect when true

  // On mount: listen for auth state changes and verify admin if a user is present
  useEffect(() => {
    if (!auth || !firestore) {
      setFirebaseConfigured(false);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setError('');
      setAdminVerified(false);

      if (!currentUser) {
        // no user signed in
        setLoading(false);
        return;
      }

      // user signed in — verify admin in Firestore
      try {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          // no document -> not admin
          await signOut(auth);
          setUser(null);
          setError('Invalid Credentials — Not admin');
          setLoading(false);
          return;
        }

        const data = snap.data();
        if (data?.isAdmin !== true) {
          await signOut(auth);
          setUser(null);
          setError('Invalid Credentials — Not admin');
          setLoading(false);
          return;
        }

        // admin confirmed
        setAdminVerified(true);
        setLoading(false);
      } catch (err) {
        console.error('Error checking admin status:', err);
        await signOut(auth).catch(() => {});
        setUser(null);
        setError('Login failed. Try again.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // When adminVerified becomes true, redirect
  useEffect(() => {
    if (adminVerified && typeof window !== 'undefined') {
      window.location.href = '/BookList';
    }
  }, [adminVerified]);

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
      setAdminVerified(false);
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

  const handleEmailPasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      // dynamic import to keep bundle small (optional)
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // After sign-in, onAuthStateChanged listener will run and perform the admin check.
      // We just wait a short while for it to complete. If you want synchronous check here,
      // you can fetch Firestore right away (shown below), but using the listener keeps logic centralized.
      // Optionally add a fallback timeout:
      setTimeout(() => {
        setIsLoggingIn(false);
      }, 1500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed. Please try again.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4 pt-16">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-3">
          <Image
            src="/light_logo.png"
            alt="CampusNotes+ Logo"
            width={200}
            height={100}
            className="rounded-full object-cover"
          />
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
            {user && (
              <div className="text-center text-sm mt-2">
                <Button variant="ghost" onClick={handleSignOut}>Sign out</Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
