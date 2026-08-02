// Đăng ký toàn bộ nội dung game tại một nơi duy nhất.
// Thêm địa điểm / NPC / hội thoại mới: tạo file JSON rồi import + đăng ký ở đây.
//
// Nội dung địa điểm/NPC/hội thoại chính thức đang được xây dựng trên nền
// World Bible (xem lore/). Nhân vật chính đã có: Lamar von Berg.

import type { CharacterProfile, Dialogue, GameLocation, NPC } from "../engine/types";

import character from "./character.json";

export const locations: Record<string, GameLocation> = {};

export const npcs: Record<string, NPC> = {};

export const dialogues: Record<string, Dialogue> = {};

export const STARTING_LOCATION_ID = "";

export const protagonist: CharacterProfile = character as CharacterProfile;
