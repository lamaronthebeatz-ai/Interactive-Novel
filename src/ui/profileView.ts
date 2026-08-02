import type { GameEngine } from "../engine/GameEngine";
import { renderHeader } from "./gameHeader";

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
      </div>
      <footer class="game-footer">
        <button data-action="close-overlay">Quay Lại</button>
      </footer>
    </section>
  `;
}
