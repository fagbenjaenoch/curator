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
      className="grid place-items-center border-2 border-dashed w-[600px] h-[600px] cursor-pointer mt-8  mx-auto"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here!</p>
      ) : (
        <p>
          Drag and Drop some files or click here to select files and get started
        </p>
      )}
    </div>
  );
}
