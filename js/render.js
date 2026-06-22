window.BeeGodRender = (() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const U = window.BeeGodUtils;

  function updateStatCards(analytics) {
    const cards = $$(".stat-card");

    if (cards[0]) {
      cards[0].querySelector("span").textContent = "Pedidos hoje";
      cards[0].querySelector("strong").textContent = analytics.totals.todayRequests;
    }

    if (cards[1]) {
      cards[1].querySelector("span").textContent = "Músicas tocadas";
      cards[1].querySelector("strong").textContent = analytics.totals.played;
    }

    if (cards[2]) {
      cards[2].querySelector("span").textContent = "Apoios registrados";
      cards[2].querySelector("strong").textContent = analytics.totals.support;
    }

    if (cards[3]) {
      cards[3].querySelector("span").textContent = "Status Firebase";
      cards[3].querySelector("strong").textContent = "Online";
    }
  }

  function createInsightsPanel() {
    let panel = $("#dashboardInsights");
    if (panel) return panel;

    const modules = $(".modules");

    panel = document.createElement("section");
    panel.className = "modules";
    panel.id = "dashboardInsights";

    panel.innerHTML = `
      <div class="section-title">
        <span></span>
        <h2>Inteligência do evento</h2>
      </div>

      <div class="module-grid">
        <article class="module-card">
          <strong>🎵 Música mais pedida</strong>
          <p id="topSong">Carregando...</p>
        </article>

        <article class="module-card">
          <strong>🔥 Pedidos em tempo real</strong>
          <p id="liveRequests">Carregando...</p>
        </article>

        <article class="module-card">
          <strong>💛 Apoios</strong>
          <p id="supportInfo">Carregando...</p>
        </article>

        <article class="module-card">
          <strong>✅ Taxa de aceitação</strong>
          <p id="acceptanceRate">Carregando...</p>
        </article>
      </div>
    `;

    if (modules) {
      modules.insertAdjacentElement("beforebegin", panel);
    } else {
      $("main")?.appendChild(panel);
    }

    return panel;
  }

  function updateInsights(analytics) {
    createInsightsPanel();

    const topSong = $("#topSong");
    const liveRequests = $("#liveRequests");
    const supportInfo = $("#supportInfo");
    const acceptanceRate = $("#acceptanceRate");

    if (topSong) {
      topSong.textContent = analytics.topSong
        ? `${analytics.topSong.label} • ${analytics.topSong.count} pedido${analytics.topSong.count > 1 ? "s" : ""}`
        : "Nenhuma música pedida ainda.";
    }

    if (liveRequests) {
      liveRequests.textContent = `${analytics.totals.allRequests} pedido${analytics.totals.allRequests !== 1 ? "s" : ""} registrados na plataforma.`;
    }

    if (supportInfo) {
      supportInfo.textContent = analytics.totals.support
        ? `${analytics.totals.support} apoio${analytics.totals.support > 1 ? "s" : ""} registrado${analytics.totals.support > 1 ? "s" : ""}.`
        : "Nenhum apoio registrado ainda.";
    }

    if (acceptanceRate) {
      acceptanceRate.textContent = `${analytics.rates.accepted}% dos pedidos aceitos ou tocados.`;
    }
  }

  function renderDashboard(analytics) {
    updateStatCards(analytics);
    updateInsights(analytics);
  }

  return { renderDashboard };
})();