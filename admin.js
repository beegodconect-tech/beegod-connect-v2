const ADMIN_PASSWORD = 'beegod2026';
const COLLECTIONS = ['requests', 'dedications'];

let db = null;
let rows = [];
let supportRows = [];
let libraryRows = [];
let historyRows = [];
let unsubscribers = [];

const $ = (selector) => document.querySelector(selector);

function splitArtistAndTitle(item) {
  const song = String(item.song || '').trim();
  const artist = String(item.artist || item.artistName || '').trim();

  if (artist && song) {
    return { artist, title: song };
  }

  if (song.includes(' - ')) {
    const [possibleArtist, ...rest] = song.split(' - ');
    return {
      artist: possibleArtist.trim() || 'Artista não informado',
      title: rest.join(' - ').trim() || song
    };
  }

  return {
    artist: artist || 'Artista não informado',
    title: song || 'Música não informada'
  };
}

function youtubeSearchUrl(artist, title) {
  const query = encodeURIComponent(`${artist} ${title}`.trim());
  return `https://www.youtube.com/results?search_query=${query}`;
}

async function saveToLibrary(item) {
  if (!db || !firebase) return;

  const { artist, title } = splitArtistAndTitle(item);
  const libraryId = buildLibraryId(artist, title);
  const ref = db.collection('library').doc(libraryId);

  await firebase.firestore().runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    const now = firebase.firestore.FieldValue.serverTimestamp();

    if (doc.exists) {
      const current = doc.data();
      transaction.update(ref, {
        timesPlayed: (current.timesPlayed || 0) + 1,
        lastPlayedAt: now,
        updatedAt: now,
        youtubeSearch: `${artist} ${title}`,
        youtubeUrl: youtubeSearchUrl(artist, title)
      });
      return;
    }

    transaction.set(ref, {
      artist,
      title,
      artistKey: normalizeText(artist),
      titleKey: normalizeText(title),
      searchKey: normalizeText(`${artist} ${title}`),
      timesPlayed: 1,
      timesRequested: 1,
      lastPlayedAt: now,
      createdAt: now,
      updatedAt: now,
      youtubeSearch: `${artist} ${title}`,
      youtubeUrl: youtubeSearchUrl(artist, title),
      source: 'dj-panel',
      active: true
    });
  });
}

async function saveToHistory(item, status) {
  if (!db || !firebase) return;

  const { artist, title } = splitArtistAndTitle(item);

  await db.collection('history').add({
    requestId: item.id || null,
    collectionName: item.collectionName || null,
    artist,
    title,
    name: item.name || 'Visitante',
    message: item.message || '',
    status,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    youtubeSearch: `${artist} ${title}`,
    youtubeUrl: youtubeSearchUrl(artist, title)
  });
}

function showPanel() {
  $('#loginCard').classList.add('hidden');
  $('#panel').classList.remove('hidden');
}

function showLogin() {
  $('#panel').classList.add('hidden');
  $('#loginCard').classList.remove('hidden');
}

function startFirebase() {
  if (!isFirebaseReady()) {
    $('#connectionStatus').textContent = 'Firebase não encontrado. Verifique firebase-config.js.';
    render();
    return;
  }

  try {
    if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
    db = firebase.firestore();
    $('#connectionStatus').textContent = 'Conectado ao Firestore em tempo real.';

    COLLECTIONS.forEach((collectionName) => {
      const unsubscribe = db.collection(collectionName).orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        const incoming = snapshot.docs.map((doc) => ({
          id: doc.id,
          collectionName,
          ...doc.data(),
          status: normalizeStatus(doc.data().status)
        }));

        rows = [...rows.filter((item) => item.collectionName !== collectionName), ...incoming]
          .sort((a, b) => timestampOf(b) - timestampOf(a));

        render();
      }, (error) => {
        console.error(error);
        $('#connectionStatus').textContent = 'Erro ao ler pedidos. Confira regras do Firestore.';
      });

      unsubscribers.push(unsubscribe);
    });

    const supportUnsub = db.collection('support').orderBy('createdAt', 'desc').limit(20).onSnapshot((snapshot) => {
      supportRows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      renderSupport();
    }, (error) => console.warn('Erro support:', error));

    unsubscribers.push(supportUnsub);
    const libraryUnsub = db.collection('library')
      .orderBy('timesPlayed', 'desc')
      .limit(20)
      .onSnapshot((snapshot) => {
        libraryRows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (window.BeeGodAnalytics && window.BeeGodRender) {
 const analytics = window.BeeGodAnalytics.build({
  requests: rows,
  dedications: [],
  support: supportRows
});

  window.BeeGodRender.renderDashboard(analytics);
}
      });

    unsubscribers.push(libraryUnsub);

    const historyUnsub = db.collection('history')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot((snapshot) => {
        historyRows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (window.BeeGodAnalytics && window.BeeGodRender) {
 const analytics = window.BeeGodAnalytics.build({
  requests: rows,
  dedications: [],
  support: supportRows
});

  window.BeeGodRender.renderDashboard(analytics);
}
      });

    unsubscribers.push(historyUnsub);
  } catch (error) {
    console.error(error);
    $('#connectionStatus').textContent = 'Erro iniciando Firebase.';
  }
}

