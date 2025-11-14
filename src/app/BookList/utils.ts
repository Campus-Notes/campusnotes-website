import { DocumentData } from 'firebase/firestore';

export const sanitizeBase64 = (s: string): string => (typeof s === 'string' ? s.replace(/\s+/g, '') : s);

export const base64ToBlob = (base64: string, mime = 'application/pdf'): Blob => {
  const cleaned = sanitizeBase64(base64);
  const byteChars = atob(cleaned);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
};

export const decodeBase64 = (str: string): string => {
  try {
    const cleaned = sanitizeBase64(str);
    return decodeURIComponent(atob(cleaned).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (error) {
    return str;
  }
};

export const isBase64 = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  return /^[A-Za-z0-9+/=\s]+$/.test(str) && str.length % 4 === 0;
};

export const generateHash = async (base64Content: string): Promise<string> => {
  try {
    const cleaned = sanitizeBase64(base64Content);
    const binaryString = atob(cleaned);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error generating hash:', error);
    return '';
  }
};

export const getDecodedContent = (note: DocumentData & { id: string }): DocumentData & { id: string } => {
  const decodedNote: any = { ...note, id: note.id };

  if (!decodedNote.fileContent && decodedNote.fileEncodedData) {
    decodedNote.fileContent = sanitizeBase64(decodedNote.fileEncodedData);
  }

  if (!decodedNote.ownerUid && (note as any).ownerUId) {
    decodedNote.ownerUid = (note as any).ownerUId;
  }

  if (!decodedNote.author && decodedNote.ownerUid) {
    decodedNote.author = decodedNote.ownerUid;
  }

  if ((!decodedNote.title || decodedNote.title === '') && decodedNote.fileName) {
    decodedNote.title = decodedNote.fileName;
  }

  (['title', 'author', 'subject', 'description', 'category'] as const).forEach((k) => {
    const value = decodedNote[k];
    if (value && typeof value === 'string' && isBase64(value)) {
      decodedNote[k] = decodeBase64(value);
    }
  });

  if (decodedNote.tags && Array.isArray(decodedNote.tags)) {
    decodedNote.tags = decodedNote.tags.map((tag: any) => 
      (typeof tag === 'string' && isBase64(tag) ? decodeBase64(tag) : tag)
    );
  }

  return decodedNote;
};
