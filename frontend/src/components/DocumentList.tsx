"use client";

type UploadResult = {
  fileName: string;
  wordCount: number;
  textPreview: string;
  uploadedAt: string;
};

type DocumentListProps = {
  documents: UploadResult[];
  selectedDocument: UploadResult | null;
  onSelect: (document: UploadResult) => void;
  onDelete: (document: UploadResult) => void;
};

export default function DocumentList({
  documents,
  selectedDocument,
  onSelect,
  onDelete,
}: DocumentListProps) {
  function formatUploadedTime(uploadedAt: string) {
    const uploadedDate = new Date(uploadedAt);
    const now = new Date();
    const diffInMinutes = Math.max(
      0,
      Math.floor((now.getTime() - uploadedDate.getTime()) / 60000)
    );

    if (diffInMinutes < 1) {
      return "Uploaded just now";
    }

    if (diffInMinutes === 1) {
      return "Uploaded 1 min ago";
    }

    if (diffInMinutes < 60) {
      return `Uploaded ${diffInMinutes} mins ago`;
    }

    return `Uploaded ${uploadedDate.toLocaleString()}`;
  }

  function getAiSummary(textPreview: string) {
    const sentences = textPreview
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    if (sentences.length === 0) {
      return "No summary available for this document yet.";
    }

    const summary = sentences.slice(0, 3).join(" ");
    return summary.length > 220 ? `${summary.slice(0, 217)}...` : summary;
  }

  return (
    <div className="space-y-6">
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-base font-medium text-slate-500">
            No documents uploaded yet
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Upload your first document to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((document, index) => {
            const isSelected =
              selectedDocument?.fileName === document.fileName &&
              selectedDocument?.wordCount === document.wordCount &&
              selectedDocument?.uploadedAt === document.uploadedAt;

            return (
              <div
                key={`${document.fileName}-${index}`}
                className={`w-full cursor-pointer rounded-2xl border p-4 text-left shadow-sm transition duration-200 ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={() => onSelect(document)}
                      className="cursor-pointer text-left text-inherit"
                    >
                      <p className="text-base font-semibold">
                        {document.fileName}
                      </p>
                    </button>
                    <p
                      className={`mt-1 text-sm ${
                        isSelected ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {document.wordCount} words
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <p
                      className={`text-sm ${
                        isSelected ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {formatUploadedTime(document.uploadedAt)}
                    </p>
                    <button
                      type="button"
                      onClick={() => onDelete(document)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        isSelected
                          ? "bg-white/10 text-white hover:bg-red-500/25"
                          : "text-red-600 hover:bg-red-50 hover:text-red-700"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDocument && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Document Details
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">File Name:</span>{" "}
              {selectedDocument.fileName}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Word Count:</span>{" "}
              {selectedDocument.wordCount}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Uploaded:</span>{" "}
              {new Date(selectedDocument.uploadedAt).toLocaleString()}
            </p>
            <div>
              <p className="font-semibold text-slate-900">Text Preview:</p>
              <p className="mt-2 rounded-xl bg-white p-4 leading-7 text-slate-700 shadow-sm">
                {selectedDocument.textPreview || "No preview available."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 shadow-sm">
              <p className="font-semibold text-slate-900">AI Summary</p>
              <p className="mt-2 line-clamp-3 leading-7 text-slate-700">
                {getAiSummary(selectedDocument.textPreview)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
