// Đăng ký toàn bộ nội dung game tại một nơi duy nhất.
// Thêm địa điểm / NPC / hội thoại mới: tạo file JSON rồi import + đăng ký ở đây.
//
// Nội dung địa điểm/NPC/hội thoại chính thức đang được xây dựng trên nền
// World Bible (xem lore/). Nhân vật chính đã có: Lamar von Berg.

import type { CharacterProfile, Dialogue, GameLocation, NPC } from "../engine/types";
import type { HistoricalNpc, PersistentNpc } from "../engine/npcTypes";

import character from "./character.json";

// NPC Tầng I — NPC Lịch Sử
import quocVuongAlaricEastmere from "./npcs-historical/quocvuong-alaric-eastmere.json";
import thaiTuCedricEastmere from "./npcs-historical/thai-tu-cedric-eastmere.json";
import namTuocReinhardtVonBerg from "./npcs-historical/nam-tuoc-reinhardt-von-berg.json";
import congTuocElricWhitcrest from "./npcs-historical/cong-tuoc-elric-whitcrest.json";
import baTuocHalvardRosswind from "./npcs-historical/ba-tuoc-halvard-rosswind.json";
import daiTeTySeraphine from "./npcs-historical/dai-te-ty-seraphine.json";
import vienTruongBertrandCole from "./npcs-historical/vien-truong-bertrand-cole.json";
import chuNganHangCassianVoss from "./npcs-historical/chu-ngan-hang-cassian-voss.json";
import daiTuongDravenCorvane from "./npcs-historical/dai-tuong-draven-corvane.json";

// NPC Tầng II — NPC Thường Trực
import kySiRowanAshby from "./npcs-persistent/ky-si-rowan-ashby.json";
import thoRenGodricMarlin from "./npcs-persistent/tho-ren-godric-marlin.json";
import thayThuocElowenBrack from "./npcs-persistent/thay-thuoc-elowen-brack.json";
import giaoSiTobiasWren from "./npcs-persistent/giao-si-tobias-wren.json";
import chuQuanTroAgnesColdwell from "./npcs-persistent/chu-quan-tro-agnes-coldwell.json";

export const locations: Record<string, GameLocation> = {};

export const npcs: Record<string, NPC> = {};

export const dialogues: Record<string, Dialogue> = {};

export const STARTING_LOCATION_ID = "";

export const protagonist: CharacterProfile = character as CharacterProfile;

const historicalNpcList = [
  quocVuongAlaricEastmere,
  thaiTuCedricEastmere,
  namTuocReinhardtVonBerg,
  congTuocElricWhitcrest,
  baTuocHalvardRosswind,
  daiTeTySeraphine,
  vienTruongBertrandCole,
  chuNganHangCassianVoss,
  daiTuongDravenCorvane,
] as HistoricalNpc[];

const persistentNpcList = [
  kySiRowanAshby,
  thoRenGodricMarlin,
  thayThuocElowenBrack,
  giaoSiTobiasWren,
  chuQuanTroAgnesColdwell,
] as PersistentNpc[];

export const historicalNpcs: Record<string, HistoricalNpc> = Object.fromEntries(
  historicalNpcList.map((npc) => [npc.id, npc]),
);

export const persistentNpcs: Record<string, PersistentNpc> = Object.fromEntries(
  persistentNpcList.map((npc) => [npc.id, npc]),
);
