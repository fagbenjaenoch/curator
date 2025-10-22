import { computeFileSize } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FileCard({
  file,
  setFile: setFiles,
  isUploading,
  handleUpload,
  setUploadError,
  uploadController,
}: {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
  isUploading: boolean;
  handleUpload: (file: File) => void;
  uploadController?: AbortController;
}) {
  const removeFile = () => {
    setUploadError(null);
    setFiles(null);
    uploadController && uploadController.abort();
  };

  return (
    <div className="mx-auto max-w-[700px] flex flex-col gap-4 self-end md:flex-row md:items-center md:justify-between p-3 bg-white rounded-md border border-gray-200 shadow">
      <div className="flex items-center gap-2">
        <div className="w-16 h-16 bg-gray-300 rounded self-start flex items-center justify-center p-5">
          <span className="text-xs font-lg">
            {file.name.split(".").pop()?.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col items-start space-y-1">
          <p className="text-sm text-left max-w-xs sm:max-w-[25rem] wrap-break-word">
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
