// Promotion System — khi một NPC Tầng III trở nên đáng kể với người chơi
// (kết bạn, kết hôn, tham gia chiến tranh, giữ chức vụ, trở nên quan trọng),
// engine nâng NPC đó lên Tầng II với hồ sơ đầy đủ. Không mất dữ liệu cũ —
// giới tính, tuổi, nghề nghiệp, nơi ở của bản ghi Tầng III được giữ nguyên.

import { generateName } from "./population";
import { UNBUILT } from "./npcTypes";
import type { DynamicNpc, PersistentNpc, PromotionReason, ScheduleEntry } from "./npcTypes";

const GENERIC_SCHEDULE: ScheduleEntry[] = [
  { time: "06:00", activity: "Thức dậy" },
  { time: "07:00", activity: "Ăn sáng" },
  { time: "08:00", activity: "Đi làm" },
  { time: "12:00", activity: "Ăn trưa" },
  { time: "18:00", activity: "Về nhà" },
  { time: "21:00", activity: "Nghỉ ngơi" },
  { time: "22:00", activity: "Ngủ" },
];

export function promoteToPersistent(
  dynamic: DynamicNpc,
  id: string,
  reason: PromotionReason,
): PersistentNpc {
  const { firstName, lastName } = generateName(dynamic.gender);

  return {
    id,
    tier: "persistent",
    firstName,
    lastName,
    age: dynamic.age,
    gender: dynamic.gender,
    nationality: UNBUILT,
    occupation: dynamic.occupation,
    residence: dynamic.residence,
    family: {
      father: UNBUILT,
      mother: UNBUILT,
      siblings: [UNBUILT],
      spouse: UNBUILT,
      children: [UNBUILT],
    },
    friends: [UNBUILT],
    enemies: [UNBUILT],
    income: UNBUILT,
    assets: UNBUILT,
    personality: [],
    likes: [],
    dislikes: [],
    lifeGoal: UNBUILT,
    schedule: GENERIC_SCHEDULE,
    promotedFrom: "dynamic",
    promotionReason: reason,
  };
}
