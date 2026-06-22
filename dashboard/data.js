// BeeGod Connect — Dashboard Controller V1.0

(function () {
  const state = {
    requests: [],
    dedications: [],
    support: []
  };

  function render() {
    const analytics = window.BeeGodAnalytics.build(state);
    window.BeeGodRender.renderDashboard(analytics);
  }

  function start() {
    if (!window.BeeGodFirestore) {
      console.error("BeeGodFirestore não encontrado.");
      return;
    }

    if (!window.BeeGodAnalytics || !window.BeeGodRender || !window.BeeGodUtils) {
      console.error("Módulos BeeGod incompletos.");
      return;
    }

    window.BeeGodFirestore.init();

    window.BeeGodFirestore.listen("requests", (items) => {
      state.requests = items;
      render();
    });

    window.BeeGodFirestore.listen("dedications", (items) => {
      state.dedications = items;
      render();
    });

    window.BeeGodFirestore.listen("support", (items) => {
      state.support = items;
      render();
    });
  }

  document.addEventListener("DOMContentLoaded", start);
})();