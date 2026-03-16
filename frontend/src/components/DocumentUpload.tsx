"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type UploadResult = {
  fileName: string;
  wordCount: number;
  textPreview: string;
};

type UploadErrorResponse = {
  error?: string;
};

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
};

export default function DocumentUpload() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedDocument, setUploadedDocument] = useState<UploadResult | null>(
    null
  );

  const handleUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("uploading");
      setErrorMessage("");
      setUploadedDocument(null);

      const response = await axios.post<UploadResult>(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadedDocument(response.data);
      setStatus("success");
    } catch (error) {
      const message = axios.isAxiosError<UploadErrorResponse>(error)
        ? error.response?.data?.error || "Failed to upload the document."
        : "Failed to upload the document.";

      setErrorMessage(message);
      setStatus("error");
    }
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;

      if (!file) {
        return;
      }

      await handleUpload(file);
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED_FILE_TYPES,
  });

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-black bg-black/[0.04]"
            : "border-black/15 bg-white hover:border-black/30"
        }`}
      >
        <input {...getInputProps()} />

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-black">
            Upload a document
          </h1>
          <p className="text-sm text-black/65">
            Drag and drop a PDF, DOCX, or TXT file here, or click to browse.
          </p>
        </div>

        {status === "uploading" && (
          <p className="mt-4 text-sm font-medium text-black">
            Uploading document...
          </p>
        )}

        {status === "success" && (
          <p className="mt-4 text-sm font-medium text-green-700">
            Document uploaded successfully.
          </p>
        )}

        {status === "error" && (
          <p className="mt-4 text-sm font-medium text-red-600">
            {errorMessage}
          </p>
        )}
      </div>

      {uploadedDocument && (
        <div className="w-full rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-black">Parsed Document</h2>

          <div className="mt-4 space-y-3 text-sm text-black/70">
            <p>
              <span className="font-semibold text-black">File Name:</span>{" "}
              {uploadedDocument.fileName}
            </p>
            <p>
              <span className="font-semibold text-black">Word Count:</span>{" "}
              {uploadedDocument.wordCount}
            </p>
            <div>
              <p className="font-semibold text-black">Text Preview:</p>
              <p className="mt-2 rounded-xl bg-black/[0.03] p-4 leading-6 text-black/75">
                {uploadedDocument.textPreview || "No preview available."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
