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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
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
    } catch (error) {
      const message = axios.isAxiosError<UploadErrorResponse>(error)
        ? error.response?.data?.error || "Failed to upload the document."
        : "Failed to upload the document.";

      setErrorMessage(message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }, [onUpload]);

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
    disabled: loading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          loading
            ? "cursor-not-allowed border-slate-300 bg-slate-50"
            : "cursor-pointer"
        } ${
          !loading && isDragActive
            ? "border-black bg-black/[0.04]"
            : "border-black/15 bg-white hover:border-black/30"
        }`}
      >
        <input {...getInputProps({ disabled: loading })} />

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-black">
            Upload a document
          </h1>
          <p className="text-sm text-black/65">
            Drag and drop a PDF, DOCX, or TXT file here, or click to browse.
          </p>
        </div>

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-700">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            <span>Uploading...</span>
          </div>
        )}

        {status === "success" && !loading && (
          <p className="mt-4 text-sm font-medium text-green-700">
            Document uploaded successfully.
          </p>
        )}

        {status === "error" && !loading && (
          <p className="mt-4 text-sm font-medium text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
