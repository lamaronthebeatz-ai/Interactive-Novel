// Logic kinh tế thuần túy: quy đổi tiền tệ, lịch mùa, tính giá động.
// Mọi thay đổi giá đều có nguyên nhân rõ ràng (mùa vụ, nơi sản xuất, gián đoạn thương mại).

import { COPPER_PER_GOLD, COPPER_PER_SILVER } from "./economyTypes";
import type { Good, Season, TradeRoute } from "./economyTypes";

export function formatCurrency(copper: number): string {
  const gold = Math.floor(copper / COPPER_PER_GOLD);
  const silver = Math.floor((copper % COPPER_PER_GOLD) / COPPER_PER_SILVER);
  const rest = copper % COPPER_PER_SILVER;

  const parts: string[] = [];
  if (gold > 0) parts.push(`${gold} Vương Miện Vàng`);
  if (silver > 0) parts.push(`${silver} Đồng Bạc`);
  if (rest > 0 || parts.length === 0) parts.push(`${rest} Đồng Đồng`);
  return parts.join(", ");
}

// Dạng viết tắt, dùng cho hiển thị cố định trên header (ví dụ: "3V 5B 20Đ").
export function formatCurrencyShort(copper: number): string {
  const gold = Math.floor(copper / COPPER_PER_GOLD);
  const silver = Math.floor((copper % COPPER_PER_GOLD) / COPPER_PER_SILVER);
  const rest = copper % COPPER_PER_SILVER;

  const parts: string[] = [];
  if (gold > 0) parts.push(`${gold}V`);
  if (silver > 0) parts.push(`${silver}B`);
  if (rest > 0 || parts.length === 0) parts.push(`${rest}Đ`);
  return parts.join(" ");
}

const DAYS_PER_SEASON = 90;
const SEASON_ORDER: Season[] = ["xuan", "ha", "thu", "dong"];

// Lịch mùa đơn giản, tuần hoàn theo số ngày đã trôi qua trong game.
export function getCurrentSeason(day: number): Season {
  const index = Math.floor((day - 1) / DAYS_PER_SEASON) % SEASON_ORDER.length;
  return SEASON_ORDER[index];
}

export interface PriceContext {
  currentSeason: Season;
  nation: string; // quốc gia của địa điểm đang xem giá
  routeDisrupted: boolean; // tuyến thương mại chính của hàng hóa này có đang gián đoạn không
}

// Giá hiện tại = giá cơ bản, điều chỉnh theo mùa vụ, nơi sản xuất, và gián đoạn thương mại.
// Mỗi hệ số đều phản ánh một nguyên nhân cụ thể trong nguyên tắc thiết kế kinh tế.
export function getCurrentPrice(good: Good, context: PriceContext): number {
  let price = good.basePrice;

  const inSeason = good.season === "quanh-nam" || good.season === context.currentSeason;
  price *= inSeason ? 0.85 : 1.3;

  const producedLocally = good.producedAt.includes(context.nation);
  price *= producedLocally ? 0.9 : 1.25;

  if (context.routeDisrupted) {
    price *= 1.6;
  }

  return Math.max(1, Math.round(price));
}

// Một tuyến thương mại được coi là "gián đoạn" đối với một hàng hóa nếu hàng hóa đó
// được sản xuất ở quốc gia nguồn của tuyến và tuyến đang inactive.
export function isRouteDisruptedFor(good: Good, nation: string, routes: TradeRoute[]): boolean {
  return routes.some(
    (route) => !route.active && route.goodsCarried.includes(good.id) && good.producedAt.includes(route.fromNation) && route.toNation === nation,
  );
}
