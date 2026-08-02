// Đăng ký toàn bộ nội dung game tại một nơi duy nhất.
// Thêm địa điểm / NPC / hội thoại mới: tạo file JSON rồi import + đăng ký ở đây.
//
// Hiện chưa có nội dung chính thức — nền móng thế giới đang được xây dựng
// trong thư mục lore/. Engine vẫn chạy bình thường với dữ liệu rỗng.

import type { Dialogue, GameLocation, NPC } from "../engine/types";

export const locations: Record<string, GameLocation> = {};

export const npcs: Record<string, NPC> = {};

export const dialogues: Record<string, Dialogue> = {};

export const STARTING_LOCATION_ID = "";
