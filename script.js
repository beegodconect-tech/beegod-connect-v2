const PIX = 'djbeegod@gmail.com';
const WHATSAPP_DJ = '5548996129940';
const FIREBASE_READY = !!(window.firebaseConfig && window.firebaseConfig.apiKey && window.firebaseConfig.projectId && window.firebase);
const COLLECTIONS = {
  song: 'requests',
  dedication: 'dedications',
  support: 'support'
};

let db = null;
let unsubscribeRequests = null;
let unsubscribeDedications = null;

if (FIREBASE_READY) {
  firebase.initializeApp(window.firebaseConfig);
  db = firebase.firestore();
}

const dict = {
  pt: {
    eyebrow: 'Sistema de experiência musical', subtitle: 'Conecte-se. Peça. Dedique. Curta.', created: 'A música cria momentos. BeeGod cria experiências.', start: 'Entrar na experiência', aboutBtn: 'Sobre o DJ BeeGod', what: 'O que você quer fazer?', cardSong: 'Pedir música', cardSongText: 'Escolha sua música e participe do set.', cardDedicate: 'Dedicar uma música', cardDedicateText: 'Surpreenda alguém com uma dedicatória.', cardPix: 'Pix / Couvert', cardPixText: 'Apoie o artista e mantenha a experiência acontecendo.', cardWhats: 'Fale diretamente com a equipe.', cardInsta: 'Acompanhe bastidores e próximos eventos.', cardGallery: 'Galeria', cardGalleryText: 'Veja os melhores momentos da noite.', cardAgenda: 'Agenda', cardAgendaText: 'Confira os próximos eventos do BeeGod.', cardDrinks: 'Conheça os drinks oficiais da noite.', cardDJ: 'Sobre o DJ', cardDJText: 'Conheça a história do BeeGod.', cardReview: 'Avalie sua experiência', cardReviewText: 'Sua opinião é muito importante.', howTitle: 'Como funciona', step1: 'Escaneie o QR Code', step1Text: 'Você está no lugar certo.', step2: 'Escolha o que quer fazer', step2Text: 'Navegue pelas opções.', step3: 'Envie sua mensagem', step3Text: 'Sua participação faz a diferença.', step4: 'Curta a experiência', step4Text: 'A música conecta tudo.', panelHelp: 'Painel conectado ao Firestore em tempo real.', clear: 'Limpar fila local', aboutTitle: 'Quem é Andrei Pires?', aboutText1: 'Um artista movido pela ideia de transformar música em experiência. O BeeGod Connect nasceu para aproximar pessoas através da música, criando momentos únicos em restaurantes, casamentos e eventos particulares.', aboutText2: 'Mais do que uma apresentação, cada noite pode contar uma história.', quote: 'A música conecta pessoas. A experiência cria memórias.', formSong: 'Pedir música', formDed: 'Dedicar uma música', sent: 'Enviado! Sua solicitação entrou no painel do DJ.'
  },
  en: {
    eyebrow: 'Music experience system', subtitle: 'Connect. Request. Dedicate. Enjoy.', created: 'Music creates moments. BeeGod creates experiences.', start: 'Enter the experience', aboutBtn: 'About DJ BeeGod', what: 'What do you want to do?', cardSong: 'Request a song', cardSongText: 'Choose your song and join the set.', cardDedicate: 'Dedicate a song', cardDedicateText: 'Surprise someone with a dedication.', cardPix: 'Tip / Cover', cardPixText: 'Support the artist and keep the experience alive.', cardWhats: 'Talk directly to the team.', cardInsta: 'Follow backstage and upcoming events.', cardGallery: 'Gallery', cardGalleryText: 'See the best moments of the night.', cardAgenda: 'Schedule', cardAgendaText: 'Check BeeGod upcoming events.', cardDrinks: 'Discover the official drinks of the night.', cardDJ: 'About the DJ', cardDJText: 'Discover BeeGod’s story.', cardReview: 'Rate your experience', cardReviewText: 'Your opinion matters to us.', howTitle: 'How it works', step1: 'Scan the QR Code', step1Text: 'You are in the right place.', step2: 'Choose what to do', step2Text: 'Navigate through the options.', step3: 'Send your message', step3Text: 'Your participation makes a difference.', step4: 'Enjoy the experience', step4Text: 'Music connects everything.', panelHelp: 'Panel connected to Firestore in real time.', clear: 'Clear local queue', aboutTitle: 'Who is Andrei Pires?', aboutText1: 'An artist moved by the idea of turning music into experience. BeeGod Connect was born to bring people closer through music.', aboutText2: 'More than a performance, every night can tell a story.', quote: 'Music connects people. Experience creates memories.', formSong: 'Request a song', formDed: 'Dedicate a song', sent: 'Sent! Your request entered the DJ panel.'
  },
  es: {
    eyebrow: 'Sistema de experiencia musical', subtitle: 'Conéctate. Pide. Dedica. Disfruta.', created: 'La música crea momentos. BeeGod crea experiencias.', start: 'Entrar en la experiencia', aboutBtn: 'Sobre DJ BeeGod', what: '¿Qué quieres hacer?', cardSong: 'Pedir canción', cardSongText: 'Elige tu música y participa del set.', cardDedicate: 'Dedicar una canción', cardDedicateText: 'Sorprende a alguien con una dedicatoria.', cardPix: 'Propina / Cubierto', cardPixText: 'Apoya al artista y mantiene viva la experiencia.', cardWhats: 'Habla directamente con el equipo.', cardInsta: 'Sigue bastidores y próximos eventos.', cardGallery: 'Galería', cardGalleryText: 'Mira los mejores momentos de la noche.', cardAgenda: 'Agenda', cardAgendaText: 'Consulta los próximos eventos de BeeGod.', cardDrinks: 'Conoce los tragos oficiales de la noche.', cardDJ: 'Sobre el DJ', cardDJText: 'Conoce la historia de BeeGod.', cardReview: 'Evalúa tu experiencia', cardReviewText: 'Tu opinión es muy importante.', howTitle: 'Cómo funciona', step1: 'Escanea el QR Code', step1Text: 'Estás en el lugar correcto.', step2: 'Elige qué hacer', step2Text: 'Navega por las opciones.', step3: 'Envía tu mensaje', step3Text: 'Tu participación marca la diferencia.', step4: 'Disfruta la experiencia', step4Text: 'La música lo conecta todo.', panelHelp: 'Panel conectado a Firestore en tiempo real.', clear: 'Limpiar fila local', aboutTitle: '¿Quién es Andrei Pires?', aboutText1: 'Un artista movido por la idea de transformar música en experiencia.', aboutText2: 'Más que una presentación, cada noche puede contar una historia.', quote: 'La música conecta personas. La experiencia crea memorias.', formSong: 'Pedir canción', formDed: 'Dedicar una canción', sent: '¡Enviado! Tu solicitud entró en el panel del DJ.'
  }
};

