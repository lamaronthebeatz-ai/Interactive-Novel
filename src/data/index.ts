// Đăng ký toàn bộ nội dung game tại một nơi duy nhất.
// Thêm địa điểm / NPC / hội thoại mới: tạo file JSON rồi import + đăng ký ở đây.

import type { Dialogue, GameLocation, NPC } from "../engine/types";

import sanDinhLang from "./locations/san-dinh-lang.json";
import ongTu from "./npcs/ong-tu.json";
import ongTuIntro from "./dialogues/ong-tu-intro.json";

export const locations: Record<string, GameLocation> = {
  [sanDinhLang.id]: sanDinhLang as GameLocation,
};

export const npcs: Record<string, NPC> = {
  [ongTu.id]: ongTu as NPC,
};

export const dialogues: Record<string, Dialogue> = {
  [ongTuIntro.id]: ongTuIntro as Dialogue,
};

export const STARTING_LOCATION_ID = sanDinhLang.id;
