import { cn, serverUrl } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { RefreshCw, UploadIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import FileCard from "@/components/FileCard";
import GoogleSearchCard from "./GoogleSearchCard";
import Disclaimer from "./ui/Disclaimer";

type APIResponse = {
  payload: string[];
  filename: string;
  pages: string;
};

export default function Dropzone(props: React.HTMLAttributes<HTMLDivElement>) {
  const FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB
  const [file, setFile] = useState<File | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<APIResponse | null>(null);
  const fetchController = useRef<AbortController>(new AbortController());
  const totalFileSize = file?.size ?? 0;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setInternalError("An error occurred while processing files");
      return;
    }

    if (acceptedFiles.length > 1) {
      setInternalError("You can only upload one file");
      return;
    }

    const acceptedFile = acceptedFiles[0];
    const fileObject = Object.assign(acceptedFile, {
      preview: URL.createObjectURL(acceptedFile),
    });

    setFile(fileObject);
  }, []);

  const handleUpload = async (file: File) => {
    setUploadError("");
    setIsUploading(true);
    if (!file) {
      return;
    }

    if (totalFileSize > FILE_THRESHOLD) {
      setUploadError(
        `File is more than ${(FILE_THRESHOLD / (1024 * 1024)).toFixed(0)}MB`,
      );
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${serverUrl}/extract-pdf-keywords`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      setResult(result as APIResponse);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      fetchController.current = new AbortController();
    }
  };

  const clearAnalysis = () => {
    setResult(null);
    setFile(null);
  };

  const acceptedFiletypes = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  };

  // Setup Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: acceptedFiletypes,
  });

  const renderDropZone = () => {
    return (
      <div
        {...getRootProps()}
        {...props}
        className={cn(
          "grid place-items-center border-8 border-dashed border-gray-200 hover:border-gray-300 rounded-4xl w-[400px] h-[300px] lg:w-[700px] lg:h-[400px] cursor-pointer mx-auto transition-colors",
          isDragActive && "border-green-400",
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center text-gray-400">
          <UploadIcon className="w-8 h-8 inline-block" />
          <p>Select or drag and drop your files here</p>
          <p className="text-xs">(PDF files up to 5MB)</p>
        </div>

        {internalError && (
          <p className="text-xs text-red-500 mt-2">{internalError}</p>
        )}
      </div>
    );
  };

  // initial render
  if (!result) {
    return file ? (
      <div className="space-y-4">
        <FileCard
          file={file}
          setFile={setFile}
          isUploading={isUploading}
          handleUpload={handleUpload}
          setUploadError={setUploadError}
        />

        {uploadError && (
          <p className="text-xs text-red-500 mt-2">{uploadError}</p>
        )}
      </div>
    ) : (
      <div className="space-y-8">
        {renderDropZone()}
        <Disclaimer />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-left">
          Keywords found in <b>{result?.filename}</b>
        </p>
        <div className="space-y-2 lg:space-y-0 grid lg:grid-cols-2 lg:gap-3">
          {result &&
            result.payload.map((keyword, i) => (
              <GoogleSearchCard keyword={keyword} key={i} />
            ))}
        </div>
      </div>
      <Button className="cursor-pointer" onClick={() => clearAnalysis()}>
        <RefreshCw />
        New Analysis
      </Button>
    </div>
  );
}
