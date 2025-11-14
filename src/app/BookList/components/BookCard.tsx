import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Note = any;

type Props = {
  note: Note;
  isDupe: boolean;
  isSameOwner: boolean;
  originalNote?: Note;
  verifying: boolean;
  onSelect: (note: Note) => void;
  onViewPdf: (note: Note) => void;
  onVerify: (id: string) => void;
};

export default function BookCard({ note, isDupe, isSameOwner, originalNote, verifying, onSelect, onViewPdf, onVerify }: Props) {
  return (
    <Card
      key={note.id}
      className={`cursor-pointer transition-all hover:shadow-lg ${
        note.isCopyrighted
          ? 'border-red-500 bg-red-500/10'
          : isSameOwner
          ? 'border-orange-500/50 bg-orange-500/5'
          : note.verified
          ? 'border-blue-500/50'
          : 'border-yellow-500/50'
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{note.title || 'Untitled'}</CardTitle>
            <CardDescription>
              {note.author || 'Unknown Author'}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            {note.isCopyrighted ? (
              <div className="text-xs font-semibold px-2 py-1 rounded bg-red-500 text-white">
                © Copyright Issue
              </div>
            ) : note.verified ? (
              <div className="text-xs font-semibold px-2 py-1 rounded text-green-700 dark:text-green-400">✓ Verified</div>
            ) : (
              <div className="text-xs font-semibold px-2 py-1 rounded text-red-500 dark:text-yellow-400">Pending</div>
            )}
            {isSameOwner && !note.isCopyrighted && (
              <div className="text-xs font-semibold px-2 py-1 rounded bg-orange-500/20 text-orange-700 dark:text-orange-400">🔄 Duplicate</div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Subject:</p>
          <p className="text-sm font-medium">{note.subject || 'N/A'}</p>
        </div>
        {note.description && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Description:</p>
            <p className="text-sm line-clamp-3">{note.description}</p>
          </div>
        )}
        {note.isCopyrighted && (
          <Alert className="bg-red-500/20 border-red-500">
            <AlertDescription className="text-xs text-red-700 dark:text-red-400">{note.copyrightReason}</AlertDescription>
          </Alert>
        )}
        {isSameOwner && !note.isCopyrighted && originalNote && (
          <Alert className="bg-orange-500/10 border-orange-500/30">
            <AlertDescription className="text-xs text-orange-700 dark:text-orange-400">Duplicate of your own upload: "{originalNote.title || 'Untitled'}"</AlertDescription>
          </Alert>
        )}
        <div className="flex gap-2 pt-4">
          <Button size="sm" variant="outline" onClick={() => onSelect(note)} className="flex-1">View Details</Button>
          {note.fileContent && (
            <Button size="sm" variant="outline" onClick={() => onViewPdf(note)} className="flex-1">View PDF</Button>
          )}
          {!note.verified && !note.isCopyrighted && (
            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => onVerify(note.id)} disabled={verifying}>
              {verifying ? 'Verifying...' : 'Verify'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
