import type { GameTime } from "./types";

const MINUTES_PER_DAY = 24 * 60;

export function advanceTime(time: GameTime, minutes: number): GameTime {
  let totalMinutes = time.day * MINUTES_PER_DAY + time.minutesOfDay + minutes;
  const day = Math.floor(totalMinutes / MINUTES_PER_DAY);
  const minutesOfDay = totalMinutes % MINUTES_PER_DAY;
  return { day, minutesOfDay };
}

export function formatClock(minutesOfDay: number): string {
  const h = Math.floor(minutesOfDay / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutesOfDay % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function formatTime(time: GameTime): string {
  return `Ngày ${time.day}, ${formatClock(time.minutesOfDay)}`;
}

export function getTimePeriodLabel(minutesOfDay: number): string {
  const hour = Math.floor(minutesOfDay / 60);
  if (hour >= 5 && hour < 11) return "Buổi sáng";
  if (hour >= 11 && hour < 13) return "Buổi trưa";
  if (hour >= 13 && hour < 18) return "Buổi chiều";
  if (hour >= 18 && hour < 22) return "Buổi tối";
  return "Đêm khuya";
}
