"use client";

type UploadResult = {
  fileName: string;
  wordCount: number;
  textPreview: string;
};

type DocumentListProps = {
  documents: UploadResult[];
  selectedDocument: UploadResult | null;
  onSelect: (document: UploadResult) => void;
};

export default function DocumentList({
  documents,
  selectedDocument,
  onSelect,
}: DocumentListProps) {
  return (
    <div className="space-y-6">
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          No uploaded documents yet.
        </div>
      ) : (
        <div className="grid gap-3">
          {documents.map((document, index) => {
            const isSelected =
              selectedDocument?.fileName === document.fileName &&
              selectedDocument?.wordCount === document.wordCount;

            return (
              <button
                key={`${document.fileName}-${index}`}
                type="button"
                onClick={() => onSelect(document)}
                className={`rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <p className="text-base font-semibold">{document.fileName}</p>
                <p
                  className={`mt-1 text-sm ${
                    isSelected ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {document.wordCount} words
                </p>
              </button>
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
            <div>
              <p className="font-semibold text-slate-900">Text Preview:</p>
              <p className="mt-2 rounded-xl bg-white p-4 leading-7 text-slate-700 shadow-sm">
                {selectedDocument.textPreview || "No preview available."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
