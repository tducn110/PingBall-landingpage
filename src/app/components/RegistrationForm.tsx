import { useState } from "react";
import { FadeInView } from "./ui/FadeInView";
import { SectionHeader } from "./ui/SectionHeader";
import { PaymentGuide } from "./form/PaymentGuide";
import { PlayerFields } from "./form/PlayerFields";
import { FileUpload } from "./form/FileUpload";
import { AgreementBox } from "./form/AgreementBox";
import { SuccessScreen } from "./form/SuccessScreen";
import { useRegistration } from "../../hooks/useRegistration";
import { useTournament } from "../../hooks/useTournament";
import { GROUP_IDS } from "../../lib/config";
import type { GroupId } from "../../lib/config";

interface FormState {
  name1: string;
  studentId1: string;
  phone1: string;
  name2: string;
  studentId2: string;
  paymentFile: File | null;
  previewUrl: string | null;
  agreed: boolean;
  groupId: GroupId;
}

interface FormErrors {
  name1?: string;
  phone1?: string;
  name2?: string;
  paymentFile?: string;
  agreed?: string;
}

const INITIAL: FormState = {
  name1: "", studentId1: "", phone1: "",
  name2: "", studentId2: "",
  paymentFile: null, previewUrl: null,
  agreed: false,
  groupId: "A",
};

export function RegistrationForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { tournament } = useTournament();
  const { submitting, submit } = useRegistration();

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name1.trim()) e.name1 = "Vui lòng nhập họ tên VĐV 1";
    if (!form.phone1.trim()) e.phone1 = "Vui lòng nhập số điện thoại";
    else if (!/^(0|\+84)[0-9]{8,10}$/.test(form.phone1.replace(/\s/g, "")))
      e.phone1 = "Số điện thoại không hợp lệ";
    if (!form.name2.trim()) e.name2 = "Vui lòng nhập họ tên VĐV 2";
    if (!form.paymentFile) e.paymentFile = "Vui lòng đính kèm biên lai chuyển khoản";
    if (!form.agreed) e.agreed = "Bạn cần đồng ý với điều lệ giải đấu";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);

    if (!tournament) {
      setSubmitError("Chưa có giải đấu nào đang hoạt động. Vui lòng thử lại sau.");
      return;
    }

    try {
      await submit(
        {
          tournament_id: tournament.id,
          group_id: form.groupId,
          name: `${form.name1} & ${form.name2}`,
          player1_name: form.name1,
          player1_student_id: form.studentId1 || "",
          player1_phone: form.phone1,
          player2_name: form.name2,
          player2_student_id: form.studentId2 || "",
        },
        form.paymentFile
      );
      setSubmitted(true);
    } catch (err) {
      setSubmitError("Lỗi khi gửi đăng ký. Vui lòng thử lại.");
    }
  }

  function handleFile(file: File) {
    set("paymentFile", file);
    set("previewUrl", URL.createObjectURL(file));
  }

  if (submitted) {
    return (
      <section id="register" className="py-20 bg-slate-900">
        <div className="max-w-2xl mx-auto px-4">
          <SuccessScreen
            name1={form.name1}
            name2={form.name2}
            phone={form.phone1}
            onReset={() => { setSubmitted(false); setForm(INITIAL); setErrors({}); }}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-20 bg-slate-900">
      <div className="max-w-3xl mx-auto px-4">
        <FadeInView>
          <SectionHeader eyebrow="Tham gia ngay" title="Đăng ký Tham dự" subtitle="Điền đầy đủ thông tin bên dưới để hoàn tất đăng ký tham dự giải đấu." />
        </FadeInView>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FadeInView delay={0.1}><PaymentGuide /></FadeInView>

          {/* Group selection */}
          <FadeInView delay={0.12}>
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 text-sm font-medium">Chọn bảng đấu</label>
              <div className="flex gap-2">
                {GROUP_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => set("groupId", id)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      form.groupId === id
                        ? "bg-orange-500 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    Bảng {id}
                  </button>
                ))}
              </div>
            </div>
          </FadeInView>

          <FadeInView delay={0.15}>
            <PlayerFields
              playerNum={1}
              name={form.name1}
              studentId={form.studentId1}
              phone={form.phone1}
              onName={(v) => set("name1", v)}
              onStudentId={(v) => set("studentId1", v)}
              onPhone={(v) => set("phone1", v)}
              nameError={errors.name1}
              phoneError={errors.phone1}
            />
          </FadeInView>

          <FadeInView delay={0.2}>
            <PlayerFields
              playerNum={2}
              name={form.name2}
              studentId={form.studentId2}
              onName={(v) => set("name2", v)}
              onStudentId={(v) => set("studentId2", v)}
              nameError={errors.name2}
            />
          </FadeInView>

          <FadeInView delay={0.25}>
            <FileUpload
              file={form.paymentFile}
              previewUrl={form.previewUrl}
              onFile={handleFile}
              error={errors.paymentFile}
            />
          </FadeInView>

          <FadeInView delay={0.3}>
            <AgreementBox
              checked={form.agreed}
              onToggle={() => set("agreed", !form.agreed)}
              error={errors.agreed}
            />
          </FadeInView>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {submitError}
            </div>
          )}

          <FadeInView delay={0.35}>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white py-4 rounded-xl font-black tracking-wide transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-400/35 hover:-translate-y-0.5 text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? "ĐANG GỬI..." : "HOÀN TẤT ĐĂNG KÝ 🏓"}
            </button>
          </FadeInView>
        </form>
      </div>
    </section>
  );
}
