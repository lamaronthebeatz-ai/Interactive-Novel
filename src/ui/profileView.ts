import type { GameEngine } from "../engine/GameEngine";
import type { HistoricalNpc, PersistentNpc } from "../engine/npcTypes";
import { renderHeader } from "./gameHeader";

function renderHistoricalCard(npc: HistoricalNpc): string {
  return `
    <div class="npc-card">
      <p class="npc-name">${npc.fullName}</p>
      <p class="npc-meta">${npc.title} · ${npc.house !== "Không có" ? npc.house + " · " : ""}${npc.nation}</p>
      <p class="npc-bio">${npc.biography[0] ?? ""}</p>
    </div>
  `;
}

function renderPersistentCard(npc: PersistentNpc): string {
  const traits = npc.personality.map((trait) => `<span class="trait-tag">${trait}</span>`).join("");
  return `
    <div class="npc-card">
      <p class="npc-name">${npc.firstName} ${npc.lastName}</p>
      <p class="npc-meta">${npc.occupation} · ${npc.residence}</p>
      ${traits ? `<div class="trait-tags">${traits}</div>` : ""}
    </div>
  `;
}

export function renderProfile(engine: GameEngine): string {
  const p = engine.getProtagonist();

  const statRows = p.stats
    .map(
      (stat) => `
        <div class="stat-row">
          <span class="stat-label">${stat.label}</span>
          <div class="stat-bar"><div class="stat-fill" style="width: ${stat.value}%"></div></div>
          <span class="stat-value">${stat.value}</span>
        </div>
      `,
    )
    .join("");

  const traitTags = p.personality.map((trait) => `<span class="trait-tag">${trait}</span>`).join("");

  const strengthItems = p.strengths.map((s) => `<li>${s}</li>`).join("");
  const weaknessItems = p.weaknesses.map((w) => `<li>${w}</li>`).join("");

  const backgroundParagraphs = p.background.map((paragraph) => `<p>${paragraph}</p>`).join("");

  const historicalCards = engine.getHistoricalNpcs().map(renderHistoricalCard).join("");

  const knownNpcs = engine.getKnownPersistentNpcs();
  const knownNpcsSection = knownNpcs.length
    ? knownNpcs.map(renderPersistentCard).join("")
    : `<p class="empty-hint">Bạn chưa quen biết ai trong tầng lớp thường dân của Aldemark.</p>`;

  return `
    <section class="screen game-screen">
      ${renderHeader(engine)}
      <div class="content">
        <div class="profile-header">
          <h2 class="location-name">${p.name}</h2>
          <div class="profile-facts">
            <span><strong>Tuổi:</strong> ${p.age}</span>
            <span><strong>Nghề nghiệp:</strong> ${p.occupation}</span>
            <span><strong>Gia tộc:</strong> ${p.house}</span>
            <span><strong>Địa vị:</strong> ${p.status}</span>
          </div>
        </div>

        <div>
          <h3 class="section-title">Chỉ số</h3>
          <div class="stat-list">${statRows}</div>
        </div>

        <div>
          <h3 class="section-title">Tính cách</h3>
          <div class="trait-tags">${traitTags}</div>
        </div>

        <div class="strengths-weaknesses">
          <div>
            <h3 class="section-title">Điểm mạnh</h3>
            <ul class="trait-list">${strengthItems}</ul>
          </div>
          <div>
            <h3 class="section-title">Điểm yếu</h3>
            <ul class="trait-list">${weaknessItems}</ul>
          </div>
        </div>

        <div>
          <h3 class="section-title">Tiểu sử</h3>
          <div class="narrative-text background-text">${backgroundParagraphs}</div>
        </div>

        <div>
          <h3 class="section-title">Danh Nhân Aldemark</h3>
          <div class="npc-card-list">${historicalCards}</div>
        </div>

        <div>
          <h3 class="section-title">Người Quen</h3>
          <div class="npc-card-list">${knownNpcsSection}</div>
        </div>
      </div>
      <footer class="game-footer">
        <button data-action="close-overlay">Quay Lại</button>
      </footer>
    </section>
  `;
}
