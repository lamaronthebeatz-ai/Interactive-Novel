import { GameEngine } from "./engine/GameEngine";
import { render } from "./ui/render";

const root = document.getElementById("app");
if (!root) {
  throw new Error("Không tìm thấy phần tử #app.");
}

const engine = new GameEngine(() => render(root, engine));

root.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target || target.hasAttribute("disabled")) return;

  const action = target.dataset.action;

  switch (action) {
    case "new-game":
      engine.newGame();
      break;
    case "continue-game":
      engine.continueGame();
      break;
    case "save-game":
      engine.saveGame();
      break;
    case "load-game":
      if (engine.screen === "menu" || confirm("Tải trò chơi đã lưu? Tiến trình hiện tại chưa lưu sẽ bị mất.")) {
        engine.loadGame();
      }
      break;
    case "go-menu":
      engine.goToMainMenu();
      break;
    case "talk-npc":
      if (target.dataset.npcId) engine.talkTo(target.dataset.npcId);
      break;
    case "location-action":
      if (target.dataset.actionId) engine.performLocationAction(target.dataset.actionId);
      break;
    case "dialogue-choice":
      if (target.dataset.index) engine.chooseDialogueOption(Number(target.dataset.index));
      break;
    case "end-dialogue":
      engine.endDialogue();
      break;
    case "open-journal":
      engine.openJournal();
      break;
    case "open-inventory":
      engine.openInventory();
      break;
    case "open-profile":
      engine.openProfile();
      break;
    case "open-map":
      engine.openMap();
      break;
    case "open-market":
      if (target.dataset.shopId) engine.openMarket(target.dataset.shopId);
      break;
    case "buy-good":
      if (target.dataset.shopId && target.dataset.goodId) {
        engine.buyGood(target.dataset.shopId, target.dataset.goodId, 1);
      }
      break;
    case "sell-good":
      if (target.dataset.shopId && target.dataset.goodId) {
        engine.sellGood(target.dataset.shopId, target.dataset.goodId, 1);
      }
      break;
    case "travel":
      if (target.dataset.to && target.dataset.mode) {
        engine.travelTo(target.dataset.to, target.dataset.mode as "walk" | "horse");
      }
      break;
    case "close-overlay":
      engine.closeOverlay();
      break;
  }
});

render(root, engine);