let lang = localStorage.getItem('beegod_lang') || 'pt';
let liveItems = [];

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const t = (k) => dict[lang][k] || dict.pt[k] || k;
const safe = (s) => String(s || '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));

function applyLang() {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('.lang').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  const whats = $('#whatsappLink');
  if (whats) whats.href = `https://wa.me/${WHATSAPP_DJ}?text=${encodeURIComponent('Olá, BeeGod! Vim pelo BeeGod Connect.')}`;
}

function getLocalRequests() {
  return JSON.parse(localStorage.getItem('beegod_requests') || '[]');
}

function saveLocalRequests(items) {
  localStorage.setItem('beegod_requests', JSON.stringify(items));
  renderRequests(items);
}

async function createItem(item) {
  const type = item.type || 'song';
  const collectionName = COLLECTIONS[type] || 'requests';
  const clean = {
    ...item,
    status: 'pendente',
    source: 'BeeGod Connect V2',
    createdAtLocal: new Date().toISOString(),
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };

  if (FIREBASE_READY) {
    await db.collection(collectionName).add({ ...clean, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  } else {
    saveLocalRequests([{ ...clean, id: Date.now().toString(), collectionName }, ...getLocalRequests()]);
  }
}

async function updateRequestStatus(id, status, collectionName = 'requests') {
  if (FIREBASE_READY) {
    await db.collection(collectionName).doc(id).update({ status, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
  } else {
    saveLocalRequests(getLocalRequests().map(i => i.id === id ? { ...i, status } : i));
  }
}

async function removeRequest(id, collectionName = 'requests') {
  if (FIREBASE_READY) {
    await db.collection(collectionName).doc(id).delete();
  } else {
    saveLocalRequests(getLocalRequests().filter(i => i.id !== id));
  }
}

function listenCollection(collectionName) {
  return db.collection(collectionName).orderBy('createdAt', 'desc').onSnapshot(snap => {
    const incoming = snap.docs.map(d => ({ id: d.id, collectionName, ...d.data() }));
    liveItems = [...liveItems.filter(i => i.collectionName !== collectionName), ...incoming]
      .sort((a, b) => {
        const ad = a.createdAt?.toMillis?.() || Date.parse(a.createdAtLocal || 0) || 0;
        const bd = b.createdAt?.toMillis?.() || Date.parse(b.createdAtLocal || 0) || 0;
        return bd - ad;
      });
    renderRequests(liveItems);
  }, err => {
    console.error(`Erro lendo ${collectionName}`, err);
    renderRequests(getLocalRequests());
  });
}

function listenRequests() {
  if (FIREBASE_READY) {
    unsubscribeRequests = listenCollection('requests');
    unsubscribeDedications = listenCollection('dedications');
  } else {
    renderRequests(getLocalRequests());
  }
}

function openModal(type) {
  const c = $('#modalContent');

  if (type === 'song' || type === 'dedication') {
    const temp = $('#formTemplate').content.cloneNode(true);
    c.innerHTML = '';
    c.appendChild(temp);
    $('#formTitle').textContent = type === 'song' ? t('formSong') : t('formDed');
    if (type === 'song') $('#dedicationWrap').style.display = 'none';

    $('#requestForm').onsubmit = async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const item = {
        type,
        name: data.name.trim(),
        song: data.song.trim(),
        message: (data.message || '').trim()
      };
      await createItem(item);
      alert(t('sent'));
      $('#modal').classList.add('hidden');
    };
  } else if (type === 'pix') {
    c.innerHTML = `<h2>${t('cardPix')}</h2><p>${t('cardPixText')}</p><div class="pixbox"><strong>Pix:</strong><br>${PIX}</div><button class="btn primary full" onclick="copyPix()">Copiar chave Pix</button>`;
  } else if (type === 'dj') {
    c.innerHTML = `<h2>${t('aboutTitle')}</h2><p>${t('aboutText1')}</p><p>${t('aboutText2')}</p>`;
  } else if (type === 'gallery') {
    c.innerHTML = '<h2>Galeria</h2><p>Em breve: fotos oficiais dos eventos BeeGod.</p>';
  } else if (type === 'agenda') {
    c.innerHTML = '<h2>Agenda</h2><p>Em breve: próximos eventos e residências.</p>';
  } else if (type === 'drinks') {
    c.innerHTML = '<h2>BeeGod Drinks</h2><p>Em breve: carta de drinks oficiais da noite.</p>';
  } else if (type === 'review') {
    c.innerHTML = '<h2>Avalie sua experiência</h2><p>Em breve: avaliação rápida do evento.</p>';
  }

  $('#modal').classList.remove('hidden');
}

function renderRequests(items = getLocalRequests()) {
  const box = $('#requests');
  if (!box) return;

  box.innerHTML = items.length ? items.map(i => {
    const status = i.status || 'pendente';
    const kind = i.collectionName === 'dedications' || i.type === 'dedication' ? 'Dedicatória' : 'Pedido';
    return `<div class="request">
      <strong>${kind}: ${safe(i.song)}</strong><br>
      <small>${safe(i.name)} • ${safe(i.time || 'agora')} • ${safe(status)}</small>
      ${i.message ? `<p>${safe(i.message)}</p>` : ''}
      <div class="btns">
        <button class="btn ghost" data-status="aceito" data-id="${safe(i.id)}" data-col="${safe(i.collectionName || 'requests')}">Aceitar</button>
        <button class="btn primary" data-status="tocado" data-id="${safe(i.id)}" data-col="${safe(i.collectionName || 'requests')}">Tocado</button>
        <button class="btn danger" data-delete="${safe(i.id)}" data-col="${safe(i.collectionName || 'requests')}">Excluir</button>
      </div>
    </div>`;
  }).join('') : '<p class="muted">Nenhum pedido ainda.</p>';

  $$('[data-status]').forEach(b => b.onclick = () => updateRequestStatus(b.dataset.id, b.dataset.status, b.dataset.col));
  $$('[data-delete]').forEach(b => b.onclick = () => removeRequest(b.dataset.delete, b.dataset.col));
}

async function copyPix() {
  await navigator.clipboard?.writeText(PIX);
  try {
    await createItem({ type: 'support', name: 'Visitante', song: 'Pix copiado', message: `Chave Pix copiada: ${PIX}` });
  } catch (err) {
    console.warn('Não foi possível registrar o apoio:', err);
  }
  alert('Pix copiado: ' + PIX);
}

$$('.lang').forEach(b => b.onclick = () => {
  lang = b.dataset.lang;
  localStorage.setItem('beegod_lang', lang);
  applyLang();
});

$$('[data-open]').forEach(b => b.onclick = () => openModal(b.dataset.open));
$('#closeModal').onclick = () => $('#modal').classList.add('hidden');
$('#modal').onclick = e => { if (e.target.id === 'modal') $('#modal').classList.add('hidden'); };
const clearRequestsBtn = $('#clearRequests');

if (clearRequestsBtn) {
  clearRequestsBtn.onclick = () => {
    if (confirm('Limpar apenas a fila local deste navegador?')) {
      localStorage.removeItem('beegod_requests');
      renderRequests([]);
    }
  };
}
$('#year').textContent = new Date().getFullYear();
applyLang();
listenRequests();

window.copyPix = copyPix;
