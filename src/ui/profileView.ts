import type { GameEngine } from "../engine/GameEngine";
import type { HistoricalNpc, PersistentNpc } from "../engine/npcTypes";
import { DIMENSION_LABELS, MARITAL_STATUS_LABELS, RELATIONSHIP_ROLE_LABELS } from "../engine/relationshipTypes";
import {
  CRIME_STATUS_LABELS,
  CRIME_TYPE_LABELS,
  INFLUENCE_LABELS,
  LOYALTY_STANCE_LABELS,
} from "../engine/politicsTypes";
import type { InfluenceStats } from "../engine/politicsTypes";
import { renderHeader } from "./gameHeader";

function renderRelationshipInfo(engine: GameEngine, npcId: string): string {
  const relationship = engine.getRelationship(npcId);
  if (!relationship) return "";

  const roleTags = relationship.roles
    .map((role) => `<span class="trait-tag">${RELATIONSHIP_ROLE_LABELS[role]}</span>`)
    .join("");

  const dimensionLine = (Object.keys(DIMENSION_LABELS) as (keyof typeof DIMENSION_LABELS)[])
    .map((key) => `${DIMENSION_LABELS[key]} ${relationship.dimensions[key]}`)
    .join(" · ");

  return `
    ${roleTags ? `<div class="trait-tags">${roleTags}</div>` : ""}
    <p class="npc-meta">${dimensionLine}</p>
  `;
}

function renderHistoricalCard(engine: GameEngine, npc: HistoricalNpc): string {
  return `
    <div class="npc-card">
      <p class="npc-name">${npc.fullName}</p>
      <p class="npc-meta">${npc.title} · ${npc.house !== "Không có" ? npc.house + " · " : ""}${npc.nation}</p>
      <p class="npc-bio">${npc.biography[0] ?? ""}</p>
      ${renderRelationshipInfo(engine, npc.id)}
    </div>
  `;
}

function renderPersistentCard(engine: GameEngine, npc: PersistentNpc): string {
  const traits = npc.personality.map((trait) => `<span class="trait-tag">${trait}</span>`).join("");
  return `
    <div class="npc-card">
      <p class="npc-name">${npc.firstName} ${npc.lastName}</p>
      <p class="npc-meta">${npc.occupation} · ${npc.residence}</p>
      ${traits ? `<div class="trait-tags">${traits}</div>` : ""}
      ${renderRelationshipInfo(engine, npc.id)}
    </div>
  `;
}

function renderInfluenceRows(influence: InfluenceStats): string {
  return (Object.keys(INFLUENCE_LABELS) as (keyof InfluenceStats)[])
    .map((key) => {
      const value = influence[key];
      const width = Math.max(0, Math.min(100, value));
      return `
        <div class="stat-row">
          <span class="stat-label">${INFLUENCE_LABELS[key]}</span>
          <div class="stat-bar"><div class="stat-fill" style="width: ${width}%"></div></div>
          <span class="stat-value">${value}</span>
        </div>
      `;
    })
    .join("");
}

function renderReputationSection(engine: GameEngine): string {
  const entries = Object.values(engine.state.reputation);
  if (entries.length === 0) {
    return `<p class="empty-hint">Lamar chưa được biết đến ở đâu ngoài gia tộc của mình.</p>`;
  }
  return entries
    .map((entry) => {
      const width = Math.max(0, Math.min(100, (entry.value + 100) / 2));
      return `
        <div class="stat-row">
          <span class="stat-label">${entry.targetName}</span>
          <div class="stat-bar"><div class="stat-fill" style="width: ${width}%"></div></div>
          <span class="stat-value">${entry.value}</span>
        </div>
      `;
    })
    .join("");
}

function renderFactionCard(engine: GameEngine, factionId: string): string {
  const faction = engine.getFaction(factionId);
  if (!faction) return "";
  const loyalty = engine.getLoyalty(factionId);
  const loyaltyTag = loyalty ? `<span class="trait-tag">${LOYALTY_STANCE_LABELS[loyalty.stance]}</span>` : "";
  const goalTags = faction.goals.map((g) => `<span class="trait-tag">${g}</span>`).join("");
  return `
    <div class="npc-card">
      <p class="npc-name">${faction.name}</p>
      <p class="npc-meta">Lãnh đạo: ${faction.leader} · Trụ sở: ${faction.headquarters}</p>
      ${loyaltyTag ? `<div class="trait-tags">${loyaltyTag}</div>` : ""}
      ${goalTags ? `<div class="trait-tags">${goalTags}</div>` : ""}
    </div>
  `;
}

function renderTitlesSection(engine: GameEngine): string {
  const titles = engine.getPlayerTitles();
  if (titles.length === 0) {
    return `<p class="empty-hint">Lamar chưa được phong tước vị nào.</p>`;
  }
  return `<div class="trait-tags">${titles.map((t) => `<span class="trait-tag">${t.name}</span>`).join("")}</div>`;
}

function renderCrimeSection(engine: GameEngine): string {
  const records = engine.getCrimeRecords();
  if (records.length === 0) {
    return `<p class="empty-hint">Lamar chưa có tiền án nào.</p>`;
  }
  return records
    .map(
      (record) => `
        <div class="npc-card">
          <p class="npc-name">${CRIME_TYPE_LABELS[record.crimeType]} — ${record.nation}</p>
          <p class="npc-meta">Ngày ${record.day} · ${CRIME_STATUS_LABELS[record.status]}</p>
          <p class="npc-bio">${record.description}</p>
        </div>
      `,
    )
    .join("");
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

  const historicalCards = engine
    .getHistoricalNpcs()
    .map((npc) => renderHistoricalCard(engine, npc))
    .join("");

  const knownNpcs = engine.getKnownPersistentNpcs();
  const knownNpcsSection = knownNpcs.length
    ? knownNpcs.map((npc) => renderPersistentCard(engine, npc)).join("")
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
            <span><strong>Hôn nhân:</strong> ${MARITAL_STATUS_LABELS[engine.state.maritalStatus]}</span>
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

        <div>
          <h3 class="section-title">Danh Hiệu</h3>
          ${renderTitlesSection(engine)}
        </div>

        <div>
          <h3 class="section-title">Uy Tín & Ảnh Hưởng</h3>
          <div class="stat-list">${renderInfluenceRows(engine.getInfluence())}</div>
        </div>

        <div>
          <h3 class="section-title">Danh Tiếng</h3>
          <div class="stat-list">${renderReputationSection(engine)}</div>
        </div>

        <div>
          <h3 class="section-title">Phe Phái Aldemark</h3>
          <div class="npc-card-list">${engine.getFactions().map((f) => renderFactionCard(engine, f.id)).join("")}</div>
        </div>

        <div>
          <h3 class="section-title">Hồ Sơ Pháp Lý</h3>
          <div class="npc-card-list">${renderCrimeSection(engine)}</div>
        </div>
      </div>
      <footer class="game-footer">
        <button data-action="close-overlay">Quay Lại</button>
      </footer>
    </section>
  `;
}
