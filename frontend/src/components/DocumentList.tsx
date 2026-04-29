"use client";

import type {
  OfferAnalysis,
  OfferDetails,
  OfferRisk,
  UploadedOfferDocument,
} from "../types/offer";

type DocumentListProps = {
  documents: UploadedOfferDocument[];
  selectedDocument: UploadedOfferDocument | null;
  onSelect: (document: UploadedOfferDocument) => void;
  onDelete: (document: UploadedOfferDocument) => void;
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

  function formatMoney(value: number | null) {
    if (value === null) {
      return "Not specified";
    }

    return value.toLocaleString();
  }

  function formatNoticePeriod(days: number | null) {
    if (days === null) {
      return "Not specified";
    }

    return `${days} days`;
  }

  function formatBondStatus(bondPresent: boolean | null) {
    if (bondPresent === null) {
      return "Not specified";
    }

    return bondPresent ? "Present" : "Not present";
  }

  function getScoreLabel(score: number) {
    if (score >= 8) {
      return "Strong";
    }

    if (score >= 5) {
      return "Needs Review";
    }

    return "High Risk";
  }

  function getScoreClasses(score: number) {
    if (score >= 8) {
      return "bg-green-100 text-green-700";
    }

    if (score >= 5) {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-red-100 text-red-700";
  }

  function getSeverityClasses(severity: OfferRisk["severity"]) {
    if (severity === "high") {
      return "bg-red-100 text-red-700";
    }

    if (severity === "medium") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-green-100 text-green-700";
  }

  function renderInfoRow(label: string, value: string | null) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-900">
          {value || "Not specified"}
        </p>
      </div>
    );
  }

  function renderListSection(title: string, items: string[]) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 shadow-sm">
        <p className="font-semibold text-slate-900">{title}</p>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Nothing highlighted.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {items.map((item, index) => (
              <li key={`${title}-${index}`} className="rounded-lg bg-white p-3">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  function renderOfferOverview(offerDetails: OfferDetails) {
    return (
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-slate-900">
          Offer Overview
        </h4>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {renderInfoRow("Company", offerDetails.companyName)}
          {renderInfoRow("Role", offerDetails.role)}
          {renderInfoRow("Location", offerDetails.location)}
          {renderInfoRow(
            "Notice Period",
            formatNoticePeriod(offerDetails.noticePeriodDays)
          )}
          {renderInfoRow("Bond Status", formatBondStatus(offerDetails.bondPresent))}
          {renderInfoRow("Probation Period", offerDetails.probationPeriod)}
        </div>
      </div>
    );
  }

  function renderCompensationBreakdown(offerDetails: OfferDetails) {
    return (
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-slate-900">
          Compensation Breakdown
        </h4>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {renderInfoRow(
            "Total Compensation",
            formatMoney(offerDetails.totalCompensation)
          )}
          {renderInfoRow("Fixed Pay", formatMoney(offerDetails.fixedPay))}
          {renderInfoRow("Variable Pay", formatMoney(offerDetails.variablePay))}
          {renderInfoRow("Joining Bonus", formatMoney(offerDetails.joiningBonus))}
        </div>
      </div>
    );
  }

  function renderAnalysisSections(analysis: OfferAnalysis) {
    return (
      <div className="space-y-6">
        {renderOfferOverview(analysis.offerDetails)}
        {renderCompensationBreakdown(analysis.offerDetails)}

        <div className="space-y-4">
          <h4 className="text-base font-semibold text-slate-900">
            Overall Score
          </h4>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-2xl font-bold text-slate-900">
                {analysis.score}/10
              </p>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getScoreClasses(
                  analysis.score
                )}`}
              >
                {getScoreLabel(analysis.score)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-semibold text-slate-900">Risk Flags</h4>
          {analysis.risks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-green-200 bg-green-50 p-5 text-sm text-green-700">
              No immediate rule-based risk flags were found in this offer.
            </div>
          ) : (
            <div className="space-y-3">
              {analysis.risks.map((risk, index) => (
                <div
                  key={`${risk.title}-${index}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {risk.title}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase ${getSeverityClasses(
                        risk.severity
                      )}`}
                    >
                      {risk.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {risk.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 shadow-sm">
          <p className="font-semibold text-slate-900">Recommendation</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            {analysis.recommendation}
          </p>
        </div>

        {renderListSection(
          "Missing Information",
          analysis.offerDetails.missingInformation
        )}
        {renderListSection(
          "Important Clauses",
          analysis.offerDetails.importantClauses
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-base font-medium text-slate-500">
            No offer letters uploaded yet
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Upload your first offer letter to get started
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
                    <p
                      className={`mt-1 text-xs ${
                        isSelected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      Offer Letter
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
            Offer Details
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
            {selectedDocument.analysis ? (
              renderAnalysisSections(selectedDocument.analysis)
            ) : (
              <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 p-4">
                <p className="font-semibold text-amber-800">
                  Offer analysis is unavailable
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-700">
                  {selectedDocument.analysisError ||
                    "Offer analysis could not be generated for this upload."}
                </p>
              </div>
            )}

            <div>
              <p className="font-semibold text-slate-900">Document Preview</p>
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
