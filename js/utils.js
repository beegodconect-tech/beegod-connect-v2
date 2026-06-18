window.safe = function safe(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
};

window.isFirebaseReady = function isFirebaseReady() {
  return !!(
    window.firebaseConfig &&
    window.firebaseConfig.apiKey &&
    window.firebaseConfig.projectId &&
    window.firebase
  );
};

window.timestampOf = function timestampOf(item) {
  return item.createdAt?.toMillis?.() || Date.parse(item.createdAtLocal || '') || 0;
};

window.normalizeStatus = function normalizeStatus(status) {
  if (status === 'played') return 'tocado';
  if (status === 'rejected') return 'recusado';
  if (status === 'accepted') return 'aceito';
  return status || 'pendente';
};

window.toFirebaseStatus = function toFirebaseStatus(status) {
  if (status === 'tocado') return 'played';
  if (status === 'recusado') return 'rejected';
  if (status === 'aceito') return 'accepted';
  return status;
};

window.normalizeText = function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

window.buildLibraryId = function buildLibraryId(artist, title) {
  const raw = `${artist || 'artista'}-${title || 'musica'}`;

  return normalizeText(raw)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || `music-${Date.now()}`;
};