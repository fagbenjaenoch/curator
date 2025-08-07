import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";

export default function Dropzone(props: React.HTMLAttributes<HTMLDivElement>) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFile) => {
      console.log(acceptedFile);
    },
  });

  return (
    <div
      {...getRootProps()}
      {...props}
      className={cn(
        "grid place-items-center border-8 border-dashed rounded-4xl w-[700px] h-[500px] cursor-pointer mt-8  mx-auto",
        isDragActive && "border-blue-500",
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here!</p>
      ) : (
        <p>Select or Drag and drop your document here to get started</p>
      )}
    </div>
  );
}
