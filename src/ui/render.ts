import type { GameEngine } from "../engine/GameEngine";
import { renderDialogue } from "./dialogueView";
import { renderInventory } from "./inventoryView";
import { renderJournal } from "./journalView";
import { renderLocation } from "./locationView";
import { renderMainMenu } from "./mainMenu";
import { renderMap } from "./mapView";
import { renderProfile } from "./profileView";

export function render(root: HTMLElement, engine: GameEngine): void {
  switch (engine.screen) {
    case "menu":
      root.innerHTML = renderMainMenu(engine);
      break;
    case "location":
      root.innerHTML = renderLocation(engine);
      break;
    case "dialogue":
      root.innerHTML = renderDialogue(engine);
      break;
    case "journal":
      root.innerHTML = renderJournal(engine);
      break;
    case "inventory":
      root.innerHTML = renderInventory(engine);
      break;
    case "profile":
      root.innerHTML = renderProfile(engine);
      break;
    case "map":
      root.innerHTML = renderMap(engine);
      break;
  }
}
