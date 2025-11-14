import React from 'react';
import BookCard from './BookCard';

type Note = any;

type Props = {
  notes: Note[];
  filteredNotes: Note[];
  isDuplicateNote: (id: string) => boolean;
  isSameOwnerDuplicate: (note: Note) => boolean;
  getOriginalNote: (id: string) => Note | undefined;
  verifying: boolean;
  onSelect: (note: Note) => void;
  onViewPdf: (note: Note) => void;
  onVerify: (id: string) => void;
};

export default function BookGrid({ filteredNotes, isDuplicateNote, isSameOwnerDuplicate, getOriginalNote, verifying, onSelect, onViewPdf, onVerify }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNotes.map((note) => {
        const isDupe = isDuplicateNote(note.id);
        const isSameOwner = isSameOwnerDuplicate(note);
        const originalNote = isDupe ? getOriginalNote(note.id) : undefined;

        return (
          <BookCard
            key={note.id}
            note={note}
            isDupe={isDupe}
            isSameOwner={isSameOwner}
            originalNote={originalNote}
            verifying={verifying}
            onSelect={onSelect}
            onViewPdf={onViewPdf}
            onVerify={onVerify}
          />
        );
      })}
    </div>
  );
}
