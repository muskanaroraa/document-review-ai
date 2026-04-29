const express = require("express");
const multer = require("multer");
const path = require("path");

const { analyzeOffer } = require("../services/aiService");
const { parseDocument } = require("../services/documentParser");
const { detectDocumentType } = require("../utils/detectDocumentType");
const {
  validateFile,
  validateFileType,
  validateFileSize,
  uploadsDirectory,
} = require("../utils/fileUtils");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${uniqueSuffix}${path.extname(sanitizedName)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: validateFileSize() },
  fileFilter: (req, file, cb) => {
    try {
      validateFileType(file);
      cb(null, true);
    } catch (error) {
      cb(error);
    }
  },
});

router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    validateFile(req.file);

    const parsedDocument = await parseDocument(req.file);
    const documentType = detectDocumentType(parsedDocument.text);
    let analysis = null;
    let analysisError = null;

    try {
      analysis = await analyzeOffer({
        fileName: parsedDocument.fileName,
        text: parsedDocument.text,
      });
    } catch (analysisRequestError) {
      analysisError = "Offer analysis is currently unavailable.";
      console.error("Offer analysis failed during upload:", analysisRequestError.message);
    }

    res.status(200).json({
      fileName: parsedDocument.fileName,
      wordCount: parsedDocument.wordCount,
      type: documentType,
      // Keep the browser response UI-safe and avoid exposing the full offer text.
      textPreview: parsedDocument.textPreview,
      analysis,
      analysisError,
    });
  } catch (error) {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      error.statusCode = 400;
      error.message = "File size exceeds the 10MB limit.";
    }

    next(error);
  }
});

module.exports = router;
