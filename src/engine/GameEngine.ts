import { cityEconomies, dialogues, goods, historicalNpcs, locations, persistentNpcs, protagonist, shops, STARTING_LOCATION_ID, supplyChains, taxes, tradeRoutes, worldIndex } from "../data";
import { SaveManager } from "./SaveManager";
import { advanceTime, formatClock } from "./time";
import { promoteToPersistent } from "./npcPromotion";
import { generateDynamicNpc as generateDynamicNpcFromPopulation } from "./population";
import { getCurrentActivity, getNpcDisplayName } from "./npcTypes";
import { formatCurrency, getCurrentPrice, getCurrentSeason, isRouteDisruptedFor } from "./economy";
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
import type { CityEconomy, Good, Shop, SupplyChain, Tax, TradeRoute } from "./economyTypes";

function createInitialState(): GameState {
  return {
    currentLocationId: STARTING_LOCATION_ID,
    time: { day: 1, minutesOfDay: 6 * 60 },
    inventory: [],
    journal: [],
    flags: {},
    knownNpcIds: [],
    promotedNpcs: [],
    currency: protagonist.startingCurrency,
    shops: JSON.parse(JSON.stringify(shops)),
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

  openMarket(shopId: string): void {
    if (!this.state.shops[shopId]) return;
    this.previousScreen = this.isOverlayScreen(this.screen) ? this.previousScreen : this.screen;
    this.state.activeShopId = shopId;
    this.screen = "market";
    this.notify();
  }

  private isOverlayScreen(screen: Screen): boolean {
    return (
      screen === "journal" ||
      screen === "inventory" ||
      screen === "profile" ||
      screen === "map" ||
      screen === "market"
    );
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

  // ---------- Hệ thống kinh tế ----------

  getGoods(): Good[] {
    return goods;
  }

  getSupplyChains(): SupplyChain[] {
    return supplyChains;
  }

  getGood(goodId: string): Good | undefined {
    return goods.find((g) => g.id === goodId);
  }

  getTaxes(): Tax[] {
    return taxes;
  }

  getTradeRoutes(): TradeRoute[] {
    return tradeRoutes;
  }

  getCityEconomy(nation: string): CityEconomy | undefined {
    return cityEconomies.find((c) => c.nation === nation);
  }

  getShop(shopId: string): Shop | undefined {
    return this.state.shops[shopId];
  }

  getShopsAtLocation(locationId: string): Shop[] {
    return Object.values(this.state.shops).filter((s) => s.locationId === locationId);
  }

  getActiveShop(): Shop | undefined {
    return this.state.activeShopId ? this.state.shops[this.state.activeShopId] : undefined;
  }

  // Giá hiện tại của một hàng hóa tại địa điểm người chơi đang đứng — phụ thuộc mùa vụ,
  // nơi sản xuất, và tình trạng gián đoạn tuyến thương mại. Không có giá cố định mãi mãi.
  getGoodPrice(good: Good): number {
    const nation = this.getCurrentLocation()?.nation ?? "";
    const season = getCurrentSeason(this.state.time.day);
    const routeDisrupted = isRouteDisruptedFor(good, nation, tradeRoutes);
    return getCurrentPrice(good, { currentSeason: season, nation, routeDisrupted });
  }

  buyGood(shopId: string, goodId: string, quantity: number): void {
    const shop = this.state.shops[shopId];
    const good = this.getGood(goodId);
    if (!shop || !good || quantity <= 0) return;

    const stockEntry = shop.stock.find((s) => s.goodId === goodId);
    if (!stockEntry || stockEntry.quantity < quantity) {
      this.flashMessage("Cửa hàng không còn đủ hàng.");
      return;
    }

    const totalPrice = Math.round(this.getGoodPrice(good) * stockEntry.priceModifier * quantity);
    if (this.state.currency < totalPrice) {
      this.flashMessage("Không đủ tiền.");
      return;
    }

    this.state.currency -= totalPrice;
    stockEntry.quantity -= quantity;
    this.addItem(good.id, good.name, `${good.name}, mua tại ${shop.name}.`, quantity);
    this.addJournalEntry(`Mua ${quantity} ${good.unit} ${good.name} tại ${shop.name} với giá ${formatCurrency(totalPrice)}.`);
    this.notify();
  }

  sellGood(shopId: string, goodId: string, quantity: number): void {
    const shop = this.state.shops[shopId];
    const good = this.getGood(goodId);
    const item = this.state.inventory.find((i) => i.id === goodId);
    if (!shop || !good || !item || item.quantity < quantity || quantity <= 0) return;

    const sellPrice = Math.round(this.getGoodPrice(good) * 0.7 * quantity);
    item.quantity -= quantity;
    if (item.quantity <= 0) {
      this.state.inventory = this.state.inventory.filter((i) => i.id !== goodId);
    }

    const stockEntry = shop.stock.find((s) => s.goodId === goodId);
    if (stockEntry) {
      stockEntry.quantity += quantity;
    } else {
      shop.stock.push({ goodId, quantity, priceModifier: 1 });
    }

    this.state.currency += sellPrice;
    this.addJournalEntry(`Bán ${quantity} ${good.unit} ${good.name} tại ${shop.name}, nhận ${formatCurrency(sellPrice)}.`);
    this.notify();
  }

  // Thuế cố định (isPercentage=false) trả đúng mức rate. Thuế phần trăm cần baseAmount
  // (giá trị giao dịch/tài sản làm nền) để tính — hệ thống tồn tại đầy đủ, chưa cần gắn
  // vào một điểm gameplay cụ thể nào (ví dụ trạm thu phí) ở build này.
  payTax(taxId: string, baseAmount = 0): void {
    const tax = taxes.find((t) => t.id === taxId);
    if (!tax) return;

    const amount = tax.isPercentage ? Math.round((baseAmount * tax.rate) / 100) : tax.rate;
    if (this.state.currency < amount) {
      this.flashMessage("Không đủ tiền nộp thuế.");
      return;
    }

    this.state.currency -= amount;
    this.addJournalEntry(`Nộp ${tax.name}: ${formatCurrency(amount)}.`);
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
