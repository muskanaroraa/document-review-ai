import DocumentList from "../components/DocumentList";
import DocumentUpload from "../components/DocumentUpload";

export default function Home() {
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

          <DocumentUpload />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Uploaded Documents
            </h2>
            <p className="text-sm text-slate-600">
              Parsed document summaries will appear here after upload.
            </p>
          </div>

          <DocumentList document={null} />
        </section>
      </div>
    </main>
  );
}
