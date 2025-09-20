import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Loader, Trash2, UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import ResultCard from "./ResultCard";
export default function Dropzone(props) {
    const FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB
    const [files, setFiles] = useState([]);
    const [internalError, setInternalError] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [data, setData] = useState(null);
    let totalFileSize = 0;
    files.forEach((file) => (totalFileSize = totalFileSize + file.size));
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length === 0) {
            setInternalError("No valid files were dropped");
            return;
        }
        const newFiles = acceptedFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        }));
        setFiles(newFiles);
    }, []);
    const handleUpload = async (files) => {
        setIsUploading(true);
        if (files.length === 0) {
            return;
        }
        setUploadError("");
        if (totalFileSize > FILE_THRESHOLD) {
            setUploadError(`Files are more than ${(FILE_THRESHOLD / (1024 * 1024)).toFixed(2)}MB`);
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
            const result = await response.json();
            setData(result.payload);
        }
        catch (error) {
            console.error(error);
        }
        finally {
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
    };
    // Setup Dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDrop,
        accept: acceptedFiletypes,
        maxSize: 20 * 1024 * 1024, // 20MB
    });
    const renderDropZone = () => {
        return (_jsxs("div", { ...getRootProps(), ...props, className: cn("grid place-items-center border-8 border-dashed border-gray-200 hover:border-gray-300 rounded-4xl w-[400px] h-[300px] lg:w-[700px] lg:h-[400px] cursor-pointer mx-auto transition-colors", isDragActive && "border-blue-500"), children: [_jsx("input", { ...getInputProps() }), _jsxs("div", { className: "text-center", children: [_jsx(UploadIcon, { className: "w-8 h-8 text-gray-400 inline-block" }), _jsx("p", { className: "text-gray-500", children: "Select or drag and drop your files here" }), _jsx("p", { className: "text-xs text-gray-400", children: "(PDF, DOC, DOCX, MD up to 20MB)" })] }), internalError && (_jsx("p", { className: "text-xs text-red-500 mt-2", children: internalError }))] }));
    };
    if (!data) {
        return files.length === 0 ? (renderDropZone()) : (_jsxs("div", { className: "space-y-4", children: [_jsx(FileList, { files: files, setFiles: setFiles }), _jsxs(Button, { onClick: () => handleUpload(files), className: "cursor-pointer", disabled: isUploading, children: [isUploading && _jsx(Loader, { className: "animate-spin" }), isUploading ? "Uploading" : "Upload"] }), uploadError && (_jsx("p", { className: "text-xs text-red-500 mt-2", children: uploadError }))] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3", children: data.map(({ title, thumb_url, url }) => (_jsx(ResultCard, { title: title, thumbUrl: thumb_url, url: url }))) }), _jsx(Button, { onClick: () => setData(null), children: "Clear" })] }));
}
function FileList({ files, setFiles, }) {
    const removeFile = (file) => {
        const newFiles = files.filter((f) => f !== file);
        setFiles(newFiles);
    };
    const computeFileSize = (file) => {
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
    return (_jsx("div", { className: "space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2", children: files.map((file, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 shadow", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-gray-300 rounded flex items-center justify-center p-5", children: _jsx("span", { className: "text-xs font-medium", children: file.name.split(".").pop()?.toUpperCase() }) }), _jsxs("div", { className: "flex flex-col items-start space-y-1", children: [_jsx("p", { className: "text-sm font-medium truncate max-w-[15rem] sm:max-w-xs", children: file.name }), _jsx("p", { className: "text-xs text-gray-500", children: computeFileSize(file) })] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => removeFile(file), children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, index))) }));
}
