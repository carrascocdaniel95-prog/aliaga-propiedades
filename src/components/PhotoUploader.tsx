import React, { useRef, useState } from 'react';
import { AlertCircle, UploadCloud } from 'lucide-react';
import { uploadPropertyImage } from '../lib/supabase';
import { compressImage } from '../utils/imageCompression';

interface PhotoUploaderProps {
  onUploaded: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onUploaded, onUploadingChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0 || progress) return;

    setErrors([]);
    onUploadingChange(true);
    for (const [index, file] of files.entries()) {
      setProgress({ current: index + 1, total: files.length });
      try {
        onUploaded(await uploadPropertyImage(await compressImage(file)));
      } catch (err) {
        const reason = err instanceof Error ? err.message : 'error desconocido';
        setErrors(prev => [...prev, `${file.name}: ${reason}`]);
      }
    }
    setProgress(null);
    onUploadingChange(false);
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          uploadFiles(Array.from(e.dataTransfer.files));
        }}
        className={`flex flex-col items-center justify-center gap-1 p-5 rounded-xl border-2 border-dashed cursor-pointer text-center transition-colors ${
          isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
        }`}
      >
        <UploadCloud className="w-6 h-6 text-teal-600" />
        {progress ? (
          <span className="text-xs font-bold text-teal-700">
            Subiendo foto {progress.current} de {progress.total}...
          </span>
        ) : (
          <>
            <span className="text-xs font-bold text-slate-700">
              Subir fotos desde tu dispositivo
            </span>
            <span className="text-[11px] text-slate-500">
              Haz clic para elegirlas o arrástralas aquí. Se optimizan automáticamente.
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            uploadFiles(Array.from(e.target.files || []));
            e.target.value = '';
          }}
        />
      </div>

      {errors.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold space-y-1">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>No se pudieron subir estas fotos:</span>
          </div>
          {errors.map(message => (
            <div key={message} className="break-words">{message}</div>
          ))}
        </div>
      )}
    </div>
  );
};
