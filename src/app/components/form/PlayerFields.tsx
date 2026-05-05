import { InputField } from "./InputField";

interface PlayerFieldsProps {
  playerNum: 1 | 2;
  name: string;
  studentId: string;
  phone?: string;
  onName: (v: string) => void;
  onStudentId: (v: string) => void;
  onPhone?: (v: string) => void;
  nameError?: string;
  phoneError?: string;
}

export function PlayerFields({
  playerNum,
  name,
  studentId,
  phone,
  onName,
  onStudentId,
  onPhone,
  nameError,
  phoneError,
}: PlayerFieldsProps) {
  const dotColor = playerNum === 1 ? "bg-blue-600" : "bg-orange-500";

  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6">
      {/* Header */}
      <h3 className="text-white font-bold mb-5 flex items-center gap-2">
        <span
          className={`w-6 h-6 rounded-full ${dotColor} flex items-center justify-center text-xs font-black`}
        >
          {playerNum}
        </span>
        {playerNum === 1 ? "Vận động viên 1 — Đại diện đội" : "Vận động viên 2"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <InputField
            label="Họ và tên"
            required
            value={name}
            onChange={onName}
            placeholder={playerNum === 1 ? "Nguyễn Văn A" : "Trần Thị B"}
            error={nameError}
          />
        </div>
        <InputField
          label="Mã sinh viên"
          optional
          value={studentId}
          onChange={onStudentId}
          placeholder={playerNum === 1 ? "VD: 22110123" : "VD: 22110456"}
        />
        {playerNum === 1 && onPhone !== undefined && (
          <InputField
            label="Số điện thoại"
            required
            type="tel"
            value={phone ?? ""}
            onChange={onPhone}
            placeholder="0901 234 567"
            error={phoneError}
          />
        )}
      </div>
    </div>
  );
}
