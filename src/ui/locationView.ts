import type { GameEngine } from "../engine/GameEngine";
import { getNpcDisplayName } from "../engine/npcTypes";
import { renderFooter, renderHeader, renderMessage } from "./gameHeader";

function renderEmptyWorld(engine: GameEngine): string {
  return `
    <section class="screen game-screen">
      ${renderHeader(engine)}
      <div class="content">
        <p class="empty-hint">Thế giới đang được xây dựng. Nội dung sẽ sớm xuất hiện ở đây.</p>
      </div>
      ${renderFooter()}
      ${renderMessage(engine)}
    </section>
  `;
}

export function renderLocation(engine: GameEngine): string {
  const location = engine.getCurrentLocation();
  if (!location) return renderEmptyWorld(engine);

  const npcButtons = location.npcs
    .map((npcId) => engine.getAnyNpc(npcId))
    .filter((npc) => npc !== undefined)
    .map((npc) => {
      const activity = engine.getNpcCurrentActivity(npc);
      return `<button data-action="talk-npc" data-npc-id="${npc.id}">Nói chuyện với ${getNpcDisplayName(npc)} <span class="npc-activity">(${activity})</span></button>`;
    })
    .join("");

  const actionButtons = (location.actions ?? [])
    .filter((action) => engine.isLocationActionAvailable(action))
    .map(
      (action) =>
        `<button data-action="location-action" data-action-id="${action.id}">${action.text}</button>`,
    )
    .join("");

  const shopButtons = engine
    .getShopsAtLocation(location.id)
    .map((shop) => `<button data-action="open-market" data-shop-id="${shop.id}">Vào ${shop.name}</button>`)
    .join("");

  const travelButtons = location.connections
    .map((connection) => {
      const destination = engine.getAllLocations().find((loc) => loc.id === connection.toLocationId);
      if (!destination) return "";
      return `
        <button data-action="travel" data-to="${connection.toLocationId}" data-mode="walk">Đi bộ tới ${destination.name} (${connection.walkMinutes} phút)</button>
        <button data-action="travel" data-to="${connection.toLocationId}" data-mode="horse">Cưỡi ngựa tới ${destination.name} (${connection.horseMinutes} phút)</button>
      `;
    })
    .join("");

  return `
    <section class="screen game-screen">
      ${renderHeader(engine)}
      <div class="content">
        <h2 class="location-name">${location.name}</h2>
        <p class="narrative-text">${location.description}</p>
        <div class="choices">
          ${npcButtons}
          ${actionButtons}
          ${shopButtons}
        </div>
        ${
          location.connections.length
            ? `<div>
                <h3 class="section-title">Di chuyển</h3>
                <div class="choices">${travelButtons}</div>
              </div>`
            : ""
        }
      </div>
      ${renderFooter()}
      ${renderMessage(engine)}
    </section>
  `;
}
