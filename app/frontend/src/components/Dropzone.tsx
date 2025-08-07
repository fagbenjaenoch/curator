import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "lucide-react";

export default function Dropzone(props: React.HTMLAttributes<HTMLDivElement>) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFile) => {
      console.log(acceptedFile);
    },
    accept: {
      // Documents that are allowed
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/markdown": [".md"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

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
      {isDragActive ? (
        <p>Drop the file here!</p>
      ) : (
        <div className="text-center">
          <UploadIcon className="w-8 h-8 text-gray-400 inline-block" />
          <p className="text-gray-500">
            Select or drag and drop your files here
          </p>
          <p className="text-xs text-gray-400">
            (PDF, DOC, DOCX, MD up to 20MB)
          </p>
        </div>
      )}
    </div>
  );
}
