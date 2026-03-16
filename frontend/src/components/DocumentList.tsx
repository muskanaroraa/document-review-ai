"use client";

type UploadResult = {
  fileName: string;
  wordCount: number;
  textPreview: string;
};

type DocumentListProps = {
  document: UploadResult | null;
};

export default function DocumentList({ document }: DocumentListProps) {
  if (!document) {
    return null;
  }

  return (
    <div className="w-full rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-black">Parsed Document</h2>

      <div className="mt-4 space-y-3 text-sm text-black/70">
        <p>
          <span className="font-semibold text-black">File Name:</span>{" "}
          {document.fileName}
        </p>
        <p>
          <span className="font-semibold text-black">Word Count:</span>{" "}
          {document.wordCount}
        </p>
        <div>
          <p className="font-semibold text-black">Text Preview:</p>
          <p className="mt-2 rounded-xl bg-black/[0.03] p-4 leading-6 text-black/75">
            {document.textPreview || "No preview available."}
          </p>
        </div>
      </div>
    </div>
  );
}
