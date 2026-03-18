const fs = require("fs/promises");

const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const { getFileExtension } = require("../utils/fileUtils");

async function extractPdfText(filePath) {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const data = await parser.getText();
    return data.text || "";
  } finally {
    await parser.destroy();
  }
}

async function extractDocxText(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || "";
}

async function extractTxtText(filePath) {
  return fs.readFile(filePath, "utf-8");
}

function calculateWordCount(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return 0;
  }

  return trimmedText.split(/\s+/).length;
}

function createTextPreview(text) {
  return text.slice(0, 500);
}

async function extractDocumentText(filePath, extension) {
  switch (extension) {
    case ".pdf":
      return extractPdfText(filePath);
    case ".docx":
      return extractDocxText(filePath);
    case ".txt":
      return extractTxtText(filePath);
    default: {
      const error = new Error("Unsupported file type.");
      error.statusCode = 400;
      throw error;
    }
  }
}

async function parseDocument(file) {
  const filePath = file.path;
  const extension = getFileExtension(file.originalname || filePath);
  const extractedText = await extractDocumentText(filePath, extension);
  const normalizedText = extractedText.replace(/\s+/g, " ").trim();

  return {
    fileName: file.originalname,
    wordCount: calculateWordCount(normalizedText),
    textPreview: createTextPreview(normalizedText),
  };
}

module.exports = {
  parseDocument,
};
