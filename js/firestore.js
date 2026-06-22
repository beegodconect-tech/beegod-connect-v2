window.BeeGodFirestore = (() => {
  let db = null;
  let initialized = false;

  function isReady() {
    return !!(
      window.firebaseConfig &&
      window.firebaseConfig.apiKey &&
      window.firebaseConfig.projectId &&
      window.firebase
    );
  }

  function init() {
    if (initialized && db) return db;

    if (!isReady()) {
      console.warn("BeeGod Firestore: Firebase não está pronto.");
      return null;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseConfig);
      }

      db = firebase.firestore();
      initialized = true;

      console.log("🐝 BeeGod Firestore conectado.");
      return db;
    } catch (error) {
      console.error("Erro ao iniciar Firestore:", error);
      return null;
    }
  }

  function listen(collectionName, callback) {
    const database = init();

    if (!database) return null;

    return database
      .collection(collectionName)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            collectionName,
            ...doc.data()
          }));

          callback(items);
        },
        (error) => {
          console.error(`Erro ao carregar ${collectionName}:`, error);
        }
      );
  }

  function serverTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  return {
    init,
    listen,
    serverTimestamp,
    isReady
  };
})();