// Đăng ký toàn bộ nội dung game tại một nơi duy nhất.
// Thêm địa điểm / NPC / hội thoại mới: tạo file JSON rồi import + đăng ký ở đây.
//
// Nội dung địa điểm/NPC/hội thoại chính thức đang được xây dựng trên nền
// World Bible (xem lore/). Nhân vật chính đã có: Lamar von Berg.

import type { CharacterProfile, Dialogue, GameLocation, WorldIndex } from "../engine/types";
import type { HistoricalNpc, PersistentNpc } from "../engine/npcTypes";
import type { CityEconomy, Good, Shop, SupplyChain, Tax, TradeRoute } from "../engine/economyTypes";

import character from "./character.json";
import worldIndexData from "./world-index.json";

// Kinh tế
import goodsData from "./goods.json";
import supplyChainsData from "./supply-chains.json";
import tradeRoutesData from "./trade-routes.json";
import cityEconomiesData from "./city-economies.json";
import taxesData from "./taxes.json";
import shopsData from "./shops.json";

// Địa điểm
import sanLauDaiBergfeld from "./locations/san-lau-dai-bergfeld.json";
import langAshford from "./locations/lang-ashford.json";
import langMillbrook from "./locations/lang-millbrook.json";
import langThornwell from "./locations/lang-thornwell.json";

// Hội thoại
import reinhardtChiaTay from "./dialogues/reinhardt-chia-tay.json";
import rowanLoiKhuyen from "./dialogues/rowan-loi-khuyen.json";
import tobiasChucPhuc from "./dialogues/tobias-chuc-phuc.json";
import godricChaoHoi from "./dialogues/godric-chao-hoi.json";
import elowenChaoHoi from "./dialogues/elowen-chao-hoi.json";
import agnesChaoHoi from "./dialogues/agnes-chao-hoi.json";

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

const locationList = [sanLauDaiBergfeld, langAshford, langMillbrook, langThornwell] as GameLocation[];

export const locations: Record<string, GameLocation> = Object.fromEntries(
  locationList.map((location) => [location.id, location]),
);

const dialogueList = [
  reinhardtChiaTay,
  rowanLoiKhuyen,
  tobiasChucPhuc,
  godricChaoHoi,
  elowenChaoHoi,
  agnesChaoHoi,
] as Dialogue[];

export const dialogues: Record<string, Dialogue> = Object.fromEntries(
  dialogueList.map((dialogue) => [dialogue.id, dialogue]),
);

export const STARTING_LOCATION_ID = sanLauDaiBergfeld.id;

export const worldIndex: WorldIndex = worldIndexData as WorldIndex;

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

// ---------- Kinh tế ----------

export const goods: Good[] = goodsData as Good[];
export const supplyChains: SupplyChain[] = supplyChainsData as SupplyChain[];
export const tradeRoutes: TradeRoute[] = tradeRoutesData as TradeRoute[];
export const cityEconomies: CityEconomy[] = cityEconomiesData as CityEconomy[];
export const taxes: Tax[] = taxesData as Tax[];

const shopList = shopsData as Shop[];
export const shops: Record<string, Shop> = Object.fromEntries(shopList.map((shop) => [shop.id, shop]));
