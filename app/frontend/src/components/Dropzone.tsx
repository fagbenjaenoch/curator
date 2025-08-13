import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Loader, Trash2, UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Dropzone(props: React.HTMLAttributes<HTMLDivElement>) {
  const FILE_THRESHOLD = 20 * 1024 * 1024; // 20MB
  const [files, setFiles] = useState<File[]>([]);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  let totalFileSize = 0;
  files.forEach((file) => (totalFileSize = totalFileSize + file.size));

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setInternalError("No valid files were dropped");
      return;
    }

    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setFiles(newFiles);
  }, []);

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    if (files.length === 0) {
      return;
    }

    setUploadError("");
    if (totalFileSize > FILE_THRESHOLD) {
      setUploadError("Files are more than 20MB");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("http://localhost:3000/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Documents that are allowed
  const acceptedFiletypes = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "text/markdown": [".md"],
  };

  // Setup Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: acceptedFiletypes,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const renderDropZone = () => {
    return (
      <div
        {...getRootProps()}
        {...props}
        className={cn(
          "grid place-items-center border-8 border-dashed border-gray-200 hover:border-gray-300 rounded-4xl w-[400px] h-[300px] lg:w-[700px] lg:h-[400px] cursor-pointer mx-auto transition-colors",
          isDragActive && "border-blue-500",
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <UploadIcon className="w-8 h-8 text-gray-400 inline-block" />
          <p className="text-gray-500">
            Select or drag and drop your files here
          </p>
          <p className="text-xs text-gray-400">
            (PDF, DOC, DOCX, MD up to 20MB)
          </p>
        </div>

        {internalError && (
          <p className="text-xs text-red-500 mt-2">{internalError}</p>
        )}
      </div>
    );
  };

  return files.length === 0 ? (
    renderDropZone()
  ) : (
    <div className="space-y-4">
      <FileList files={files} setFiles={setFiles} />
      <Button
        onClick={() => handleUpload(files)}
        className="cursor-pointer"
        disabled={isUploading}
      >
        {isUploading && <Loader className="animate-spin" />}
        {isUploading ? "Uploading" : "Upload"}
      </Button>
      {uploadError && (
        <p className="text-xs text-red-500 mt-2">{uploadError}</p>
      )}
    </div>
  );
}

function FileList({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const removeFile = (file: File) => {
    const newFiles = files.filter((f) => f !== file);
    setFiles(newFiles);
  };

  const computeFileSize = (file: File) => {
    switch (true) {
      case file.size < 1024: // Less than 1KB
        return `${file.size.toFixed(2)} B`;
      case file.size < 1024 * 1024: // Less than 1MB
        return `${(file.size / 1024).toFixed(2)} KB`;
      case file.size < 1024 * 1024 * 1024: // Less than 1GB
        return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      default:
        return `${(file.size / 1024).toFixed(2)} KB`;
    }
  };

  return (
    <div className="space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 shadow"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center p-5">
              <span className="text-xs font-medium">
                {file.name.split(".").pop()?.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col items-start space-y-1">
              <p className="text-sm font-medium truncate max-w-[15rem] sm:max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{computeFileSize(file)}</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => removeFile(file)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
