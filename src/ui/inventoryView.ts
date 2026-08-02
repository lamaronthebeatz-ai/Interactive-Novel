import type { GameEngine } from "../engine/GameEngine";
import { renderHeader } from "./gameHeader";

export function renderInventory(engine: GameEngine): string {
  const items = engine.state.inventory;

  const list =
    items.length > 0
      ? items
          .map(
            (item) => `
              <li class="inventory-item">
                <span class="item-name">${item.name} <em>x${item.quantity}</em></span>
                <p>${item.description}</p>
              </li>
            `,
          )
          .join("")
      : `<p class="empty-hint">Kho đồ trống.</p>`;

  return `
    <section class="screen game-screen">
      ${renderHeader(engine)}
      <div class="content">
        <h2>Kho Đồ</h2>
        <ul class="inventory-list">${list}</ul>
      </div>
      <footer class="game-footer">
        <button data-action="close-overlay">Quay Lại</button>
      </footer>
    </section>
  `;
}
