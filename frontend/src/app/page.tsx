"use client";

import { useEffect, useState } from "react";

import DocumentList from "../components/DocumentList";
import DocumentUpload from "../components/DocumentUpload";

type UploadedDocument = {
  fileName: string;
  wordCount: number;
  textPreview: string;
  uploadedAt: string;
};

export default function Home() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<UploadedDocument | null>(null);

  useEffect(() => {
    if (documents.length === 0) {
      setSelectedDocument(null);
    }
  }, [documents]);

  function handleUpload(
    document: Omit<UploadedDocument, "uploadedAt">
  ) {
    const documentWithTimestamp = {
      ...document,
      uploadedAt: new Date().toISOString(),
    };

    setDocuments((currentDocuments) => [
      documentWithTimestamp,
      ...currentDocuments,
    ]);
    setSelectedDocument(documentWithTimestamp);
  }

  function handleDelete(documentToDelete: UploadedDocument) {
    setDocuments((currentDocuments) =>
      currentDocuments.filter(
        (document) =>
          !(
            document.fileName === documentToDelete.fileName &&
            document.wordCount === documentToDelete.wordCount &&
            document.uploadedAt === documentToDelete.uploadedAt
          )
      )
    );

    setSelectedDocument((currentSelectedDocument) => {
      if (
        currentSelectedDocument &&
        currentSelectedDocument.fileName === documentToDelete.fileName &&
        currentSelectedDocument.wordCount === documentToDelete.wordCount &&
        currentSelectedDocument.uploadedAt === documentToDelete.uploadedAt
      ) {
        return null;
      }

      return currentSelectedDocument;
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              AI Document Review System
            </h1>
            <p className="text-base leading-7 text-slate-600">
              Upload contracts, reports, and text files to extract structured
              content that can be reviewed by the AI analysis engine.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Drag and drop documents for AI review
            </h2>
            <p className="text-sm text-slate-600">
              Supported file types: PDF, DOCX, and TXT.
            </p>
          </div>

          <DocumentUpload onUpload={handleUpload} />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Uploaded Documents
            </h2>
            <p className="text-sm text-slate-600">
              Uploaded files appear here. Click a document to view its parsed
              details.
            </p>
          </div>

          <DocumentList
            documents={documents}
            selectedDocument={selectedDocument}
            onSelect={setSelectedDocument}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </main>
  );
}
