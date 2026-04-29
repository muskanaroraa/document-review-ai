"use client";

import { useEffect, useState } from "react";

import DocumentList from "../components/DocumentList";
import DocumentUpload from "../components/DocumentUpload";
import type { UploadedOfferDocument } from "../types/offer";

export default function Home() {
  const [documents, setDocuments] = useState<UploadedOfferDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<UploadedOfferDocument | null>(null);

  useEffect(() => {
    if (documents.length === 0) {
      setSelectedDocument(null);
    }
  }, [documents]);

  function handleUpload(
    document: Omit<UploadedOfferDocument, "uploadedAt">
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

  function handleDelete(documentToDelete: UploadedOfferDocument) {
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
              Offer Intelligence
            </h1>
            <p className="text-base leading-7 text-slate-600">
              Upload your offer letter and understand compensation, key terms,
              risk areas, and negotiation points from an initial AI-assisted
              review.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Upload your offer letter
            </h2>
            <p className="text-sm text-slate-600">
              Supported file types: PDF, DOCX, and TXT. Best used for
              employment offer letters and compensation documents.
            </p>
          </div>

          <DocumentUpload onUpload={handleUpload} />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Uploaded Offer Letters
            </h2>
            <p className="text-sm text-slate-600">
              Uploaded files appear here. Click an offer letter to review its
              parsed details and initial insight.
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
