interface InputFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}

export function InputField({
  label,
  required,
  optional,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-1.5">
        {label}{" "}
        {required && <span className="text-red-400">*</span>}
        {optional && <span className="text-slate-500">(nếu có)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all
          ${error ? "border-red-500/60" : "border-slate-600/50"}`}
      />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
