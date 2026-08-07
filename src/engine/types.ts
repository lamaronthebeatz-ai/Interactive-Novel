// Kiểu dữ liệu lõi của engine. Engine không biết cốt truyện —
// mọi nội dung cụ thể (địa điểm, NPC, hội thoại) đều nằm trong src/data.

import type { PersistentNpc } from "./npcTypes";
import type { Shop } from "./economyTypes";
import type { MaritalStatus, MemoryEventType, Relationship, RelationshipDimensions, RelationshipRole } from "./relationshipTypes";
import type { CrimeRecord, InfluenceStats, LoyaltyRecord, ReputationEntry, ReputationTargetType, WorldEvent } from "./politicsTypes";

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
}

export interface JournalEntry {
  day: number;
  time: string; // đã định dạng, ví dụ "06:30"
  text: string;
}

export interface GameTime {
  day: number;
  minutesOfDay: number; // 0-1439
}

export type Effect =
  | { type: "addItem"; itemId: string; name: string; description: string; quantity?: number }
  | { type: "advanceTime"; minutes: number }
  | { type: "addJournalEntry"; text: string }
  | { type: "setFlag"; flag: string; value: boolean }
  | { type: "meetNpc"; npcId: string }
  | { type: "adjustRelationship"; npcId: string; deltas: Partial<RelationshipDimensions> }
  | { type: "recordMemory"; npcId: string; eventType: MemoryEventType; description: string; impact?: Partial<RelationshipDimensions> }
  | { type: "addRelationshipRole"; npcId: string; role: RelationshipRole }
  | { type: "adjustReputation"; targetId: string; targetType: ReputationTargetType; targetName: string; delta: number }
  | { type: "startDialogue"; dialogueId: string; npcId?: string }
  | { type: "setLocation"; locationId: string };

export interface DialogueChoice {
  text: string;
  next?: string; // id node tiếp theo; bỏ trống = kết thúc hội thoại
  effects?: Effect[];
  requiresTrust?: number; // chỉ hiện khi mức tin tưởng với NPC đang nói chuyện đạt ngưỡng này
}

export interface DialogueNode {
  speaker: string;
  text: string;
  choices: DialogueChoice[];
}

export interface Dialogue {
  id: string;
  start: string;
  nodes: Record<string, DialogueNode>;
}

export interface LocationAction {
  id: string;
  text: string;
  effects?: Effect[];
  requiresFlags?: string[]; // tất cả các flag này phải = true thì hành động mới hiện ra
}

export interface LocationConnection {
  toLocationId: string;
  label: string; // mô tả ngắn con đường, ví dụ "Con đường đất dẫn tới Ashford"
  walkMinutes: number;
  horseMinutes: number;
}

export interface GameLocation {
  id: string;
  name: string;
  type: string; // "Lâu đài", "Làng", "Thị trấn", "Thành phố"...
  nation: string; // tên quốc gia trong World Bible
  description: string;
  npcs: string[]; // id NPC Tầng I hoặc Tầng II có mặt tại đây (xem npcTypes.ts)
  buildings: string[]; // tên công trình tại địa điểm
  connections: LocationConnection[];
  actions?: LocationAction[];
}

// ---------- Bản đồ thế giới ----------
// Dữ liệu tham chiếu nhẹ, tóm tắt từ World Bible (xem lore/) để hiển thị trên bản đồ.
// Không lặp lại toàn bộ nội dung World Bible — chỉ đủ để định hướng người chơi.

export interface WorldIndexEntry {
  name: string;
  blurb: string;
}

export interface NationIndexEntry extends WorldIndexEntry {
  type: string;
}

export interface WorldIndex {
  continent: string;
  nations: NationIndexEntry[];
  majorRoads: WorldIndexEntry[];
  forests: WorldIndexEntry[];
  mountains: WorldIndexEntry[];
  rivers: WorldIndexEntry[];
}

export interface CharacterStat {
  label: string;
  value: number; // thang điểm 0-100
}

export interface CharacterProfile {
  name: string;
  age: number;
  gender: string;
  race: string;
  status: string;
  house: string;
  occupation: string;
  personality: string[];
  strengths: string[];
  weaknesses: string[];
  background: string[]; // các đoạn tiểu sử
  stats: CharacterStat[];
  startingItems: Item[];
  startingCurrency: number; // tính bằng Đồng Đồng
  openingJournalEntry: string;
}

export type Screen = "menu" | "location" | "dialogue" | "journal" | "inventory" | "profile" | "map" | "market";

export interface ActiveDialogue {
  npcId: string;
  dialogueId: string;
  nodeId: string;
}

export interface GameState {
  currentLocationId: string;
  time: GameTime;
  inventory: Item[];
  journal: JournalEntry[];
  flags: Record<string, boolean>;
  activeDialogue?: ActiveDialogue;
  knownNpcIds: string[]; // id NPC Tầng I/II mà người chơi đã biết/đã gặp
  promotedNpcs: PersistentNpc[]; // NPC Tầng III đã được thăng cấp lên Tầng II lúc chơi
  currency: number; // ví tiền của người chơi, tính bằng Đồng Đồng
  shops: Record<string, Shop>; // bản sao có thể thay đổi của cửa hàng (tồn kho giảm khi mua)
  activeShopId?: string;
  relationships: Record<string, Relationship>; // quan hệ của người chơi với từng NPC
  maritalStatus: MaritalStatus;
  spouseNpcId?: string;
  children: string[]; // id NPC con cái (nền tảng cho build sau)
  reputation: Record<string, ReputationEntry>; // danh tiếng theo từng đối tượng, không có chỉ số toàn thế giới
  loyalty: Record<string, LoyaltyRecord>; // lập trường trung thành với từng phe phái
  titles: string[]; // id tước vị (nobility-titles.json) hiện đang nắm giữ
  crimeRecords: CrimeRecord[];
  influence: InfluenceStats;
  worldEvents: WorldEvent[];
}
