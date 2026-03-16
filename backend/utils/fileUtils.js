const fs = require("fs");
const path = require("path");

const allowedExtensions = [".pdf", ".docx", ".txt"];
const maxFileSizeInBytes = 10 * 1024 * 1024;
const uploadsDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

function getFileExtension(fileName) {
  return path.extname(fileName).toLowerCase();
}

function validateFileType(file) {
  const extension = getFileExtension(file.originalname || file.filename || "");

  if (!allowedExtensions.includes(extension)) {
    const error = new Error("Only PDF, DOCX, and TXT files are allowed.");
    error.statusCode = 400;
    throw error;
  }
}

function validateFileSize() {
  return maxFileSizeInBytes;
}

function validateFile(file) {
  if (!file) {
    const error = new Error("Please upload a file.");
    error.statusCode = 400;
    throw error;
  }

  validateFileType(file);
}

module.exports = {
  allowedExtensions,
  maxFileSizeInBytes,
  uploadsDirectory,
  getFileExtension,
  validateFile,
  validateFileType,
  validateFileSize,
};
