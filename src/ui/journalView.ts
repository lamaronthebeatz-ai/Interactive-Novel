import type { GameEngine } from "../engine/GameEngine";
import { renderHeader } from "./gameHeader";

export function renderJournal(engine: GameEngine): string {
  const entries = engine.state.journal;

  const list =
    entries.length > 0
      ? entries
          .map(
            (entry) => `
              <li class="journal-entry">
                <span class="journal-time">Ngày ${entry.day}, ${entry.time}</span>
                <p>${entry.text}</p>
              </li>
            `,
          )
          .join("")
      : `<p class="empty-hint">Nhật ký còn trống.</p>`;

  return `
    <section class="screen game-screen">
      ${renderHeader(engine)}
      <div class="content">
        <h2>Nhật Ký</h2>
        <ul class="journal-list">${list}</ul>
      </div>
      <footer class="game-footer">
        <button data-action="close-overlay">Quay Lại</button>
      </footer>
    </section>
  `;
}
