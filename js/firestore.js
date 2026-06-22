// BeeGod Connect — Firestore Core
// Este arquivo centraliza a conexão com Firebase/Firestore para toda a plataforma.

(function () {
  let db = null;
  let initialized = false;

  function isFirebaseReady() {
    return !!(
      window.firebaseConfig &&
      window.firebaseConfig.apiKey &&
      window.firebaseConfig.projectId &&
      window.firebase
    );
  }

  function initFirestore() {
    if (initialized && db) return db;

    if (!isFirebaseReady()) {
      console.warn("BeeGod Firestore: Firebase não está pronto.");
      return null;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseConfig);
      }

      db = firebase.firestore();
      initialized = true;

      console.log("BeeGod Firestore conectado.");
      return db;
    } catch (error) {
      console.error("Erro ao iniciar Firestore:", error);
      return null;
    }
  }

  function getDB() {
    return db || initFirestore();
  }

  function serverTimestamp() {
    if (!window.firebase || !firebase.firestore) return new Date().toISOString();
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  window.BeeGodFirestore = {
    init: initFirestore,
    getDB,
    serverTimestamp,
    isReady: isFirebaseReady
  };
})();