import { cn, computeFileSize } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Loader, UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import ResultCard from "./ResultCard";

type APIResponse = {
  payload: string;
  filename: string;
  pages: string;
};

export default function Dropzone(props: React.HTMLAttributes<HTMLDivElement>) {
  const FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB
  const [file, setFile] = useState<File | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [payload, setPayload] = useState<APIResponse | null>(null);
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
      const response = await fetch(
        "http://localhost:8000/v1/extract-pdf-content",
        {
          method: "POST",
          body: formData,
        },
      );
      const result = await response.json();

      setPayload(result as APIResponse);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
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
        <div className="text-center">
          <UploadIcon className="w-8 h-8 text-gray-400 inline-block" />
          <p className="text-gray-500">
            Select or drag and drop your files here
          </p>
          <p className="text-xs text-gray-400">(PDF files up to 5MB)</p>
        </div>

        {internalError && (
          <p className="text-xs text-red-500 mt-2">{internalError}</p>
        )}
      </div>
    );
  };

  // initial render
  if (!payload) {
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
      renderDropZone()
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3">
        <p>{payload["payload"]}</p>
        {/* <ResultCard title={title} thumbUrl={thumb_url} url={url} /> */}
      </div>
      <Button onClick={() => setPayload(null)}>Clear</Button>
    </div>
  );
}

function FileCard({
  file,
  setFile: setFiles,
  isUploading,
  handleUpload,
  setUploadError,
}: {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
  isUploading: boolean;
  handleUpload: (file: File) => void;
}) {
  const removeFile = () => {
    setUploadError(null);
    setFiles(null);
  };

  return (
    <div className="mx-auto max-w-[700px] flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 shadow">
      <div className="flex items-center gap-2">
        <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center p-5">
          <span className="text-xs font-lg">
            {file.name.split(".").pop()?.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col items-start space-y-1">
          <p className="text-sm font-medium truncate max-w-xs sm:max-w-[30rem]">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{computeFileSize(file)}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={() => handleUpload(file)}
          className="cursor-pointer"
          disabled={isUploading}
        >
          {isUploading && <Loader className="animate-spin" />}
          {isUploading ? "Uploading" : "Upload"}
        </Button>

        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={() => removeFile()}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
