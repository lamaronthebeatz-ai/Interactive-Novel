// Hệ thống chính trị, phe phái, và danh tiếng.
// "Không ai hoàn toàn trung lập" — mọi NPC đều thuộc về một phe nào đó,
// và mọi hành động lớn của người chơi đều có hệ quả lan truyền qua thế giới.

// ---------- Module 1: Phe phái ----------

export interface Faction {
  id: string;
  name: string;
  leader: string; // tên hoặc mô tả người lãnh đạo
  headquarters: string;
  members: string[]; // id NPC (Tầng I/II) là thành viên nổi bật
  goals: string[];
  allies: string[]; // id phe phái khác
  enemies: string[]; // id phe phái khác
  influenceRegions: string[]; // tên quốc gia/vùng chịu ảnh hưởng
  fundingSource: string;
}

// ---------- Module 2: Danh tiếng ----------
// Danh tiếng luôn gắn với một đối tượng cụ thể — không có chỉ số toàn thế giới.

export type ReputationTargetType = "phe-phai" | "quoc-gia" | "gia-toc" | "thanh-pho";

export interface ReputationEntry {
  targetId: string;
  targetType: ReputationTargetType;
  targetName: string;
  value: number; // -100 (căm ghét) .. 100 (tôn sùng), 0 = trung lập/vô danh
}

export function clampReputation(value: number): number {
  return Math.max(-100, Math.min(100, Math.round(value)));
}

// ---------- Module 3: Trung thành ----------

export type LoyaltyStance = "trung-lap" | "the-trung-thanh" | "phan-boi" | "chuyen-phe";

export const LOYALTY_STANCE_LABELS: Record<LoyaltyStance, string> = {
  "trung-lap": "Trung lập",
  "the-trung-thanh": "Đã thề trung thành",
  "phan-boi": "Đã phản bội",
  "chuyen-phe": "Đã chuyển phe",
};

export interface LoyaltyHistoryEntry {
  day: number;
  stance: LoyaltyStance;
  reason: string;
}

export interface LoyaltyRecord {
  factionId: string;
  stance: LoyaltyStance;
  history: LoyaltyHistoryEntry[]; // mọi hành động đều được ghi nhớ
}

// ---------- Module 4: Hệ thống quý tộc (dữ liệu tham chiếu tĩnh) ----------

export interface NobilityTitle {
  id: string;
  name: string;
  rank: number; // 1 = cao nhất (Vua)
  rights: string[];
  duties: string[];
  privileges: string[];
  land: string;
  income: string;
}

// ---------- Module 6: Pháp luật ----------

export type CrimeType = "trom-cap" | "giet-nguoi" | "phan-quoc" | "hoi-lo" | "tron-thue" | "xam-pham-lanh-dia";

export const CRIME_TYPE_LABELS: Record<CrimeType, string> = {
  "trom-cap": "Trộm cắp",
  "giet-nguoi": "Giết người",
  "phan-quoc": "Phản quốc",
  "hoi-lo": "Hối lộ",
  "tron-thue": "Trốn thuế",
  "xam-pham-lanh-dia": "Xâm phạm lãnh địa",
};

export interface Law {
  nation: string;
  crimeType: CrimeType;
  penalty: string;
  severity: number; // 1 (nhẹ) - 10 (nghiêm trọng nhất)
}

// ---------- Module 7: Tội phạm ----------

export type CrimeStatus = "chua-bi-phat-hien" | "bi-truy-na" | "bi-bat" | "bi-phat" | "bi-xu-tu" | "duoc-an-xa";

export const CRIME_STATUS_LABELS: Record<CrimeStatus, string> = {
  "chua-bi-phat-hien": "Chưa bị phát hiện",
  "bi-truy-na": "Đang bị truy nã",
  "bi-bat": "Đã bị bắt",
  "bi-phat": "Đã bị phạt",
  "bi-xu-tu": "Đã bị xử tử",
  "duoc-an-xa": "Được ân xá",
};

export interface CrimeRecord {
  nation: string;
  crimeType: CrimeType;
  description: string;
  day: number;
  status: CrimeStatus;
}

// ---------- Module 8: Ảnh hưởng ----------

export interface InfluenceStats {
  prestige: number; // uy tín
  influence: number; // ảnh hưởng
  connections: number; // quan hệ
  power: number; // quyền lực
}

export const INFLUENCE_LABELS: Record<keyof InfluenceStats, string> = {
  prestige: "Uy tín",
  influence: "Ảnh hưởng",
  connections: "Quan hệ",
  power: "Quyền lực",
};

// ---------- Module 9: Phản ứng thế giới ----------
// Tin tức không lan truyền tức thời — tốc độ phụ thuộc vào kênh truyền tin.

export type NewsChannel = "nguoi-dua-thu" | "thuong-nhan" | "giao-hoi" | "tin-don";

export const NEWS_CHANNEL_LABELS: Record<NewsChannel, string> = {
  "nguoi-dua-thu": "Người đưa thư",
  "thuong-nhan": "Thương nhân",
  "giao-hoi": "Giáo hội",
  "tin-don": "Tin đồn",
};

// Số ngày để tin lan sang một "chặng" tiếp theo qua từng kênh.
export const NEWS_CHANNEL_SPEED_DAYS: Record<NewsChannel, number> = {
  "nguoi-dua-thu": 1,
  "giao-hoi": 2,
  "thuong-nhan": 3,
  "tin-don": 5,
};

export interface PendingSpread {
  factionId: string;
  arrivesOnDay: number;
}

export interface WorldEvent {
  id: string;
  description: string;
  originDay: number;
  originFactionId?: string;
  channel: NewsChannel;
  knownBy: string[]; // id phe phái đã biết tin này
  pendingSpread: PendingSpread[]; // tin đang trên đường lan tới, chưa tới nơi
}
