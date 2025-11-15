'use client';

import React, { useEffect, useState, useRef } from 'react';
import { auth, firestore } from '../../../firebase/clientApp';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, getDocs, updateDoc, doc, DocumentData, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import Header from './components/Header';
import BookGrid from './components/BookGrid';
import BookDetailModal from './components/BookDetailModal';
import PdfViewerModal from './components/PdfViewerModal';
import { sanitizeBase64, base64ToBlob, decodeBase64, isBase64, generateHash, getDecodedContent } from './utils';

// Define proper Note interface
interface Note {
  id: string;
  title?: string;
  fileName?: string;
  fileContent?: string;
  fileEncodedData?: string;
  author?: string;
  ownerUid?: string;
  subject?: string;
  description?: string;
  category?: string;
  tags?: string[];
  verified?: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  fileHash?: string;
  isCopyrighted?: boolean;
  copyrightReason?: string;
  createdAt?: string | Date;
}

interface DuplicateInfo {
  originalNoteId: string;
  originalOwnerUid: string;
  duplicateNoteIds: string[];
}

export default function BookListPage() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [viewingPdf, setViewingPdf] = useState<boolean>(false);
  const [currentPdfNote, setCurrentPdfNote] = useState<Note | null>(null);
  const [duplicates, setDuplicates] = useState<Record<string, DuplicateInfo>>({});
  const [showCopyrightsOnly, setShowCopyrightsOnly] = useState<boolean>(false);
  const activeObjectUrl = useRef<string | null>(null);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});

  // helper functions moved to ./utils

  // Detect duplicates and copyright violations by comparing file hashes and owners
  const detectDuplicatesAndCopyright = (notesList: Note[]): Record<string, DuplicateInfo> => {
    const hashMap: Record<string, Note[]> = {};
    const duplicateGroups: Record<string, DuplicateInfo> = {};

    // Group notes by hash
    notesList.forEach(note => {
      if (note.fileHash) {
        if (!hashMap[note.fileHash]) {
          hashMap[note.fileHash] = [];
        }
        hashMap[note.fileHash].push(note);
      }
    });

    // Analyze each group
    Object.entries(hashMap).forEach(([hash, notesWithSameHash]) => {
      if (notesWithSameHash.length > 1) {
        // Sort by creation time to find the original
        const sortedNotes = [...notesWithSameHash].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });

        const original = sortedNotes[0];
        const duplicatesOfOriginal = sortedNotes.slice(1);

        duplicateGroups[hash] = {
          originalNoteId: original.id,
          originalOwnerUid: original.ownerUid || '',
          duplicateNoteIds: duplicatesOfOriginal.map(n => n.id)
        };
      }
    });

    return duplicateGroups;
  };

  // base64ToBlob is in ./utils

  const createPdfUrl = (base64: string): string | null => {
    try {
      if (!base64) return null;
      if (activeObjectUrl.current) {
        URL.revokeObjectURL(activeObjectUrl.current);
        activeObjectUrl.current = null;
      }
      const blob = base64ToBlob(base64, 'application/pdf');
      const url = URL.createObjectURL(blob);
      activeObjectUrl.current = url;
      return url;
    } catch (error) {
      console.error('Error creating PDF URL:', error);
      return null;
    }
  };

  const handleViewPdf = (note: Note): void => {
    const base64 = note.fileContent || note.fileEncodedData;
    if (base64) {
      const url = createPdfUrl(base64);
      if (url) {
        setPdfUrl(url);
        setCurrentPdfNote(note);
        setViewingPdf(true);
      } else {
        alert('Failed to create PDF preview. Try downloading instead.');
      }
    } else {
      alert('No PDF file attached to this note.');
    }
  };

  const handleDownloadPdf = (note: Note): void => {
    const base64 = note.fileContent || note.fileEncodedData;
    if (!base64) {
      alert('No PDF file attached to this note.');
      return;
    }
    try {
      const blob = base64ToBlob(base64, 'application/pdf');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = note.fileName || note.title || 'note';
      link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF.');
    }
  };

  const handleDeleteNote = async (noteId: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this duplicate note? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const noteRef = doc(firestore, 'notes', noteId);
      await deleteDoc(noteRef);

      setNotes(notes.filter(note => note.id !== noteId));
      setSelectedNote(null);
      
      // Recalculate duplicates after deletion
      const updatedNotes = notes.filter(note => note.id !== noteId);
      const newDuplicates = detectDuplicatesAndCopyright(updatedNotes);
      setDuplicates(newDuplicates);

      alert('Note deleted successfully.');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // decoding helpers moved to ./utils

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchNotes();
      } else {
        window.location.href = '/auth';
      }
    });

    return () => {
      if (activeObjectUrl.current) {
        URL.revokeObjectURL(activeObjectUrl.current);
        activeObjectUrl.current = null;
      }
      unsubscribe();
    };
  }, []);

  const fetchNotes = async (): Promise<void> => {
    try {
      if (!firestore) {
        console.error('Firestore not initialized');
        setLoading(false);
        return;
      }

      const notesCollection = collection(firestore, 'notes');
      const notesSnapshot = await getDocs(notesCollection);
      const rawNotes = notesSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as any) })) as any[];

      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersMapTemp: Record<string, string> = {};
      usersSnapshot.docs.forEach(u => {
        const data = u.data() as DocumentData;
        const name = data.firstname || data.firstName || data.first_name || data.name || 'Unknown';
        usersMapTemp[u.id] = name;
      });
      setUsersMap(usersMapTemp);

      const notesList: Note[] = await Promise.all(rawNotes.map(async (rawNote) => {
        if ((rawNote as any).fileEncodedData && !rawNote.fileContent) {
          rawNote.fileContent = sanitizeBase64((rawNote as any).fileEncodedData);
        }
        if (rawNote.fileName && (!rawNote.title || rawNote.title === '')) {
          rawNote.title = rawNote.fileName;
        }

        const decoded = getDecodedContent(rawNote as DocumentData & { id: string });

        // Extract ownerUid
        const ownerUid = (rawNote as any).ownerUid || (rawNote as any).ownerUId;
        decoded.ownerUid = ownerUid;

        // Resolve owner UID to firstname
        if (ownerUid && usersMapTemp[ownerUid]) {
          decoded.author = usersMapTemp[ownerUid];
        }

        // Generate hash if not exists
        if (!decoded.fileHash && decoded.fileContent) {
          decoded.fileHash = await generateHash(decoded.fileContent);

          try {
            const noteRef = doc(firestore, 'notes', decoded.id);
            await updateDoc(noteRef, { fileHash: decoded.fileHash });
          } catch (error) {
            console.error('Error updating hash:', error);
          }
        }

        // Ensure default values exist to avoid undefined checks later
        decoded.isCopyrighted = decoded.isCopyrighted ?? false;
        decoded.verified = decoded.verified ?? false;
        decoded.isVerified = decoded.isVerified ?? decoded.verified ?? false;
        decoded.isDuplicate = decoded.isDuplicate ?? false;
        decoded.duplicateReason = decoded.duplicateReason ?? '';

        return decoded;
      }));

      // Detect duplicates and copyright violations
      const duplicateGroups = detectDuplicatesAndCopyright(notesList);
      setDuplicates(duplicateGroups);

      // --- NEW: Mark duplicates in Firestore (and update local notesList) ---
      for (const [hash, dupInfo] of Object.entries(duplicateGroups)) {
        const originalNote = notesList.find(n => n.id === dupInfo.originalNoteId);
        const originalOwnerName = originalNote?.author || 'Unknown';
        const originalOwnerUid = dupInfo.originalOwnerUid || originalNote?.ownerUid || '';

        // For each duplicate note (not the original) set isDuplicate and duplicateReason
        for (const duplicateId of dupInfo.duplicateNoteIds) {
          const duplicateNote = notesList.find(n => n.id === duplicateId);
          if (!duplicateNote) continue;

          const reason = `Duplicate of note ${dupInfo.originalNoteId} (original uploader: ${originalOwnerName}).`;

          // Update local object
          duplicateNote.isDuplicate = true;
          duplicateNote.duplicateReason = reason;

          // Persist to Firestore
          try {
            const noteRef = doc(firestore, 'notes', duplicateId);
            await updateDoc(noteRef, {
              isDuplicate: true,
              duplicateReason: reason
            });
          } catch (error) {
            console.error(`Error updating duplicate flags for ${duplicateId}:`, error);
          }
        }

        // Ensure the original note is marked as not duplicate (explicitly)
        if (originalNote) {
          originalNote.isDuplicate = false;
          originalNote.duplicateReason = originalNote.duplicateReason ?? '';

          try {
            const originalRef = doc(firestore, 'notes', originalNote.id);
            await updateDoc(originalRef, {
              isDuplicate: false,
              // do not override duplicateReason if it exists and is meaningful
              duplicateReason: originalNote.duplicateReason || ''
            });
          } catch (error) {
            console.error(`Error ensuring original note ${originalNote.id} is not flagged as duplicate:`, error);
          }
        }

        // Additionally mark copyright violations for duplicates that belong to different owners
        for (const duplicateId of dupInfo.duplicateNoteIds) {
          const duplicateNote = notesList.find(n => n.id === duplicateId);
          if (duplicateNote && duplicateNote.ownerUid !== originalOwnerUid) {
            duplicateNote.isCopyrighted = true;
            duplicateNote.copyrightReason = `Detected copyright issue – this file already exists and was originally uploaded by ${originalOwnerName}.`;

            // Update Firestore (keep previous updates and add copyright fields)
            try {
              const noteRef = doc(firestore, 'notes', duplicateId);
              await updateDoc(noteRef, {
                isCopyrighted: true,
                copyrightReason: duplicateNote.copyrightReason,
                verified: false,
                isVerified: false
              });
            } catch (error) {
              console.error(`Error marking copyright for ${duplicateId}:`, error);
            }
          }
        }
      }

      // If there are notes that are not part of any duplicate group, ensure they have isDuplicate:false in local list
      const duplicateIds = new Set<string>();
      Object.values(duplicateGroups).forEach(g => g.duplicateNoteIds.forEach(id => duplicateIds.add(id)));
      notesList.forEach(n => {
        if (!duplicateIds.has(n.id)) {
          n.isDuplicate = false;
          // leave duplicateReason as-is (or clear if you prefer)
        }
      });

      setNotes(notesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setLoading(false);
    }
  };


  const handleVerifyNote = async (noteId: string): Promise<void> => {
    if (!user) return;

    const note = notes.find(n => n.id === noteId);
    if (note?.isCopyrighted) {
      alert('Cannot verify copyrighted content. This file was uploaded by another user first.');
      return;
    }

    setVerifying(true);
    try {
      const noteRef = doc(firestore, 'notes', noteId);
      const verifiedAt = new Date().toISOString();
      const verifiedBy = user.email || user.uid || 'admin';

      await updateDoc(noteRef, {
        isVerified: true,
        verified: true,
        verifiedAt,
        verifiedBy,
      });

      setNotes(notes.map((note) =>
        note.id === noteId
          ? { ...note, isVerified: true, verified: true, verifiedAt, verifiedBy }
          : note
      ));

      setSelectedNote(null);
    } catch (error) {
      console.error('Error verifying note:', error);
      alert('Failed to verify note. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getOriginalNote = (noteId: string): Note | undefined => {
    for (const dupInfo of Object.values(duplicates)) {
      if (dupInfo.duplicateNoteIds.includes(noteId)) {
        return notes.find(n => n.id === dupInfo.originalNoteId);
      }
    }
    return undefined;
  };

  const isDuplicateNote = (noteId: string): boolean => {
    return Object.values(duplicates).some(dupInfo => dupInfo.duplicateNoteIds.includes(noteId));
  };

  const isSameOwnerDuplicate = (note: Note): boolean => {
    if (!isDuplicateNote(note.id)) return false;
    
    for (const dupInfo of Object.values(duplicates)) {
      if (dupInfo.duplicateNoteIds.includes(note.id)) {
        return note.ownerUid === dupInfo.originalOwnerUid;
      }
    }
    return false;
  };

  const filteredNotes = showCopyrightsOnly
    ? notes.filter(note => note.isCopyrighted)
    : notes;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading notes and checking for copyright violations...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }

  const copyrightCount = notes.filter(n => n.isCopyrighted).length;

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={user.email} onSignOut={handleSignOut} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Copyright Detection Alert */}
        {copyrightCount > 0 && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <AlertDescription className="flex items-center justify-between">
              <span className="text-red-700 dark:text-red-400">
                ⚠️ {copyrightCount} copyright violation{copyrightCount > 1 ? 's' : ''} detected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCopyrightsOnly(!showCopyrightsOnly)}
              >
                {showCopyrightsOnly ? 'Show All' : 'Show Copyrights Only'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>No Notes {showCopyrightsOnly ? 'Match Filter' : 'Yet'}</CardTitle>
              <CardDescription>
                {showCopyrightsOnly 
                  ? 'No copyright violations found.'
                  : 'No notes have been submitted for verification yet.'}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <BookGrid
            notes={notes}
            filteredNotes={filteredNotes}
            isDuplicateNote={isDuplicateNote}
            isSameOwnerDuplicate={isSameOwnerDuplicate}
            getOriginalNote={getOriginalNote}
            verifying={verifying}
            onSelect={(note) => setSelectedNote(note)}
            onViewPdf={handleViewPdf}
            onVerify={handleVerifyNote}
          />
        )}
      </div>

      {/* Detail Modal */}
      <BookDetailModal
        selectedNote={selectedNote}
        onClose={() => setSelectedNote(null)}
        onDelete={handleDeleteNote}
        onVerify={handleVerifyNote}
        verifying={verifying}
        deleting={deleting}
        isSameOwnerDuplicate={isSameOwnerDuplicate}
        onViewPdf={handleViewPdf}
        onDownloadPdf={handleDownloadPdf}
      />

      <PdfViewerModal viewing={viewingPdf} pdfUrl={pdfUrl} onClose={() => { setViewingPdf(false); setPdfUrl(null); setCurrentPdfNote(null); if (activeObjectUrl.current) { URL.revokeObjectURL(activeObjectUrl.current); activeObjectUrl.current = null; } }} onDownload={() => currentPdfNote && handleDownloadPdf(currentPdfNote)} />
    </div>
  );
}