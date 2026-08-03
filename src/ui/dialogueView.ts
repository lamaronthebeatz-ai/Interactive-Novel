import type { GameEngine } from "../engine/GameEngine";
import { renderHeader, renderMessage } from "./gameHeader";

export function renderDialogue(engine: GameEngine): string {
  const node = engine.getActiveDialogueNode();
  if (!node) return "";

  const speakerLine = node.speaker ? `<p class="speaker-name">${node.speaker}</p>` : "";

  const npcId = engine.state.activeDialogue?.npcId;
  const trust = npcId ? (engine.getRelationship(npcId)?.dimensions.trust ?? 0) : 0;

  // Lựa chọn có requiresTrust chỉ hiện khi mức tin tưởng với NPC đủ ngưỡng —
  // người tin tưởng người chơi mới sẵn sàng tiết lộ thêm. Giữ nguyên chỉ số gốc
  // trong node.choices vì engine chọn theo index đó.
  const visibleChoices = node.choices
    .map((choice, index) => ({ choice, index }))
    .filter(({ choice }) => choice.requiresTrust === undefined || trust >= choice.requiresTrust);

  const choiceButtons =
    visibleChoices.length > 0
      ? visibleChoices
          .map(
            ({ choice, index }) =>
              `<button data-action="dialogue-choice" data-index="${index}">${choice.text}</button>`,
          )
          .join("")
      : `<button data-action="end-dialogue">Rời đi</button>`;

  return `
    <section class="screen game-screen">
      ${renderHeader(engine)}
      <div class="content">
        <div class="dialogue-box">
          ${speakerLine}
          <p class="dialogue-text">${node.text}</p>
        </div>
        <div class="choices">
          ${choiceButtons}
        </div>
      </div>
      ${renderMessage(engine)}
    </section>
  `;
}
