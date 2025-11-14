import React from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  userEmail: string | null;
  onSignOut: () => void;
};

export default function Header({ userEmail, onSignOut }: Props) {
  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">CampusNotes+ Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Logged in as: {userEmail}</p>
          </div>
          <Button variant="outline" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
