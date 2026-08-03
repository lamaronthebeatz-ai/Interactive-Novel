import type { GameEngine } from "../engine/GameEngine";
import { formatCurrency } from "../engine/economy";
import { GOODS_CATEGORY_LABELS } from "../engine/economyTypes";
import { renderHeader, renderMessage } from "./gameHeader";

export function renderMarket(engine: GameEngine): string {
  const shop = engine.getActiveShop();

  if (!shop) {
    return `
      <section class="screen game-screen">
        ${renderHeader(engine)}
        <div class="content">
          <p class="empty-hint">Cửa hàng không tồn tại.</p>
        </div>
        <footer class="game-footer">
          <button data-action="close-overlay">Quay Lại</button>
        </footer>
      </section>
    `;
  }

  const stockRows = shop.stock
    .map((entry) => {
      const good = engine.getGood(entry.goodId);
      if (!good) return "";
      const price = Math.round(engine.getGoodPrice(good) * entry.priceModifier);
      const outOfStock = entry.quantity <= 0;
      return `
        <div class="npc-card">
          <p class="npc-name">${good.name}</p>
          <p class="npc-meta">${GOODS_CATEGORY_LABELS[good.category]} · còn ${entry.quantity} ${good.unit} · ${formatCurrency(price)} / ${good.unit}</p>
          <button data-action="buy-good" data-shop-id="${shop.id}" data-good-id="${good.id}" ${outOfStock ? "disabled" : ""}>
            ${outOfStock ? "Đã hết hàng" : `Mua 1 ${good.unit}`}
          </button>
        </div>
      `;
    })
    .join("");

  const sellableItems = engine.state.inventory.filter((item) => engine.getGood(item.id) !== undefined);
  const sellRows = sellableItems
    .map((item) => {
      const good = engine.getGood(item.id);
      if (!good) return "";
      const price = Math.round(engine.getGoodPrice(good) * 0.7);
      return `
        <div class="npc-card">
          <p class="npc-name">${good.name}</p>
          <p class="npc-meta">Bạn có ${item.quantity} ${good.unit} · bán được ${formatCurrency(price)} / ${good.unit}</p>
          <button data-action="sell-good" data-shop-id="${shop.id}" data-good-id="${good.id}">Bán 1 ${good.unit}</button>
        </div>
      `;
    })
    .join("");

  return `
    <section class="screen game-screen">
      ${renderHeader(engine)}
      <div class="content">
        <h2 class="location-name">${shop.name}</h2>

        <div>
          <h3 class="section-title">Hàng Bán</h3>
          <div class="npc-card-list">${stockRows}</div>
        </div>

        ${
          sellableItems.length
            ? `<div>
                <h3 class="section-title">Bán Đồ Của Bạn</h3>
                <div class="npc-card-list">${sellRows}</div>
              </div>`
            : ""
        }
      </div>
      <footer class="game-footer">
        <button data-action="close-overlay">Quay Lại</button>
      </footer>
      ${renderMessage(engine)}
    </section>
  `;
}
