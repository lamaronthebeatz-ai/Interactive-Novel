// Kiểu dữ liệu lõi của engine. Engine không biết cốt truyện —
// mọi nội dung cụ thể (địa điểm, NPC, hội thoại) đều nằm trong src/data.

import type { PersistentNpc } from "./npcTypes";

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
  | { type: "setFlag"; flag: string; value: boolean };

export interface DialogueChoice {
  text: string;
  next?: string; // id node tiếp theo; bỏ trống = kết thúc hội thoại
  effects?: Effect[];
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

export interface NPC {
  id: string;
  name: string;
  description: string;
  dialogueId: string;
}

export interface LocationAction {
  id: string;
  text: string;
  effects?: Effect[];
}

export interface GameLocation {
  id: string;
  name: string;
  description: string;
  npcs: string[];
  actions?: LocationAction[];
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
  openingJournalEntry: string;
}

export type Screen = "menu" | "location" | "dialogue" | "journal" | "inventory" | "profile";

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
}
