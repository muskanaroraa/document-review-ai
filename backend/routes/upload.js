const express = require("express");
const multer = require("multer");
const path = require("path");

const { parseDocument } = require("../services/documentParser");
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

    res.status(200).json(parsedDocument);
  } catch (error) {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      error.statusCode = 400;
      error.message = "File size exceeds the 10MB limit.";
    }

    next(error);
  }
});

module.exports = router;
