'use client';

import React, { useEffect, useState, useRef } from 'react';
import { auth, firestore } from '../../../firebase/clientApp';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function BookListPage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(false);
  const [currentPdfNote, setCurrentPdfNote] = useState(null);
  const activeObjectUrl = useRef(null);

  // Utility: sanitize base64 string (remove whitespace/newlines)
  const sanitizeBase64 = (s) => (typeof s === 'string' ? s.replace(/\s+/g, '') : s);

  // convert base64 string -> Blob
  const base64ToBlob = (base64, mime = 'application/pdf') => {
    const cleaned = sanitizeBase64(base64);
    const byteChars = atob(cleaned);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  };

  // create an object URL for the PDF (and revoke previous if exists)
  const createPdfUrl = (base64) => {
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

  // handle viewing pdf
  const handleViewPdf = (note) => {
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

  // handle download (use Blob + object URL for reliable download)
  const handleDownloadPdf = (note) => {
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
      // prefer note.fileName, fallback to title or 'note.pdf'
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

  // decode text-like base64 fields (title/description etc.)
  const decodeBase64 = (str) => {
    try {
      // some text fields might be base64 encoded; attempt a decode, else return original
      const cleaned = sanitizeBase64(str);
      return decodeURIComponent(atob(cleaned).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (error) {
      return str;
    }
  };

  // check if a string looks like base64 (simple heuristic)
  const isBase64 = (str) => {
    if (typeof str !== 'string') return false;
    // basic regex check (allows padding), avoid throwing on invalid input
    return /^[A-Za-z0-9+/=\s]+$/.test(str) && str.length % 4 === 0;
  };

  // Normalize the raw note: map backend names to what the UI expects, decode text fields if base64
  const getDecodedContent = (note) => {
    const decodedNote = { ...note };

    // map backend binary/text fields to UI-friendly keys
    if (!decodedNote.fileContent && decodedNote.fileEncodedData) {
      // fileEncodedData is the backend name in your schema
      decodedNote.fileContent = sanitizeBase64(decodedNote.fileEncodedData);
    }
    if (!decodedNote.fileName && decodedNote.fileName === undefined && decodedNote.fileName !== null) {
      // no-op but keeps parity; actual mapping below handles fileName->title
    }
    // prefer title; if missing but fileName present, use fileName as title
    if ((!decodedNote.title || decodedNote.title === '') && decodedNote.fileName) {
      decodedNote.title = decodedNote.fileName;
    }

    // decode textual fields if they appear to be base64
    ['title', 'author', 'subject', 'description', 'category'].forEach((k) => {
      if (decodedNote[k] && isBase64(decodedNote[k])) {
        decodedNote[k] = decodeBase64(decodedNote[k]);
      }
    });

    if (decodedNote.tags && Array.isArray(decodedNote.tags)) {
      decodedNote.tags = decodedNote.tags.map(tag => (isBase64(tag) ? decodeBase64(tag) : tag));
    }

    return decodedNote;
  };

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
      // revoke any object URL when leaving page
      if (activeObjectUrl.current) {
        URL.revokeObjectURL(activeObjectUrl.current);
        activeObjectUrl.current = null;
      }
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotes = async () => {
    try {
      if (!firestore) {
        console.error('Firestore not initialized');
        setLoading(false);
        return;
      }

      const notesCollection = collection(firestore, 'notes');
      const querySnapshot = await getDocs(notesCollection);
      const notesList = querySnapshot.docs.map((docSnap) => {
        const rawNote = { id: docSnap.id, ...docSnap.data() };

        // Map backend keys to front-end friendly ones before decoding:
        // if backend uses `fileEncodedData` and `fileName`, keep both but also provide UI-friendly aliases
        if (rawNote.fileEncodedData && !rawNote.fileContent) {
          rawNote.fileContent = sanitizeBase64(rawNote.fileEncodedData);
        }
        if (rawNote.fileName && (!rawNote.title || rawNote.title === '')) {
          rawNote.title = rawNote.fileName;
        }

        return getDecodedContent(rawNote);
      });
      setNotes(notesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setLoading(false);
    }
  };

  const handleVerifyNote = async (noteId) => {
    setVerifying(true);
    try {
      const noteRef = doc(firestore, 'notes', noteId);
      await updateDoc(noteRef, {
        verified: true,
        verifiedAt: new Date().toISOString(),
        verifiedBy: user.email,
      });
      setNotes(notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              verified: true,
              verifiedAt: new Date().toISOString(),
              verifiedBy: user.email,
            }
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading notes...</p>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">CampusNotes+ Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Logged in as: {user.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notes Grid */}
        {notes.length === 0 ? (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>No Notes Yet</CardTitle>
              <CardDescription>
                No notes have been submitted for verification yet.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  note.verified ? 'border-green-500/50' : 'border-yellow-500/50'
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
                    <div className="text-xs font-semibold px-2 py-1 rounded">
                      {note.verified ? (
                        <span className="bg-green-500/20 text-green-700 dark:text-green-400">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                          Pending
                        </span>
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
                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedNote(note)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    {note.fileContent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPdf(note)}
                        className="flex-1"
                      >
                        View PDF
                      </Button>
                    )}
                    {!note.verified && (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleVerifyNote(note.id)}
                        disabled={verifying}
                      >
                        {verifying ? 'Verifying...' : 'Verify'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedNote.title || 'Untitled'}</CardTitle>
                <CardDescription>{selectedNote.author || 'Unknown Author'}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNote(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-sm mb-1">Subject:</p>
                <p className="text-sm">{selectedNote.subject || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Description:</p>
                <p className="text-sm whitespace-pre-wrap">
                  {selectedNote.description || 'No description'}
                </p>
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
                    {selectedNote.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedNote.verified && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                  <p className="text-xs text-green-700 dark:text-green-400">
                    ✓ Verified by {selectedNote.verifiedBy} on{' '}
                    {new Date(selectedNote.verifiedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {selectedNote.fileContent && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">
                    📄 PDF file attached
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPdf(selectedNote)}
                      className="flex-1"
                    >
                      View PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPdf(selectedNote)}
                      className="flex-1"
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}
              {!selectedNote.fileContent && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    ⚠️ No PDF file attached
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedNote(null)}
                >
                  Close
                </Button>
                {!selectedNote.verified && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleVerifyNote(selectedNote.id)}
                    disabled={verifying}
                  >
                    {verifying ? 'Verifying...' : 'Verify This Note'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewingPdf && pdfUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="flex justify-between items-center border-b">
              <CardTitle>PDF Viewer</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setViewingPdf(false);
                  setPdfUrl(null);
                  setCurrentPdfNote(null);
                  if (activeObjectUrl.current) {
                    URL.revokeObjectURL(activeObjectUrl.current);
                    activeObjectUrl.current = null;
                  }
                }}
              >
                ✕
              </Button>
            </CardHeader>
            <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-none"
                title="PDF Viewer"
              />
            </div>
            <div className="border-t p-4 flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => handleDownloadPdf(currentPdfNote)}
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setViewingPdf(false);
                  setPdfUrl(null);
                  setCurrentPdfNote(null);
                  if (activeObjectUrl.current) {
                    URL.revokeObjectURL(activeObjectUrl.current);
                    activeObjectUrl.current = null;
                  }
                }}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
