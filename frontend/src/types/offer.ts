export type OfferDetails = {
  companyName: string | null;
  role: string | null;
  totalCompensation: number | null;
  fixedPay: number | null;
  variablePay: number | null;
  joiningBonus: number | null;
  noticePeriodDays: number | null;
  bondPresent: boolean | null;
  probationPeriod: string | null;
  location: string | null;
  importantClauses: string[];
  missingInformation: string[];
};

export type OfferRisk = {
  title: string;
  severity: "low" | "medium" | "high";
  explanation: string;
};

export type OfferAnalysis = {
  offerDetails: OfferDetails;
  risks: OfferRisk[];
  score: number;
  recommendation: string;
};

export type UploadedOfferDocument = {
  fileName: string;
  wordCount: number;
  type: string;
  textPreview: string;
  uploadedAt: string;
  analysis: OfferAnalysis | null;
  analysisError: string | null;
};
