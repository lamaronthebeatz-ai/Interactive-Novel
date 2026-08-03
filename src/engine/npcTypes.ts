// Hệ thống NPC 3 tầng.
//
// Tầng I  — HistoricalNpc: nhân vật ảnh hưởng thế giới, luôn tồn tại, dữ liệu đầy đủ, viết tay trong JSON.
// Tầng II — PersistentNpc: NPC người chơi có thể gặp lại nhiều lần, dữ liệu đầy đủ, viết tay hoặc được
//           thăng cấp từ Tầng III lúc chơi.
// Tầng III — DynamicNpc: dân thường, engine sinh ra khi cần, không lưu trữ riêng lẻ cho tới khi được
//           thăng cấp lên Tầng II.
//
// Quy ước: một trường quan hệ/gia đình chưa được xây dựng phải mang giá trị UNBUILT, không được để rỗng.

export const UNBUILT = "chưa xây dựng";

export type Gender = "Nam" | "Nữ";

export type RelationshipType =
  | "gia-dinh"
  | "ban-be"
  | "dong-nghiep"
  | "chu"
  | "thuoc-ha"
  | "chu-no"
  | "con-no"
  | "hang-xom"
  | "dong-minh"
  | "doi-thu"
  | "ke-thu";

export interface Relationship {
  npcId: string;
  type: RelationshipType;
  note?: string;
}

export interface ScheduleEntry {
  time: string; // "06:00"
  activity: string;
}

export interface FamilyInfo {
  father: string; // id NPC khác, hoặc UNBUILT
  mother: string;
  siblings: string[]; // id NPC khác, hoặc [UNBUILT]
  spouse: string;
  children: string[];
}

// ---------- Tầng I: NPC Lịch Sử ----------

export interface HistoricalNpc {
  id: string;
  tier: "historical";
  fullName: string;
  title: string; // "Quốc vương", "Công tước", "Nam tước"...
  house: string;
  nation: string; // tên quốc gia trong World Bible
  age: number;
  gender: Gender;
  biography: string[];
  family: FamilyInfo;
  politicalRelations: Relationship[];
  wealth: string;
  military: string; // "Không có" nếu không phù hợp
  schedule: ScheduleEntry[];
  goals: string[];
}

// ---------- Tầng II: NPC Thường Trực ----------

export interface PersistentNpc {
  id: string;
  tier: "persistent";
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  nationality: string;
  occupation: string;
  residence: string;
  family: FamilyInfo;
  friends: string[]; // id NPC khác, hoặc [UNBUILT]
  enemies: string[];
  income: string;
  assets: string;
  personality: string[];
  likes: string[];
  dislikes: string[];
  lifeGoal: string;
  schedule: ScheduleEntry[];
  promotedFrom?: "dynamic";
  promotionReason?: PromotionReason;
}

// ---------- Tầng III: NPC Quần Chúng ----------

export interface DynamicNpc {
  id: string;
  tier: "dynamic";
  gender: Gender;
  age: number;
  occupation: string;
  residence: string;
  behavior: string;
}

export type PromotionReason =
  | "ket-ban"
  | "ket-hon"
  | "tham-gia-chien-tranh"
  | "giu-chuc-vu"
  | "tro-nen-quan-trong";

export const PROMOTION_REASON_LABELS: Record<PromotionReason, string> = {
  "ket-ban": "Kết bạn với người chơi",
  "ket-hon": "Kết hôn",
  "tham-gia-chien-tranh": "Tham gia chiến tranh",
  "giu-chuc-vu": "Giữ chức vụ",
  "tro-nen-quan-trong": "Trở nên quan trọng",
};
