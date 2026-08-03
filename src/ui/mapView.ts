import type { GameEngine } from "../engine/GameEngine";
import { renderHeader } from "./gameHeader";

export function renderMap(engine: GameEngine): string {
  const worldIndex = engine.getWorldIndex();
  const currentLocationId = engine.state.currentLocationId;

  const locationCards = engine
    .getAllLocations()
    .map((location) => {
      const here = location.id === currentLocationId ? " 📍 (bạn đang ở đây)" : "";
      return `
        <div class="npc-card">
          <p class="npc-name">${location.name}${here}</p>
          <p class="npc-meta">${location.type} · ${location.nation}</p>
        </div>
      `;
    })
    .join("");

  const nationCards = worldIndex.nations
    .map(
      (nation) => `
        <div class="npc-card">
          <p class="npc-name">${nation.name}</p>
          <p class="npc-meta">${nation.type}</p>
          <p class="npc-bio">${nation.blurb}</p>
        </div>
      `,
    )
    .join("");

  const simpleList = (entries: { name: string; blurb: string }[]) =>
    `<ul class="trait-list">${entries.map((e) => `<li><strong>${e.name}</strong> — ${e.blurb}</li>`).join("")}</ul>`;

  return `
    <section class="screen game-screen">
      ${renderHeader(engine)}
      <div class="content">
        <h2 class="location-name">Bản Đồ — ${worldIndex.continent}</h2>

        <div>
          <h3 class="section-title">Địa Điểm</h3>
          <div class="npc-card-list">${locationCards}</div>
        </div>

        <div>
          <h3 class="section-title">Quốc Gia</h3>
          <div class="npc-card-list">${nationCards}</div>
        </div>

        <div>
          <h3 class="section-title">Đường Lớn</h3>
          ${simpleList(worldIndex.majorRoads)}
        </div>

        <div>
          <h3 class="section-title">Rừng</h3>
          ${simpleList(worldIndex.forests)}
        </div>

        <div>
          <h3 class="section-title">Núi</h3>
          ${simpleList(worldIndex.mountains)}
        </div>

        <div>
          <h3 class="section-title">Sông</h3>
          ${simpleList(worldIndex.rivers)}
        </div>
      </div>
      <footer class="game-footer">
        <button data-action="close-overlay">Quay Lại</button>
      </footer>
    </section>
  `;
}
