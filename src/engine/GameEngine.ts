import { dialogues, historicalNpcs, locations, persistentNpcs, protagonist, STARTING_LOCATION_ID, worldIndex } from "../data";
import { SaveManager } from "./SaveManager";
import { advanceTime, formatClock } from "./time";
import { promoteToPersistent } from "./npcPromotion";
import { generateDynamicNpc as generateDynamicNpcFromPopulation } from "./population";
import { getCurrentActivity, getNpcDisplayName } from "./npcTypes";
import type { LocationType } from "./population";
import type {
  CharacterProfile,
  Dialogue,
  DialogueNode,
  Effect,
  GameLocation,
  GameState,
  Screen,
  WorldIndex,
} from "./types";
import type { DynamicNpc, HistoricalNpc, PersistentNpc, PromotionReason } from "./npcTypes";

function createInitialState(): GameState {
  return {
    currentLocationId: STARTING_LOCATION_ID,
    time: { day: 1, minutesOfDay: 6 * 60 },
    inventory: [],
    journal: [],
    flags: {},
    knownNpcIds: [],
    promotedNpcs: [],
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
    for (const item of protagonist.startingItems) {
      this.addItem(item.id, item.name, item.description, item.quantity);
    }
    this.addJournalEntry(protagonist.openingJournalEntry);
    this.screen = "location";
    this.notify();
  }

  getProtagonist(): CharacterProfile {
    return protagonist;
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

  getCurrentLocation(): GameLocation | undefined {
    return locations[this.state.currentLocationId];
  }

  getAllLocations(): GameLocation[] {
    return Object.values(locations);
  }

  getWorldIndex(): WorldIndex {
    return worldIndex;
  }

  travelTo(toLocationId: string, mode: "walk" | "horse"): void {
    const current = this.getCurrentLocation();
    const destination = locations[toLocationId];
    const connection = current?.connections.find((c) => c.toLocationId === toLocationId);
    if (!current || !destination || !connection) return;

    const minutes = mode === "horse" ? connection.horseMinutes : connection.walkMinutes;
    const modeLabel = mode === "horse" ? "cưỡi ngựa" : "đi bộ";

    this.addJournalEntry(`Lamar rời ${current.name}, ${modeLabel} hướng tới ${destination.name}.`);
    this.state.time = advanceTime(this.state.time, minutes);
    this.state.currentLocationId = toLocationId;
    this.addJournalEntry(`Đến ${destination.name}.`);
    this.notify();
  }

  talkTo(npcId: string): void {
    const npc = this.getAnyNpc(npcId);
    if (!npc?.dialogueId) return;

    const dialogue = dialogues[npc.dialogueId];
    this.state.activeDialogue = {
      npcId,
      dialogueId: dialogue.id,
      nodeId: dialogue.start,
    };
    if (npc.tier === "persistent") {
      this.meetNpc(npcId);
    }
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
    const action = location?.actions?.find((a) => a.id === actionId);
    if (!action) return;
    if (action.effects) {
      this.applyEffects(action.effects);
    }
    this.notify();
  }

  openJournal(): void {
    this.previousScreen = this.isOverlayScreen(this.screen) ? this.previousScreen : this.screen;
    this.screen = "journal";
    this.notify();
  }

  openInventory(): void {
    this.previousScreen = this.isOverlayScreen(this.screen) ? this.previousScreen : this.screen;
    this.screen = "inventory";
    this.notify();
  }

  openProfile(): void {
    this.previousScreen = this.isOverlayScreen(this.screen) ? this.previousScreen : this.screen;
    this.screen = "profile";
    this.notify();
  }

  openMap(): void {
    this.previousScreen = this.isOverlayScreen(this.screen) ? this.previousScreen : this.screen;
    this.screen = "map";
    this.notify();
  }

  private isOverlayScreen(screen: Screen): boolean {
    return screen === "journal" || screen === "inventory" || screen === "profile" || screen === "map";
  }

  closeOverlay(): void {
    this.screen = this.previousScreen;
    this.notify();
  }

  // ---------- Hệ thống NPC ----------

  getHistoricalNpcs(): HistoricalNpc[] {
    return Object.values(historicalNpcs);
  }

  getPersistentNpc(id: string): PersistentNpc | undefined {
    return persistentNpcs[id] ?? this.state.promotedNpcs.find((npc) => npc.id === id);
  }

  getAnyNpc(id: string): HistoricalNpc | PersistentNpc | undefined {
    return historicalNpcs[id] ?? this.getPersistentNpc(id);
  }

  getKnownPersistentNpcs(): PersistentNpc[] {
    return this.state.knownNpcIds
      .map((id) => this.getPersistentNpc(id))
      .filter((npc): npc is PersistentNpc => npc !== undefined);
  }

  meetNpc(npcId: string): void {
    if (!this.state.knownNpcIds.includes(npcId)) {
      this.state.knownNpcIds.push(npcId);
      const npc = this.getAnyNpc(npcId);
      if (npc) {
        this.addJournalEntry(`Gặp ${getNpcDisplayName(npc)}.`);
      }
      this.notify();
    }
  }

  getNpcCurrentActivity(npc: HistoricalNpc | PersistentNpc): string {
    return getCurrentActivity(npc.schedule, this.state.time.minutesOfDay);
  }

  generateDynamicNpc(locationType: LocationType, residence: string): DynamicNpc {
    return generateDynamicNpcFromPopulation(locationType, residence);
  }

  promoteDynamicNpc(dynamic: DynamicNpc, reason: PromotionReason): PersistentNpc {
    const id = `promoted-${dynamic.id}`;
    const persistent = promoteToPersistent(dynamic, id, reason);
    this.state.promotedNpcs.push(persistent);
    this.meetNpc(id);
    return persistent;
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
          this.addJournalEntry(effect.text);
          break;
        case "setFlag":
          this.state.flags[effect.flag] = effect.value;
          break;
      }
    }
  }

  private addJournalEntry(text: string): void {
    this.state.journal.push({
      day: this.state.time.day,
      time: formatClock(this.state.time.minutesOfDay),
      text,
    });
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
