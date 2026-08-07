// Đăng ký toàn bộ nội dung game tại một nơi duy nhất.
// Thêm địa điểm / NPC / hội thoại mới: tạo file JSON rồi import + đăng ký ở đây.
//
// Nội dung địa điểm/NPC/hội thoại chính thức đang được xây dựng trên nền
// World Bible (xem lore/). Nhân vật chính đã có: Lamar von Berg.

import type { CharacterProfile, Dialogue, GameLocation, WorldIndex } from "../engine/types";
import type { HistoricalNpc, PersistentNpc } from "../engine/npcTypes";
import type { CityEconomy, Good, Shop, SupplyChain, Tax, TradeRoute } from "../engine/economyTypes";
import type { Relationship } from "../engine/relationshipTypes";
import type { Faction, Law, NobilityTitle, ReputationEntry } from "../engine/politicsTypes";

import character from "./character.json";
import worldIndexData from "./world-index.json";
import startingRelationshipsData from "./starting-relationships.json";

// Chính trị
import factionsData from "./factions.json";
import nobilityTitlesData from "./nobility-titles.json";
import lawsData from "./laws.json";
import startingReputationData from "./starting-reputation.json";

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
import doanhTraiFielding from "./locations/doanh-trai-fielding.json";

// Hội thoại
import chuong1MoDau from "./dialogues/chuong1-mo-dau.json";
import reinhardtChiaTay from "./dialogues/reinhardt-chia-tay.json";
import isoldeTamBiet from "./dialogues/isolde-tam-biet.json";
import eliraTamBiet from "./dialogues/elira-tam-biet.json";
import martaTamBiet from "./dialogues/marta-tam-biet.json";
import rowanLoiKhuyen from "./dialogues/rowan-loi-khuyen.json";
import tobiasChucPhuc from "./dialogues/tobias-chuc-phuc.json";
import chuong1RoiCong from "./dialogues/chuong1-roi-cong.json";
import chuong1HanhTrinh from "./dialogues/chuong1-hanh-trinh.json";
import chuong1DoanhTraiDenNoi from "./dialogues/chuong1-doanh-trai-den-noi.json";
import chuong1DongDoi from "./dialogues/chuong1-dong-doi.json";
import chuong1DemDau from "./dialogues/chuong1-dem-dau.json";
import daiUyFerrinTroChuyen from "./dialogues/dai-uy-ferrin-tro-chuyen.json";
import bramOstlerTroChuyen from "./dialogues/bram-ostler-tro-chuyen.json";
import osricVaneTroChuyen from "./dialogues/osric-vane-tro-chuyen.json";
import godricChaoHoi from "./dialogues/godric-chao-hoi.json";
import elowenChaoHoi from "./dialogues/elowen-chao-hoi.json";
import agnesChaoHoi from "./dialogues/agnes-chao-hoi.json";

// NPC Tầng I — NPC Lịch Sử
import quocVuongAlaricEastmere from "./npcs-historical/quocvuong-alaric-eastmere.json";
import thaiTuCedricEastmere from "./npcs-historical/thai-tu-cedric-eastmere.json";
import namTuocReinhardtVonBerg from "./npcs-historical/nam-tuoc-reinhardt-von-berg.json";
import namTuocPhuNhanIsoldeVonBerg from "./npcs-historical/nam-tuoc-phu-nhan-isolde-von-berg.json";
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
import tieuThuEliraVonBerg from "./npcs-persistent/tieu-thu-elira-von-berg.json";
import quanGiaMartaHollis from "./npcs-persistent/quan-gia-marta-hollis.json";
import daiUyAldousFerrin from "./npcs-persistent/dai-uy-aldous-ferrin.json";
import tanBinhBramOstler from "./npcs-persistent/tan-binh-bram-ostler.json";
import tanBinhOsricVane from "./npcs-persistent/tan-binh-osric-vane.json";

const locationList = [
  sanLauDaiBergfeld,
  langAshford,
  langMillbrook,
  langThornwell,
  doanhTraiFielding,
] as GameLocation[];

export const locations: Record<string, GameLocation> = Object.fromEntries(
  locationList.map((location) => [location.id, location]),
);

const dialogueList = [
  chuong1MoDau,
  reinhardtChiaTay,
  isoldeTamBiet,
  eliraTamBiet,
  martaTamBiet,
  rowanLoiKhuyen,
  tobiasChucPhuc,
  chuong1RoiCong,
  chuong1HanhTrinh,
  chuong1DoanhTraiDenNoi,
  chuong1DongDoi,
  chuong1DemDau,
  daiUyFerrinTroChuyen,
  bramOstlerTroChuyen,
  osricVaneTroChuyen,
  godricChaoHoi,
  elowenChaoHoi,
  agnesChaoHoi,
] as Dialogue[];

export const dialogues: Record<string, Dialogue> = Object.fromEntries(
  dialogueList.map((dialogue) => [dialogue.id, dialogue]),
);

export const STARTING_LOCATION_ID = sanLauDaiBergfeld.id;

// Chương I ("Rời Quê Hương") bắt đầu ngay khi vào game mới — xem newGame() trong GameEngine.
export const CHAPTER_1_START_DIALOGUE_ID = chuong1MoDau.id;

export const worldIndex: WorldIndex = worldIndexData as WorldIndex;

export const protagonist: CharacterProfile = character as CharacterProfile;

const historicalNpcList = [
  quocVuongAlaricEastmere,
  thaiTuCedricEastmere,
  namTuocReinhardtVonBerg,
  namTuocPhuNhanIsoldeVonBerg,
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
  tieuThuEliraVonBerg,
  quanGiaMartaHollis,
  daiUyAldousFerrin,
  tanBinhBramOstler,
  tanBinhOsricVane,
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

// ---------- Quan hệ ----------

const startingRelationshipList = startingRelationshipsData as Relationship[];
export const startingRelationships: Record<string, Relationship> = Object.fromEntries(
  startingRelationshipList.map((rel) => [rel.npcId, rel]),
);

// ---------- Chính trị ----------

const factionList = factionsData as Faction[];
export const factions: Record<string, Faction> = Object.fromEntries(factionList.map((f) => [f.id, f]));

export const nobilityTitles: NobilityTitle[] = nobilityTitlesData as NobilityTitle[];
export const laws: Law[] = lawsData as Law[];

const startingReputationList = startingReputationData as ReputationEntry[];
export const startingReputation: Record<string, ReputationEntry> = Object.fromEntries(
  startingReputationList.map((r) => [r.targetId, r]),
);
