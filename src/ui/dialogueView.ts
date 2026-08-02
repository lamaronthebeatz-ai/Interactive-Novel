import type { GameEngine } from "../engine/GameEngine";
import { renderHeader, renderMessage } from "./gameHeader";

export function renderDialogue(engine: GameEngine): string {
  const node = engine.getActiveDialogueNode();
  if (!node) return "";

  const speakerLine = node.speaker ? `<p class="speaker-name">${node.speaker}</p>` : "";

  const choiceButtons =
    node.choices.length > 0
      ? node.choices
          .map(
            (choice, index) =>
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
