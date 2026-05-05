// ─── Public URLs (not secrets) ─────────────────────────────────────────────
export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScsOG5Qb7LfK5gY0hsBqAeUbBlQB0FP8rKJ2Uk1Tn55YysMcQ/viewform?usp=dialog";

// ─── Tournament Constants ──────────────────────────────────────────────────
export const TOURNAMENT_NAME = "VNUK 2026";
export const GROUP_IDS = ["A", "B", "C", "D"] as const;
export type GroupId = (typeof GROUP_IDS)[number];

export const MATCH_META = [
  { round: "Vòng 1", label: "Trận 1", tag: "Phân nhánh", color: "bg-blue-600" },
  { round: "Vòng 1", label: "Trận 2", tag: "Phân nhánh", color: "bg-blue-600" },
  { round: "Vòng 2", label: "Trận 3", tag: "Nhất Bảng", color: "bg-orange-500" },
  { round: "Vòng 2", label: "Trận 4", tag: "Sàng Lọc", color: "bg-yellow-500" },
  { round: "Vòng 3", label: "Trận 5", tag: "Sinh Tử 🔥", color: "bg-red-500" },
] as const;
