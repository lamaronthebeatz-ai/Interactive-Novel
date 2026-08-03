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
    .map(
      (npc) =>
        `<button data-action="talk-npc" data-npc-id="${npc.id}">Nói chuyện với ${getNpcDisplayName(npc)}</button>`,
    )
    .join("");

  const actionButtons = (location.actions ?? [])
    .map(
      (action) =>
        `<button data-action="location-action" data-action-id="${action.id}">${action.text}</button>`,
    )
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
        </div>
      </div>
      ${renderFooter()}
      ${renderMessage(engine)}
    </section>
  `;
}
