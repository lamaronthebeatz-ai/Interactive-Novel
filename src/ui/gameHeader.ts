import type { GameEngine } from "../engine/GameEngine";
import { formatTime, getTimePeriodLabel } from "../engine/time";

export function renderHeader(engine: GameEngine): string {
  const { time } = engine.state;
  return `
    <header class="game-header">
      <span class="clock">${formatTime(time)} — ${getTimePeriodLabel(time.minutesOfDay)}</span>
    </header>
  `;
}

export function renderFooter(): string {
  return `
    <footer class="game-footer">
      <button data-action="open-inventory">Kho Đồ</button>
      <button data-action="open-journal">Nhật Ký</button>
      <button data-action="save-game">Lưu</button>
      <button data-action="load-game">Tải</button>
      <button data-action="go-menu">Menu Chính</button>
    </footer>
  `;
}

export function renderMessage(engine: GameEngine): string {
  if (!engine.message) return "";
  return `<div class="toast">${engine.message}</div>`;
}
