import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Trash2, UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Dropzone(props: React.HTMLAttributes<HTMLDivElement>) {
  const [files, setFiles] = useState<File[]>([]);
  const [internalErrors, setInternalErrors] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setInternalErrors("No valid files were dropped");
      return;
    }

    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setFiles(newFiles);
  }, []);

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

  const removeFile = (file: File) => {
    const newFiles = files.filter((f) => f !== file);
    setFiles(newFiles);
  };

  const renderDropZone = () => {
    return (
      <div
        {...getRootProps()}
        {...props}
        className={cn(
          "grid place-items-center border-8 border-dashed border-gray-200 hover:border-gray-300 rounded-4xl w-[400px] h-[300px] lg:w-[700px] lg:h-[500px] cursor-pointer mt-8 mx-auto transition-colors",
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

        {internalErrors && (
          <p className="text-xs text-red-500 mt-2">{internalErrors}</p>
        )}
      </div>
    );
  };

  const renderFileList = () => {
    return (
      <div className="mt-4 space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 shadow"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center p-5">
                <span className="text-xs font-medium">
                  {file.name.split(".").pop()?.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col items-start space-y-1">
                <p className="text-sm font-medium truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={() => removeFile(file)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {files.length === 0 && renderDropZone()}
      {renderFileList()}
    </>
  );
}
