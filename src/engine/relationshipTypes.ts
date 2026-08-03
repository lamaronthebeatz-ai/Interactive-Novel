// Hệ thống quan hệ. Đây là mạng lưới quan hệ xã hội, không phải một thanh điểm đơn giản.
// Mỗi quan hệ có 7 chiều độc lập, có thể mang nhiều loại quan hệ cùng lúc, và ghi nhớ
// những sự kiện quan trọng đã xảy ra giữa người chơi và NPC.

export interface RelationshipDimensions {
  trust: number; // tin tưởng
  respect: number; // tôn trọng
  affection: number; // yêu thích
  fear: number; // sợ hãi
  debt: number; // mắc nợ
  suspicion: number; // nghi ngờ
  loyalty: number; // trung thành
}

export const DIMENSION_LABELS: Record<keyof RelationshipDimensions, string> = {
  trust: "Tin tưởng",
  respect: "Tôn trọng",
  affection: "Yêu thích",
  fear: "Sợ hãi",
  debt: "Mắc nợ",
  suspicion: "Nghi ngờ",
  loyalty: "Trung thành",
};

// Mức khởi điểm của một quan hệ mới, khi người chơi gặp một NPC lần đầu mà
// chưa có dữ liệu khởi tạo riêng (xem src/data/starting-relationships.json).
export const DEFAULT_RELATIONSHIP_DIMENSIONS: RelationshipDimensions = {
  trust: 15,
  respect: 15,
  affection: 10,
  fear: 0,
  debt: 0,
  suspicion: 5,
  loyalty: 0,
};

export function clampDimension(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export type RelationshipRole =
  | "cha-me"
  | "con-cai"
  | "anh-chi-em"
  | "ho-hang"
  | "thay"
  | "tro"
  | "chu"
  | "thuoc-ha"
  | "dong-nghiep"
  | "ban-be"
  | "dong-minh"
  | "doi-thu"
  | "ke-thu"
  | "chu-no"
  | "con-no"
  | "hon-uoc"
  | "vo-chong";

export const RELATIONSHIP_ROLE_LABELS: Record<RelationshipRole, string> = {
  "cha-me": "Cha mẹ",
  "con-cai": "Con cái",
  "anh-chi-em": "Anh chị em",
  "ho-hang": "Họ hàng",
  thay: "Thầy",
  tro: "Trò",
  chu: "Chủ",
  "thuoc-ha": "Thuộc hạ",
  "dong-nghiep": "Đồng nghiệp",
  "ban-be": "Bạn bè",
  "dong-minh": "Đồng minh",
  "doi-thu": "Đối thủ",
  "ke-thu": "Kẻ thù",
  "chu-no": "Chủ nợ",
  "con-no": "Con nợ",
  "hon-uoc": "Đính hôn",
  "vo-chong": "Vợ chồng",
};

// Trí nhớ — chỉ những sự kiện có ý nghĩa mới được ghi lại, không phải mọi hành động nhỏ.
export type MemoryEventType =
  | "cuu-mang"
  | "xuc-pham"
  | "vay-tien"
  | "tra-no"
  | "that-hua"
  | "giet-nguoi-than"
  | "giup-mua-mang"
  | "mua-hang-thuong-xuyen"
  | "khac";

export const MEMORY_EVENT_LABELS: Record<MemoryEventType, string> = {
  "cuu-mang": "Cứu mạng",
  "xuc-pham": "Xúc phạm",
  "vay-tien": "Vay tiền",
  "tra-no": "Trả nợ",
  "that-hua": "Thất hứa",
  "giet-nguoi-than": "Giết người thân",
  "giup-mua-mang": "Giúp mùa màng",
  "mua-hang-thuong-xuyen": "Mua hàng thường xuyên",
  khac: "Khác",
};

export interface Memory {
  eventType: MemoryEventType;
  description: string;
  day: number; // ngày trong game khi sự kiện xảy ra
  impact: Partial<RelationshipDimensions>; // mức thay đổi áp dụng khi ghi nhớ sự kiện này
}

export interface Relationship {
  npcId: string;
  roles: RelationshipRole[];
  dimensions: RelationshipDimensions;
  memories: Memory[];
}

// ---------- Nền tảng hôn nhân (chuẩn bị cho gameplay ở build sau) ----------

export type MaritalStatus = "doc-than" | "dinh-hon" | "ket-hon" | "ly-hon" | "goa-bua";

export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  "doc-than": "Độc thân",
  "dinh-hon": "Đã đính hôn",
  "ket-hon": "Đã kết hôn",
  "ly-hon": "Đã ly hôn",
  "goa-bua": "Góa bụa",
};
