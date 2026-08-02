import { dialogues, locations, npcs, STARTING_LOCATION_ID } from "../data";
import { SaveManager } from "./SaveManager";
import { advanceTime, formatClock } from "./time";
import type {
  Dialogue,
  DialogueNode,
  Effect,
  GameLocation,
  GameState,
  NPC,
  Screen,
} from "./types";

function createInitialState(): GameState {
  return {
    currentLocationId: STARTING_LOCATION_ID,
    time: { day: 1, minutesOfDay: 6 * 60 },
    inventory: [],
    journal: [],
    flags: {},
  };
}

export class GameEngine {
  state: GameState = createInitialState();
  screen: Screen = "menu";
  message: string | null = null;

  private previousScreen: Screen = "location";
  private onChange: () => void;

  constructor(onChange: () => void) {
    this.onChange = onChange;
  }

  hasSave(): boolean {
    return SaveManager.hasSave();
  }

  newGame(): void {
    this.state = createInitialState();
    this.screen = "location";
    this.notify();
  }

  continueGame(): void {
    const saved = SaveManager.load();
    if (saved) {
      this.state = saved;
      this.screen = "location";
    }
    this.notify();
  }

  saveGame(): void {
    SaveManager.save(this.state);
    this.flashMessage("Đã lưu trò chơi.");
  }

  loadGame(): void {
    const saved = SaveManager.load();
    if (saved) {
      this.state = saved;
      this.screen = "location";
      this.flashMessage("Đã tải trò chơi.");
    } else {
      this.flashMessage("Chưa có dữ liệu đã lưu.");
    }
  }

  goToMainMenu(): void {
    this.screen = "menu";
    this.notify();
  }

  getCurrentLocation(): GameLocation {
    return locations[this.state.currentLocationId];
  }

  getNPC(npcId: string): NPC {
    return npcs[npcId];
  }

  talkTo(npcId: string): void {
    const npc = npcs[npcId];
    const dialogue = dialogues[npc.dialogueId];
    this.state.activeDialogue = {
      npcId,
      dialogueId: dialogue.id,
      nodeId: dialogue.start,
    };
    this.screen = "dialogue";
    this.notify();
  }

  getActiveDialogueNode(): DialogueNode | null {
    const active = this.state.activeDialogue;
    if (!active) return null;
    const dialogue: Dialogue = dialogues[active.dialogueId];
    return dialogue.nodes[active.nodeId] ?? null;
  }

  chooseDialogueOption(index: number): void {
    const node = this.getActiveDialogueNode();
    const active = this.state.activeDialogue;
    if (!node || !active) return;

    const choice = node.choices[index];
    if (!choice) return;

    if (choice.effects) {
      this.applyEffects(choice.effects);
    }

    if (choice.next) {
      active.nodeId = choice.next;
      this.notify();
    } else {
      this.endDialogue();
    }
  }

  endDialogue(): void {
    this.state.activeDialogue = undefined;
    this.screen = "location";
    this.notify();
  }

  performLocationAction(actionId: string): void {
    const location = this.getCurrentLocation();
    const action = location.actions?.find((a) => a.id === actionId);
    if (!action) return;
    if (action.effects) {
      this.applyEffects(action.effects);
    }
    this.notify();
  }

  openJournal(): void {
    this.previousScreen = this.screen === "journal" || this.screen === "inventory" ? this.previousScreen : this.screen;
    this.screen = "journal";
    this.notify();
  }

  openInventory(): void {
    this.previousScreen = this.screen === "journal" || this.screen === "inventory" ? this.previousScreen : this.screen;
    this.screen = "inventory";
    this.notify();
  }

  closeOverlay(): void {
    this.screen = this.previousScreen;
    this.notify();
  }

  private applyEffects(effects: Effect[]): void {
    for (const effect of effects) {
      switch (effect.type) {
        case "addItem":
          this.addItem(effect.itemId, effect.name, effect.description, effect.quantity ?? 1);
          break;
        case "advanceTime":
          this.state.time = advanceTime(this.state.time, effect.minutes);
          break;
        case "addJournalEntry":
          this.state.journal.push({
            day: this.state.time.day,
            time: formatClock(this.state.time.minutesOfDay),
            text: effect.text,
          });
          break;
        case "setFlag":
          this.state.flags[effect.flag] = effect.value;
          break;
      }
    }
  }

  private addItem(itemId: string, name: string, description: string, quantity: number): void {
    const existing = this.state.inventory.find((i) => i.id === itemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.state.inventory.push({ id: itemId, name, description, quantity });
    }
  }

  private flashMessage(text: string): void {
    this.message = text;
    this.notify();
    setTimeout(() => {
      this.message = null;
      this.notify();
    }, 2000);
  }

  private notify(): void {
    this.onChange();
  }
}
