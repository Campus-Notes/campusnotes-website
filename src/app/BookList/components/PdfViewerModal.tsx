import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  viewing: boolean;
  pdfUrl: string | null;
  onClose: () => void;
  onDownload: () => void;
};

export default function PdfViewerModal({ viewing, pdfUrl, onClose, onDownload }: Props) {
  if (!viewing || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex justify-between items-center border-b">
          <CardTitle>PDF Viewer</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </CardHeader>
        <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
          <iframe src={pdfUrl} className="w-full h-full border-none" title="PDF Viewer" />
        </div>
        <div className="border-t p-4 flex gap-2 justify-end">
          <Button variant="outline" className='bg-blue-600 text-white' onClick={onDownload}>Download PDF</Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  );
}
