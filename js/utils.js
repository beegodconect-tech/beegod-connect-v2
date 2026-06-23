window.BeeGodUtils = {
  safe(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  },

  isFirebaseReady() {
    return !!(
      window.firebase &&
      window.firebaseConfig &&
      window.firebaseConfig.apiKey &&
      window.firebaseConfig.projectId &&
      window.firebase.firestore
    );
  },

  toDate(item) {
    if (item?.createdAt?.toDate) return item.createdAt.toDate();
    if (item?.updatedAt?.toDate) return item.updatedAt.toDate();
    if (item?.createdAtLocal) return new Date(item.createdAtLocal);
    return null;
  },

  timestampOf(item) {
    const date = this.toDate(item);
    return date ? date.getTime() : 0;
  },

  isToday(item) {
    const date = this.toDate(item);
    if (!date || isNaN(date)) return false;

    const now = new Date();

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  },

  normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  },

  normalizeStatus(status) {
    const value = this.normalizeText(status);

    if (value === "played") return "tocado";
    if (value === "accepted") return "aceito";
    if (value === "rejected") return "recusado";
    if (value === "pending") return "pendente";

    if (value === "tocado") return "tocado";
    if (value === "aceito") return "aceito";
    if (value === "recusado") return "recusado";
    if (value === "pendente") return "pendente";

    return value || "pendente";
  },

  toFirebaseStatus(status) {
    const value = this.normalizeStatus(status);

    if (value === "tocado") return "played";
    if (value === "aceito") return "accepted";
    if (value === "recusado") return "rejected";
    if (value === "pendente") return "pending";

    return "pending";
  },

  countBy(items, key) {
    const map = {};

    items.forEach((item) => {
      const value = String(item?.[key] || "").trim();
      if (!value) return;

      const normalized = this.normalizeText(value);

      if (!map[normalized]) {
        map[normalized] = {
          label: value,
          count: 0
        };
      }

      map[normalized].count += 1;
    });

    return Object.values(map).sort((a, b) => b.count - a.count);
  }
};

/* Compatibilidade global para arquivos antigos */
window.safe = window.BeeGodUtils.safe.bind(window.BeeGodUtils);
window.isFirebaseReady = window.BeeGodUtils.isFirebaseReady.bind(window.BeeGodUtils);
window.toDate = window.BeeGodUtils.toDate.bind(window.BeeGodUtils);
window.timestampOf = window.BeeGodUtils.timestampOf.bind(window.BeeGodUtils);
window.isToday = window.BeeGodUtils.isToday.bind(window.BeeGodUtils);
window.normalizeText = window.BeeGodUtils.normalizeText.bind(window.BeeGodUtils);
window.normalizeStatus = window.BeeGodUtils.normalizeStatus.bind(window.BeeGodUtils);
window.toFirebaseStatus = window.BeeGodUtils.toFirebaseStatus.bind(window.BeeGodUtils);
window.countBy = window.BeeGodUtils.countBy.bind(window.BeeGodUtils);