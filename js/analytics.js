window.BeeGodAnalytics = (() => {
  const U = window.BeeGodUtils;

  function build(data) {
    const requests = data.requests || [];
    const dedications = data.dedications || [];
    const support = data.support || [];

    const allRequests = [...requests, ...dedications];

    const todayRequests = allRequests.filter((item) => U.isToday(item));

    const played = allRequests.filter((item) => {
      const status = U.normalizeStatus(item.status);
      return status === "tocado";
    });

    const accepted = allRequests.filter((item) => {
      const status = U.normalizeStatus(item.status);
      return status === "aceito" || status === "tocado";
    });

    const rejected = allRequests.filter((item) => {
      const status = U.normalizeStatus(item.status);
      return status === "recusado";
    });

    const topSongs = U.countBy(allRequests, "song");

    return {
      totals: {
        todayRequests: todayRequests.length,
        allRequests: allRequests.length,
        played: played.length,
        accepted: accepted.length,
        rejected: rejected.length,
        support: support.length
      },

      topSong: topSongs[0] || null,
      topSongs,

      rates: {
        accepted:
          allRequests.length > 0
            ? Math.round((accepted.length / allRequests.length) * 100)
            : 0,

        rejected:
          allRequests.length > 0
            ? Math.round((rejected.length / allRequests.length) * 100)
            : 0
      }
    };
  }

  return { build };
})();