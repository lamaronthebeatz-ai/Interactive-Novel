// Hệ thống kinh tế. Toàn bộ nội dung (hàng hóa, chuỗi cung ứng, tuyến thương mại,
// cửa hàng, thuế) nằm trong JSON — engine không hardcode giá, hàng hóa, hay cửa hàng.

// ---------- Tiền tệ ----------
// Mọi giá trị tiền tệ trong engine được lưu dưới dạng số nguyên Đồng Đồng
// (đơn vị nhỏ nhất) để tránh sai số thập phân. formatCurrency() quy đổi hiển thị.
//
// 1 Vương Miện Vàng = 10 Đồng Bạc = 100 Đồng Đồng

export const COPPER_PER_SILVER = 10;
export const SILVER_PER_GOLD = 10;
export const COPPER_PER_GOLD = COPPER_PER_SILVER * SILVER_PER_GOLD;

// ---------- Hàng hóa ----------

export type GoodsCategory = "luong-thuc" | "nguyen-lieu" | "trang-bi" | "gia-dung" | "xa-xi";

export const GOODS_CATEGORY_LABELS: Record<GoodsCategory, string> = {
  "luong-thuc": "Lương thực",
  "nguyen-lieu": "Nguyên liệu",
  "trang-bi": "Trang bị",
  "gia-dung": "Gia dụng",
  "xa-xi": "Xa xỉ",
};

export type Rarity = "pho-bien" | "khong-pho-bien" | "hiem" | "rat-hiem";

export const RARITY_LABELS: Record<Rarity, string> = {
  "pho-bien": "Phổ biến",
  "khong-pho-bien": "Không phổ biến",
  hiem: "Hiếm",
  "rat-hiem": "Rất hiếm",
};

export type Season = "xuan" | "ha" | "thu" | "dong" | "quanh-nam";

export const SEASON_LABELS: Record<Season, string> = {
  xuan: "Mùa xuân",
  ha: "Mùa hạ",
  thu: "Mùa thu",
  dong: "Mùa đông",
  "quanh-nam": "Quanh năm",
};

export interface Good {
  id: string;
  name: string;
  category: GoodsCategory;
  basePrice: number; // đơn vị: Đồng Đồng
  unit: string; // "ổ", "giạ", "kg", "thanh"...
  weight: number; // kg mỗi đơn vị
  producedAt: string[]; // tên quốc gia/vùng sản xuất (World Bible)
  consumedAt: string[]; // tên quốc gia/vùng tiêu thụ chính
  season: Season;
  rarity: Rarity;
  perishable: boolean;
}

// ---------- Chuỗi cung ứng ----------

export interface SupplyChainStage {
  profession: string; // "Nông dân", "Thợ xay"...
  inputGoodId?: string; // nguyên liệu đầu vào, nếu có
  outputGoodId: string; // sản phẩm tạo ra
}

export interface SupplyChain {
  id: string;
  name: string;
  stages: SupplyChainStage[];
}

// ---------- Tuyến thương mại ----------

export interface TradeRoute {
  id: string;
  name: string;
  fromNation: string;
  toNation: string;
  goodsCarried: string[]; // id hàng hóa
  transportMode: string; // "Xe ngựa", "Tàu buôn"...
  distanceDays: number;
  active: boolean; // chiến tranh có thể làm gián đoạn (đặt false)
  disruptionReason?: string;
}

// ---------- Kinh tế thành phố/quốc gia ----------

export interface CityEconomy {
  nation: string;
  exports: string[]; // id hàng hóa xuất khẩu chính
  imports: string[]; // id hàng hóa nhập khẩu chính
}

// ---------- Cửa hàng ----------

export interface ShopStockEntry {
  goodId: string;
  quantity: number; // số lượng còn trong kho — không vô hạn
  priceModifier: number; // hệ số nhân thêm so với giá thị trường, mặc định 1.0
}

export interface Shop {
  id: string;
  name: string;
  locationId: string;
  merchantNpcId?: string;
  stock: ShopStockEntry[];
}

// ---------- Thuế ----------

export type TaxType = "thue-dat" | "thue-thuong-mai" | "thue-cau" | "thue-cang" | "thue-cho";

export const TAX_TYPE_LABELS: Record<TaxType, string> = {
  "thue-dat": "Thuế đất",
  "thue-thuong-mai": "Thuế thương mại",
  "thue-cau": "Thuế cầu",
  "thue-cang": "Thuế cảng",
  "thue-cho": "Thuế chợ",
};

export interface Tax {
  id: string;
  type: TaxType;
  name: string;
  rate: number; // phần trăm nếu isPercentage, ngược lại là số Đồng Đồng cố định
  isPercentage: boolean;
  appliesTo: string;
  collectedBy: string;
}