async function updateStatus(id, collectionName, status) {
  if (!db) return alert('Firebase ainda não conectou.');

  const firebaseStatus = toFirebaseStatus(status);
  const item = rows.find((row) => row.id === id && row.collectionName === collectionName);

  await db.collection(collectionName).doc(id).update({
    status: firebaseStatus,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  if (item) {
    await saveToHistory(item, status);

    if (status === 'tocado') {
      await saveToLibrary(item);
    }
  }
}

function filterRows() {
  const term = $('#searchInput').value.trim().toLowerCase();
  const status = $('#filterStatus').value;

  return rows.filter((item) => {
    const itemStatus = normalizeStatus(item.status);
    const matchesStatus = status === 'all' || itemStatus === status;
    const content = `${item.name || ''} ${item.song || ''} ${item.message || ''}`.toLowerCase();
    const matchesTerm = !term || content.includes(term);
    return matchesStatus && matchesTerm;
  });
}

function renderStats() {
  const counts = rows.reduce((acc, item) => {
    const status = normalizeStatus(item.status);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  $('#pendingCount').textContent = counts.pendente || 0;
  $('#acceptedCount').textContent = counts.aceito || 0;
  $('#playedCount').textContent = counts.tocado || 0;
  $('#rejectedCount').textContent = counts.recusado || 0;
}

function render() {
  renderStats();

  const list = $('#requestList');
  const filtered = filterRows();

  if (!filtered.length) {
    list.innerHTML = '<div class="empty">Nenhum pedido encontrado.</div>';
    return;
  }

  list.innerHTML = filtered.map((item) => {
    const status = normalizeStatus(item.status);
    const type = item.collectionName === 'dedications' || item.type === 'dedication'
      ? 'Dedicatória'
      : 'Pedido de música';

    const time = item.time || (
      item.createdAt?.toDate?.()?.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }) || 'agora'
    );

    const { artist, title } = splitArtistAndTitle(item);
    function buildLibraryId(artist, title) {
  return `${artist}-${title}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'musica-sem-identificacao';
}
    const youtubeUrl = youtubeSearchUrl(artist, title);

    return `<article class="card">
      <div class="card-top">
        <div>
          <h3>${safe(item.song || 'Música não informada')}</h3>
          <div class="meta">${safe(type)} • ${safe(item.name || 'Visitante')} • ${safe(time)}</div>
        </div>
        <span class="badge ${safe(status)}">${safe(status)}</span>
      </div>

      ${item.message ? `<div class="message">${safe(item.message)}</div>` : ''}

      <div class="actions">
        
  <button class="btn ghost" data-action="aceito" data-id="${safe(item.id)}" data-col="${safe(item.collectionName)}">
    ✓ Aceitar
  </button>

  <button class="btn ok" data-action="tocado" data-id="${safe(item.id)}" data-col="${safe(item.collectionName)}">
    🎵 Tocada
  </button>

  <button class="btn danger" data-action="recusado" data-id="${safe(item.id)}" data-col="${safe(item.collectionName)}">
    ✕ Recusar
  </button>

  <a class="btn youtube" href="${safe(youtubeUrl)}" target="_blank" rel="noopener noreferrer">
    ▶️ YouTube
  </a>

  <button class="btn ghost" type="button" disabled title="Integração futura">
    💿 Recordbox
  </button>
</div>
      </div>
    </article>`;
  }).join('');

  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () =>
      updateStatus(button.dataset.id, button.dataset.col, button.dataset.action)
    );
  });
}

function renderSupport() {
  const list = $('#supportList');

  if (!supportRows.length) {
    list.innerHTML = '<div class="empty">Nenhum apoio registrado ainda.</div>';
    return;
  }

  list.innerHTML = supportRows.map((item) => {
    const time = item.time || (
      item.createdAt?.toDate?.()?.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }) || 'agora'
    );

    return `<article class="card">
      <div class="card-top">
        <div>
          <h3>${safe(item.song || 'Apoio registrado')}</h3>
          <div class="meta">${safe(item.name || 'Visitante')} • ${safe(time)}</div>
        </div>
      </div>
      ${item.message ? `<div class="message">${safe(item.message)}</div>` : ''}
    </article>`;
  }).join('');
}

$('#loginForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const password = $('#adminPassword').value.trim();

  if (password !== ADMIN_PASSWORD) {
    alert('Senha incorreta.');
    return;
  }

  localStorage.setItem('beegod_admin', '1');
  showPanel();
  startFirebase();
});

$('#logoutBtn').addEventListener('click', () => {
  unsubscribers.forEach((unsubscribe) => unsubscribe());
  unsubscribers = [];
  localStorage.removeItem('beegod_admin');
  showLogin();
});

$('#searchInput').addEventListener('input', render);
$('#filterStatus').addEventListener('change', render);

if (localStorage.getItem('beegod_admin') === '1') {
  showPanel();
  startFirebase();
}