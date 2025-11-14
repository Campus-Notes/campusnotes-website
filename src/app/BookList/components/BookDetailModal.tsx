import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Note = any;

type Props = {
  selectedNote: Note | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onVerify: (id: string) => void;
  verifying: boolean;
  deleting: boolean;
  isSameOwnerDuplicate: (note: Note) => boolean;
  onViewPdf?: (note: Note) => void;
  onDownloadPdf?: (note: Note) => void;
};

export default function BookDetailModal({ selectedNote, onClose, onDelete, onVerify, verifying, deleting, isSameOwnerDuplicate, onViewPdf, onDownloadPdf }: Props) {
  if (!selectedNote) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex justify-between items-start">
          <div>
            <CardTitle>{selectedNote.title || 'Untitled'}</CardTitle>
            <CardDescription>{selectedNote.author || 'Unknown Author'}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedNote.isCopyrighted && (
            <Alert className="bg-red-500/20 border-red-500">
              <AlertDescription className="text-sm text-red-700 dark:text-red-400">
                <strong>⚠️ Copyright Violation</strong>
                <br />
                {selectedNote.copyrightReason}
                <br />
                <span className="text-xs mt-2 block">This document cannot be verified and should be removed or the original uploader should be contacted.</span>
              </AlertDescription>
            </Alert>
          )}
          {isSameOwnerDuplicate(selectedNote) && !selectedNote.isCopyrighted && (
            <Alert className="bg-orange-500/10 border-orange-500/30">
              <AlertDescription className="text-sm text-orange-700 dark:text-orange-400">
                <strong>🔄 Duplicate Upload</strong>
                <br />
                You have already uploaded this document. You can delete this duplicate.
              </AlertDescription>
            </Alert>
          )}
          <div>
            <p className="font-semibold text-sm mb-1">Subject:</p>
            <p className="text-sm">{selectedNote.subject || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-1">Description:</p>
            <p className="text-sm whitespace-pre-wrap">{selectedNote.description || 'No description'}</p>
          </div>
          {selectedNote.category && (
            <div>
              <p className="font-semibold text-sm mb-1">Category:</p>
              <p className="text-sm">{selectedNote.category}</p>
            </div>
          )}
          {selectedNote.tags && (
            <div>
              <p className="font-semibold text-sm mb-2">Tags:</p>
              <div className="flex gap-2 flex-wrap">
                {selectedNote.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}
          {selectedNote.verified && selectedNote.verifiedAt && selectedNote.verifiedBy && (
            <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
              <p className="text-xs text-green-700 dark:text-green-400">✓ Verified by {selectedNote.verifiedBy} on {new Date(selectedNote.verifiedAt).toLocaleDateString()}</p>
            </div>
          )}
          {selectedNote.fileContent && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
              <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">📄 PDF file attached</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onViewPdf && onViewPdf(selectedNote)} className="flex-1">View PDF</Button>
                <Button size="sm" variant="outline" onClick={() => onDownloadPdf && onDownloadPdf(selectedNote)} className="flex-1">Download PDF</Button>
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
            {isSameOwnerDuplicate(selectedNote) && !selectedNote.isCopyrighted && (
              <Button variant="destructive" className="flex-1" onClick={() => onDelete(selectedNote.id)} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Duplicate'}</Button>
            )}
            {selectedNote.isCopyrighted && (
              <Button variant="destructive" className="flex-1" onClick={() => onDelete(selectedNote.id)} disabled={deleting}>{deleting ? 'Deleting...' : 'Remove Copyright Violation'}</Button>
            )}
            {!selectedNote.verified && !selectedNote.isCopyrighted && !isSameOwnerDuplicate(selectedNote) && (
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => onVerify(selectedNote.id)} disabled={verifying}>{verifying ? 'Verifying...' : 'Verify This Note'}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
