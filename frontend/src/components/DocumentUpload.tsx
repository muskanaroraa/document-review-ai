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

type DocumentUploadProps = {
  onUpload: (document: UploadResult) => void;
};

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
};

export default function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = useCallback(async (file: File) => {
    if (isUploading) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      setStatus("uploading");
      setErrorMessage("");

      const response = await axios.post<UploadResult>(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpload(response.data);
      setStatus("success");
      await new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });
    } catch (error) {
      const message = axios.isAxiosError<UploadErrorResponse>(error)
        ? error.response?.data?.error || "Failed to upload the document."
        : "Failed to upload the document.";

      setErrorMessage(message);
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  }, [isUploading, onUpload]);

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
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition duration-200 ${
          isUploading
            ? "cursor-not-allowed border-slate-300 bg-slate-50 opacity-50"
            : "cursor-pointer"
        } ${
          !isUploading && isDragActive
            ? "border-black bg-black/[0.04]"
            : "border-black/15 bg-white hover:border-black/30"
        }`}
      >
        <input {...getInputProps({ disabled: isUploading })} />

        {isUploading && (
          <div className="flex min-h-36 flex-col items-center justify-center gap-3">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
            <p className="text-lg font-semibold text-slate-900">
              Uploading document...
            </p>
            <p className="text-sm text-slate-500">
              Please wait while we process your file.
            </p>
          </div>
        )}

        {!isUploading && (
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-black">
              Upload a document
            </h1>
            <p className="text-sm text-black/65">
              Drag and drop a PDF, DOCX, or TXT file here, or click to browse.
            </p>
          </div>
        )}

        {status === "success" && !isUploading && (
          <p className="mt-4 text-sm font-medium text-green-700">
            Document uploaded successfully.
          </p>
        )}
      </div>

      {status === "error" && !isUploading && (
        <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
