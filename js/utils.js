window.BeeGodUtils = {
  safe(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[char]));
  },

  toDate(item) {
    if (item?.createdAt?.toDate) return item.createdAt.toDate();
    if (item?.createdAtLocal) return new Date(item.createdAtLocal);
    return null;
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

    return value || "pendente";
  },

  countBy(items, key) {
    const map = {};

    items.forEach((item) => {
      const value = String(item[key] || "").trim();
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