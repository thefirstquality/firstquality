'use client';

import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { Check, X, AlertTriangle, UploadCloud } from 'lucide-react';

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
  // Use regular img tag — next/image cannot display blob: URLs (local preview)
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [needsCompression, setNeedsCompression] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview when value prop changes externally (e.g. when edit modal opens)
  useEffect(() => {
    if (value && value !== preview) {
      setPreview(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadSuccess(false);

    const MAX_4MB = 4 * 1024 * 1024;
    const THRESHOLD_2MB = 2 * 1024 * 1024;

    if (file.size > MAX_4MB) {
      setError('File exceeds the maximum allowed size of 4 MB. Please select a smaller file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Show local blob preview immediately so user sees something right away
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setPendingFile(file);

    if (file.size > THRESHOLD_2MB) {
      setNeedsCompression(true);
    } else {
      setNeedsCompression(false);
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
      setUploadSuccess(false);
      setProgress(20);

      const fd = new FormData();
      fd.append('file', fileToUpload);
      fd.append('folder', folder);

      setProgress(50);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      });

      setProgress(90);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress(100);

      // Update preview to the real CDN URL
      setPreview(data.url);
      onChange(data.url, data.public_id);
      setNeedsCompression(false);
      setPendingFile(null);
      setUploadSuccess(true);

      // Hide success badge after 3s
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 600);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setPendingFile(null);
    setNeedsCompression(false);
    setError(null);
    setUploadSuccess(false);
    onChange('', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-800">{label}</label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Image Preview — using plain <img> so blob: URLs and Cloudinary URLs both work */}
        <div className="flex-shrink-0">
          {preview ? (
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Upload success badge */}
              {uploadSuccess && (
                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-5 h-5" />
                  </div>
                </div>
              )}
              {/* Uploading overlay */}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">{progress}%</div>
                </div>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-md cursor-pointer"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50 text-xs">
              {uploading ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 border-2 border-[#15803d] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] text-gray-500">{progress}%</span>
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>No Image</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#15803d] hover:file:bg-emerald-100 cursor-pointer w-full"
          />

          {/* Status text */}
          {uploading && (
            <p className="text-xs text-[#15803d] font-medium flex items-center gap-1.5 animate-pulse">
              <UploadCloud className="w-4 h-4 animate-bounce" />
              <span>Uploading image... {progress}%</span>
            </p>
          )}
          {uploadSuccess && !uploading && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Image uploaded successfully!</span>
            </p>
          )}
          {!uploading && !uploadSuccess && (
            <p className="text-xs text-gray-400">
              Max 4 MB · JPG, PNG, WEBP, SVG accepted
            </p>
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

          {/* Compress prompt for large files */}
          {needsCompression && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <p className="text-xs text-amber-800 font-medium">
                This image is {(pendingFile ? (pendingFile.size / (1024 * 1024)).toFixed(1) : '2+')} MB.
                Compress it for faster loading?
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

          {/* Error */}
          {error && (
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              <p className="text-xs text-rose-600 font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploadField;
