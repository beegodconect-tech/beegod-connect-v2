// BeeGod Connect — Dashboard Data
// Consome Firestore em tempo real e atualiza os cards do Dashboard.

(function () {
  const state = {
    requests: [],
    dedications: [],
    support: []
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  function getDB() {
    if (!window.BeeGodFirestore) {
      console.warn("BeeGodFirestore não encontrado.");
      return null;
    }

    return window.BeeGodFirestore.init();
  }

  function toDate(item) {
    if (item.createdAt?.toDate) return item.createdAt.toDate();
    if (item.createdAtLocal) return new Date(item.createdAtLocal);
    return null;
  }

  function isToday(item) {
    const date = toDate(item);
    if (!date || isNaN(date)) return false;

    const now = new Date();

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  function normalizeStatus(status) {
    return String(status || "pendente").toLowerCase();
  }

  function updateStatCards() {
    const cards = $$(".stat-card");

    const allRequests = [...state.requests, ...state.dedications];
    const todayRequests = allRequests.filter(isToday);
    const playedSongs = allRequests.filter((item) => {
      const status = normalizeStatus(item.status);
      return status === "tocado" || status === "played";
    });

    const supportCount = state.support.length;

    if (cards[0]) {
      cards[0].querySelector("strong").textContent = todayRequests.length;
    }

    if (cards[1]) {
      cards[1].querySelector("strong").textContent = playedSongs.length;
    }

    if (cards[2]) {
      cards[2].querySelector("strong").textContent = supportCount;
      cards[2].querySelector("span").textContent = "Apoios registrados";
    }

    if (cards[3]) {
      cards[3].querySelector("strong").textContent = "Online";
      cards[3].querySelector("span").textContent = "Status Firebase";
    }
  }

  function getTopSong() {
    const allRequests = [...state.requests, ...state.dedications];

    const map = {};

    allRequests.forEach((item) => {
      const song = String(item.song || "").trim();
      if (!song) return;

      const key = song.toLowerCase();

      if (!map[key]) {
        map[key] = {
          song,
          count: 0
        };
      }

      map[key].count += 1;
    });

    return Object.values(map).sort((a, b) => b.count - a.count)[0] || null;
  }

  function createInsightPanel() {
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
          <p id="topSong">Carregando dados...</p>
        </article>

        <article class="module-card">
          <strong>🔥 Pedidos em tempo real</strong>
          <p id="liveRequests">Conectando ao Firestore...</p>
        </article>

        <article class="module-card">
          <strong>💛 Apoios</strong>
          <p id="supportInfo">Nenhum apoio registrado ainda.</p>
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

  function updateInsightPanel() {
    createInsightPanel();

    const allRequests = [...state.requests, ...state.dedications];
    const topSong = getTopSong();

    const topSongEl = $("#topSong");
    const liveRequestsEl = $("#liveRequests");
    const supportInfoEl = $("#supportInfo");

    if (topSongEl) {
      topSongEl.textContent = topSong
        ? `${topSong.song} • ${topSong.count} pedido${topSong.count > 1 ? "s" : ""}`
        : "Nenhuma música pedida ainda.";
    }

    if (liveRequestsEl) {
      liveRequestsEl.textContent = `${allRequests.length} pedido${allRequests.length !== 1 ? "s" : ""} registrados na plataforma.`;
    }

    if (supportInfoEl) {
      supportInfoEl.textContent = state.support.length
        ? `${state.support.length} apoio${state.support.length > 1 ? "s" : ""} registrado${state.support.length > 1 ? "s" : ""}.`
        : "Nenhum apoio registrado ainda.";
    }
  }

  function renderDashboard() {
    updateStatCards();
    updateInsightPanel();
  }

  function listenCollection(db, collectionName, stateKey) {
    return db
      .collection(collectionName)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          state[stateKey] = snapshot.docs.map((doc) => ({
            id: doc.id,
            collectionName,
            ...doc.data()
          }));

          renderDashboard();
        },
        (error) => {
          console.error(`Erro ao carregar ${collectionName}:`, error);
        }
      );
  }

  function startDashboard() {
    const db = getDB();

    if (!db) {
      const cards = $$(".stat-card");

      if (cards[3]) {
        cards[3].querySelector("strong").textContent = "Offline";
        cards[3].querySelector("span").textContent = "Status Firebase";
      }

      return;
    }

    listenCollection(db, "requests", "requests");
    listenCollection(db, "dedications", "dedications");
    listenCollection(db, "support", "support");
  }

  document.addEventListener("DOMContentLoaded", startDashboard);
})();