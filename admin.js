const ADMIN_PASSWORD = 'beegod2026';
const COLLECTIONS = ['requests', 'dedications'];
let db = null;
let rows = [];
let supportRows = [];
let unsubscribers = [];

const $ = (selector) => document.querySelector(selector);
const safe = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[char]));

function isFirebaseReady() {
  return !!(window.firebaseConfig && window.firebaseConfig.apiKey && window.firebaseConfig.projectId && window.firebase);
}

function timestampOf(item) {
  return item.createdAt?.toMillis?.() || Date.parse(item.createdAtLocal || '') || 0;
}

function normalizeStatus(status) {
  if (status === 'played') return 'tocado';
  if (status === 'rejected') return 'recusado';
  if (status === 'accepted') return 'aceito';
  return status || 'pendente';
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
  } catch (error) {
    console.error(error);
    $('#connectionStatus').textContent = 'Erro iniciando Firebase.';
  }
}

async function updateStatus(id, collectionName, status) {
  if (!db) return alert('Firebase ainda não conectou.');
  await db.collection(collectionName).doc(id).update({
    status,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
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
    const type = item.collectionName === 'dedications' || item.type === 'dedication' ? 'Dedicatória' : 'Pedido de música';
    const time = item.time || (item.createdAt?.toDate?.()?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) || 'agora');

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
        <button class="btn ghost" data-action="aceito" data-id="${safe(item.id)}" data-col="${safe(item.collectionName)}">Aceitar</button>
        <button class="btn ok" data-action="tocado" data-id="${safe(item.id)}" data-col="${safe(item.collectionName)}">Tocada</button>
        <button class="btn danger" data-action="recusado" data-id="${safe(item.id)}" data-col="${safe(item.collectionName)}">Recusar</button>
      </div>
    </article>`;
  }).join('');

  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => updateStatus(button.dataset.id, button.dataset.col, button.dataset.action));
  });
}

function renderSupport() {
  const list = $('#supportList');
  if (!supportRows.length) {
    list.innerHTML = '<div class="empty">Nenhum apoio registrado ainda.</div>';
    return;
  }

  list.innerHTML = supportRows.map((item) => {
    const time = item.time || (item.createdAt?.toDate?.()?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) || 'agora');
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
