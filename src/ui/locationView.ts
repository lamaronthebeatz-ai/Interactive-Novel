import type { GameEngine } from "../engine/GameEngine";
import { renderFooter, renderHeader, renderMessage } from "./gameHeader";

export function renderLocation(engine: GameEngine): string {
  const location = engine.getCurrentLocation();

  const npcButtons = location.npcs
    .map((npcId) => {
      const npc = engine.getNPC(npcId);
      return `<button data-action="talk-npc" data-npc-id="${npc.id}">Nói chuyện với ${npc.name}</button>`;
    })
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
