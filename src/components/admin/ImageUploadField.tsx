'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'firstquality',
  className = '',
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [needsCompression, setNeedsCompression] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Rule 1: Max 4MB rejection
    const MAX_4MB = 4 * 1024 * 1024;
    const THRESHOLD_2MB = 2 * 1024 * 1024;

    if (file.size > MAX_4MB) {
      setError('File exceeds the maximum allowed size of 4 MB. Please select a smaller file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Set local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setPendingFile(file);

    // Rule 2: Files > 2MB must offer an image compression option before saving
    if (file.size > THRESHOLD_2MB) {
      setNeedsCompression(true);
    } else {
      setNeedsCompression(false);
      // Auto-upload files under 2MB
      await uploadFile(file);
    }
  };

  const compressAndUpload = async () => {
    if (!pendingFile) return;

    try {
      setCompressing(true);
      setError(null);

      const options = {
        maxSizeMB: 1.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(pendingFile, options);
      setPendingFile(compressedFile);
      setNeedsCompression(false);
      setCompressing(false);

      // Upload the compressed file
      await uploadFile(compressedFile);
    } catch (err) {
      console.error('Compression error:', err);
      setError('Compression failed. Please try a different image.');
      setCompressing(false);
    }
  };

  const uploadFile = async (fileToUpload: File) => {
    try {
      setUploading(true);
      setProgress(30);

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('folder', folder);

      setProgress(60);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setProgress(100);

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setPreview(data.url);
      onChange(data.url, data.public_id);
      setNeedsCompression(false);
      setPendingFile(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setPendingFile(null);
    setNeedsCompression(false);
    onChange('', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-800">{label}</label>

      {/* Preview & Upload Box */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {preview ? (
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center hover:bg-rose-700 shadow-md"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50 text-xs">
            <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>No Image</span>
          </div>
        )}

        <div className="space-y-2 flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#15803d] hover:file:bg-emerald-100 cursor-pointer"
          />
          <p className="text-xs text-gray-400">
            Max upload size: 4 MB. Files between 2 MB - 4 MB can be compressed before upload.
          </p>

          {/* Prompt to compress if file is > 2MB */}
          {needsCompression && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <p className="text-xs text-amber-800 font-medium">
                This image is {(pendingFile ? (pendingFile.size / (1024 * 1024)).toFixed(1) : '2+')} MB. It is recommended to compress it for faster page load times.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={compressAndUpload}
                  disabled={compressing}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                >
                  {compressing ? 'Compressing...' : 'Compress & Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => pendingFile && uploadFile(pendingFile)}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                >
                  Upload Original
                </button>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#15803d] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ImageUploadField;
