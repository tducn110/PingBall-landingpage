import { useRef } from "react";

interface FileUploadProps {
  file: File | null;
  previewUrl: string | null;
  onFile: (file: File) => void;
  error?: string;
}

export function FileUpload({ file, previewUrl, onFile, error }: FileUploadProps) {
  const ref = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Biên lai thanh toán <span className="text-red-400">*</span>
      </h3>

      <div
        onClick={() => ref.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          hover:border-orange-500/50 hover:bg-orange-500/5
          ${error ? "border-red-500/50" : "border-slate-600/50"}`}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <img
              src={previewUrl}
              alt="Biên lai"
              className="max-h-48 rounded-lg object-contain"
            />
            <p className="text-green-400 text-sm font-medium">{file?.name}</p>
            <p className="text-slate-400 text-xs">Nhấn để thay đổi ảnh</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-slate-300 font-medium">Nhấn để tải ảnh lên</p>
            <p className="text-slate-500 text-sm">PNG, JPG, JPEG (tối đa 10 MB)</p>
          </div>
        )}
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
