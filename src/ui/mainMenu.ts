import type { GameEngine } from "../engine/GameEngine";

export function renderMainMenu(engine: GameEngine): string {
  const continueDisabled = engine.hasSave() ? "" : "disabled";

  return `
    <section class="screen menu-screen">
      <h1 class="game-title">Linh Truyện</h1>
      <p class="game-subtitle">Một câu chuyện tương tác</p>
      <nav class="menu-buttons">
        <button data-action="new-game">Chơi Mới</button>
        <button data-action="continue-game" ${continueDisabled}>Tiếp Tục</button>
        <button data-action="load-game" ${continueDisabled}>Tải</button>
      </nav>
    </section>
  `;
}
