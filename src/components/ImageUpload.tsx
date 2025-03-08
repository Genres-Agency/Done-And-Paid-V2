"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  defaultImage?: string | null;
  imageError?: boolean;
  reset?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  defaultImage,
  imageError,
  reset,
}) => {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (reset) {
      setPreview(null);
    }
  }, [reset]);

  React.useEffect(() => {
    setPreview(defaultImage ?? null);
  }, [defaultImage]);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onFileSelect(file);
      // Clean up the object URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="w-full rounded-lg mx-auto flex items-center justify-center">
          <div className="relative w-[230px] h-[180px] rounded-xl overflow-hidden border shadow-lg dark:border-gray-700">
            <Image
              src={preview}
              alt="Uploaded Preview"
              layout="fill"
              objectFit="cover"
              className={`rounded-xl ${
                isLoading ? "animate-pulse bg-gray-200" : ""
              }`}
              onError={(e: any) => {
                e.target.src = "/images/placeholder.jpg";
                setIsLoading(false);
              }}
              onLoad={() => setIsLoading(false)}
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
              onClick={handleRemove}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label htmlFor="fileInput" className="w-full ">
          <div
            className={`w-full flex flex-col items-center justify-center gap-3 cursor-pointer py-16 px-6 rounded-lg border-2 border-dashed ${
              dragOver
                ? "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
            } hover:bg-gray-100 dark:hover:bg-gray-800 ${
              imageError ? "border-red-500" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelection}
              className="hidden"
              id="fileInput"
            />
            <p
              className={`text-gray-600 cursor-pointer ${
                imageError ? "text-red-500" : ""
              }`}
            >
              Drag & drop an image here, or{" "}
              <span className="text-blue-500 font-semibold">
                click to upload
              </span>
            </p>
          </div>
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
