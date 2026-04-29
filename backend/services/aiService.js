const OpenAI = require("openai");

const { evaluateOffer } = require("./offerRiskEngine");

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("Missing OPENAI_API_KEY environment variable.");
    error.statusCode = 500;
    throw error;
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function stripMarkdownCodeFences(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseJsonResponse(text) {
  const cleanedText = stripMarkdownCodeFences(text);

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    const parseError = new Error("AI returned invalid JSON.");
    parseError.statusCode = 502;
    parseError.rawResponse = text;
    throw parseError;
  }
}

async function generateSummary(text) {
  const trimmedText = text.trim();
  const client = getClient();

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: `Summarize the following document in 3-4 concise lines:\n${trimmedText}`,
  });

  return response.output_text.trim();
}

async function analyzeOffer({ fileName, text }) {
  const client = getClient();
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content:
          "You analyze employment offer letters and extract structured terms. Return valid JSON only with no markdown fences, no commentary, and no extra text.",
      },
      {
        role: "user",
        content: `Analyze this employment offer letter and extract structured compensation and employment terms.

File name: ${fileName}

Return valid JSON only in this exact shape:
{
  "offerDetails": {
    "companyName": string | null,
    "role": string | null,
    "totalCompensation": number | null,
    "fixedPay": number | null,
    "variablePay": number | null,
    "joiningBonus": number | null,
    "noticePeriodDays": number | null,
    "bondPresent": boolean | null,
    "probationPeriod": string | null,
    "location": string | null,
    "importantClauses": string[],
    "missingInformation": string[]
  }
}

If a value is not clearly stated, use null.
For arrays, return an empty array if nothing is found.

Offer letter text:
${text}`,
      },
    ],
  });

  const parsedResponse = parseJsonResponse(response.output_text);
  const offerDetails = parsedResponse.offerDetails || {
    companyName: null,
    role: null,
    totalCompensation: null,
    fixedPay: null,
    variablePay: null,
    joiningBonus: null,
    noticePeriodDays: null,
    bondPresent: null,
    probationPeriod: null,
    location: null,
    importantClauses: [],
    missingInformation: [],
  };
  const evaluation = evaluateOffer(offerDetails);

  return {
    offerDetails,
    risks: evaluation.risks,
    score: evaluation.score,
    recommendation: evaluation.recommendation,
  };
}

module.exports = {
  generateSummary,
  analyzeOffer,
};
