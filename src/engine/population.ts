// Population System — sinh NPC Tầng III (quần chúng) khi cần, không lưu trữ riêng lẻ.
// Dữ liệu nguồn (tên, nghề nghiệp theo loại địa điểm, hành vi) nằm trong
// src/data/population-templates.json — engine không hardcode tên hay nghề nghiệp.

import templates from "../data/population-templates.json";
import type { DynamicNpc, Gender } from "./npcTypes";

export type LocationType = keyof typeof templates.occupationsByLocationType;

let dynamicNpcCounter = 0;

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomGender(): Gender {
  return Math.random() < 0.5 ? "Nam" : "Nữ";
}

function randomAge(): number {
  return 16 + Math.floor(Math.random() * 60);
}

export function generateDynamicNpc(locationType: LocationType, residence: string): DynamicNpc {
  dynamicNpcCounter += 1;
  const gender = randomGender();
  const occupation = pickRandom(templates.occupationsByLocationType[locationType]);
  const behavior = pickRandom(templates.behaviors);

  return {
    id: `dyn-${Date.now()}-${dynamicNpcCounter}`,
    tier: "dynamic",
    gender,
    age: randomAge(),
    occupation,
    residence,
    behavior,
  };
}

export function generateName(gender: Gender): { firstName: string; lastName: string } {
  const firstNamePool = gender === "Nam" ? templates.firstNamesMale : templates.firstNamesFemale;
  return {
    firstName: pickRandom(firstNamePool),
    lastName: pickRandom(templates.lastNames),
  };
}
