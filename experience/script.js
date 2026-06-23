const PIX = 'djbeegod@gmail.com';
const WHATSAPP_DJ = '5548996129940';

const FIREBASE_READY = !!(
  window.firebaseConfig &&
  window.firebaseConfig.apiKey &&
  window.firebaseConfig.projectId &&
  window.firebase
);

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
    eyebrow: 'Sistema de experiência musical',
    subtitle: 'Sua música, em um toque.',
    created: 'A música cria momentos. BeeGod cria experiências.',
    start: 'Entrar na experiência',
    aboutBtn: 'Sobre o DJ BeeGod',
    what: 'O que você quer fazer?',
    cardSong: 'Pedir música',
    cardSongText: 'Escolha sua música e participe do set.',
    cardDedicate: 'Dedicar uma música',
    cardDedicateText: 'Surpreenda alguém com uma dedicatória.',
    cardPix: 'Pix / Couvert',
    cardPixText: 'Apoie o artista e mantenha a experiência acontecendo.',
    cardWhats: 'Fale diretamente com a equipe.',
    cardInsta: 'Acompanhe bastidores e próximos eventos.',
    cardGallery: 'Galeria',
    cardGalleryText: 'Veja os melhores momentos da noite.',
    cardAgenda: 'Agenda',
    cardAgendaText: 'Confira os próximos eventos do BeeGod.',
    cardDrinks: 'Conheça os drinks oficiais da noite.',
    cardDJ: 'Sobre o DJ',
    cardDJText: 'Conheça a história do BeeGod.',
    cardReview: 'Avalie sua experiência',
    cardReviewText: 'Sua opinião é muito importante.',
    howTitle: 'Como funciona',
    step1: 'Escaneie o QR Code',
    step1Text: 'Você está no lugar certo.',
    step2: 'Escolha o que quer fazer',
    step2Text: 'Navegue pelas opções.',
    step3: 'Envie sua mensagem',
    step3Text: 'Sua participação faz a diferença.',
    step4: 'Curta a experiência',
    step4Text: 'A música conecta tudo.',
    panelHelp: 'Painel conectado ao Firestore em tempo real.',
    clear: 'Limpar fila local',
    aboutTitle: 'Quem é Andrei Pires?',
    aboutText1: 'Um artista movido pela ideia de transformar música em experiência. O BeeGod Connect nasceu para aproximar pessoas através da música, criando momentos únicos em restaurantes, casamentos e eventos particulares.',
    aboutText2: 'Mais do que uma apresentação, cada noite pode contar uma história.',
    quote: 'A música conecta pessoas. A experiência cria memórias.',
    formSong: 'Pedir música',
    formDed: 'Dedicar uma música',
    sent: 'Pedido recebido! Sua música entrou no painel do DJ.',
    supportTitle: 'Pedido recebido! 🎵',
    supportText: 'Sua música já entrou na fila do DJ.',
    supportQuestion: 'Gostaria de apoiar a experiência?',
    supportDescription: 'O BeeGod Connect existe graças ao apoio de pessoas que acreditam na música.',
    supportButton: '💛 Apoiar a experiência',
    supportLater: 'Continuar curtindo',
    pixTitle: 'Apoiar a experiência',
    pixText: 'Copie a chave Pix abaixo e fortaleça essa experiência.',
    pixCopy: 'Copiar chave Pix',
    pixCopied: 'Pix copiado! Obrigado por apoiar a experiência BeeGod Connect. 🐝'
  },

  en: {
    eyebrow: 'Music experience system',
    subtitle: 'Your song, one tap away.',
    created: 'Music creates moments. BeeGod creates experiences.',
    start: 'Enter the experience',
    aboutBtn: 'About DJ BeeGod',
    what: 'What do you want to do?',
    cardSong: 'Request a song',
    cardSongText: 'Choose your song and join the set.',
    cardDedicate: 'Dedicate a song',
    cardDedicateText: 'Surprise someone with a dedication.',
    cardPix: 'Tip / Cover',
    cardPixText: 'Support the artist and keep the experience alive.',
    cardWhats: 'Talk directly to the team.',
    cardInsta: 'Follow backstage and upcoming events.',
    cardGallery: 'Gallery',
    cardGalleryText: 'See the best moments of the night.',
    cardAgenda: 'Schedule',
    cardAgendaText: 'Check BeeGod upcoming events.',
    cardDrinks: 'Discover the official drinks of the night.',
    cardDJ: 'About the DJ',
    cardDJText: 'Discover BeeGod’s story.',
    cardReview: 'Rate your experience',
    cardReviewText: 'Your opinion matters to us.',
    howTitle: 'How it works',
    step1: 'Scan the QR Code',
    step1Text: 'You are in the right place.',
    step2: 'Choose what to do',
    step2Text: 'Navigate through the options.',
    step3: 'Send your message',
    step3Text: 'Your participation makes a difference.',
    step4: 'Enjoy the experience',
    step4Text: 'Music connects everything.',
    panelHelp: 'Panel connected to Firestore in real time.',
    clear: 'Clear local queue',
    aboutTitle: 'Who is Andrei Pires?',
    aboutText1: 'An artist moved by the idea of turning music into experience. BeeGod Connect was born to bring people closer through music.',
    aboutText2: 'More than a performance, every night can tell a story.',
    quote: 'Music connects people. Experience creates memories.',
    formSong: 'Request a song',
    formDed: 'Dedicate a song',
    sent: 'Request received! Your request entered the DJ panel.',
    supportTitle: 'Request received! 🎵',
    supportText: 'Your song is now in the DJ queue.',
    supportQuestion: 'Would you like to support the experience?',
    supportDescription: 'BeeGod Connect exists thanks to people who believe in music.',
    supportButton: '💛 Support the experience',
    supportLater: 'Keep enjoying',
    pixTitle: 'Support the experience',
    pixText: 'Copy the Pix key below and support this experience.',
    pixCopy: 'Copy Pix key',
    pixCopied: 'Pix copied! Thank you for supporting BeeGod Connect. 🐝'
  },

  es: {
    eyebrow: 'Sistema de experiencia musical',
    subtitle: 'Tu música, con un toque.',
    created: 'La música crea momentos. BeeGod crea experiencias.',
    start: 'Entrar en la experiencia',
    aboutBtn: 'Sobre DJ BeeGod',
    what: '¿Qué quieres hacer?',
    cardSong: 'Pedir canción',
    cardSongText: 'Elige tu música y participa del set.',
    cardDedicate: 'Dedicar una canción',
    cardDedicateText: 'Sorprende a alguien con una dedicatoria.',
    cardPix: 'Propina / Cubierto',
    cardPixText: 'Apoya al artista y mantiene viva la experiencia.',
    cardWhats: 'Habla directamente con el equipo.',
    cardInsta: 'Sigue bastidores y próximos eventos.',
    cardGallery: 'Galería',
    cardGalleryText: 'Mira los mejores momentos de la noche.',
    cardAgenda: 'Agenda',
    cardAgendaText: 'Consulta los próximos eventos de BeeGod.',
    cardDrinks: 'Conoce los tragos oficiales de la noche.',
    cardDJ: 'Sobre el DJ',
    cardDJText: 'Conoce la historia de BeeGod.',
    cardReview: 'Evalúa tu experiencia',
    cardReviewText: 'Tu opinión es muy importante.',
    howTitle: 'Cómo funciona',
    step1: 'Escanea el QR Code',
    step1Text: 'Estás en el lugar correcto.',
    step2: 'Elige qué hacer',
    step2Text: 'Navega por las opciones.',
    step3: 'Envía tu mensaje',
    step3Text: 'Tu participación marca la diferencia.',
    step4: 'Disfruta la experiencia',
    step4Text: 'La música lo conecta todo.',
    panelHelp: 'Panel conectado a Firestore en tiempo real.',
    clear: 'Limpiar fila local',
    aboutTitle: '¿Quién es Andrei Pires?',
    aboutText1: 'Un artista movido por la idea de transformar música en experiencia.',
    aboutText2: 'Más que una presentación, cada noche puede contar una historia.',
    quote: 'La música conecta personas. La experiencia crea memorias.',
    formSong: 'Pedir canción',
    formDed: 'Dedicar una canción',
    sent: '¡Pedido recibido! Tu solicitud entró en el panel del DJ.',
    supportTitle: '¡Pedido recibido! 🎵',
    supportText: 'Tu música ya está en la fila del DJ.',
    supportQuestion: '¿Te gustaría apoyar la experiencia?',
    supportDescription: 'BeeGod Connect existe gracias al apoyo de personas que creen en la música.',
    supportButton: '💛 Apoyar la experiencia',
    supportLater: 'Seguir disfrutando',
    pixTitle: 'Apoyar la experiencia',
    pixText: 'Copia la clave Pix abajo y fortalece esta experiencia.',
    pixCopy: 'Copiar clave Pix',
    pixCopied: '¡Pix copiado! Gracias por apoyar BeeGod Connect. 🐝'
  }
};

let lang = localStorage.getItem('beegod_lang') || 'pt';
let liveItems = [];

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const t = (k) => dict[lang][k] || dict.pt[k] || k;
const safe = (s) => String(s || '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));

function injectOnboardingStyles() {
  if ($('#beegodOnboardingStyles')) return;

  const style = document.createElement('style');
  style.id = 'beegodOnboardingStyles';
  style.textContent = `
    .beegod-onboarding{
      position:fixed;
      inset:0;
      z-index:9999;
      background:
        linear-gradient(180deg,rgba(0,0,0,.22),rgba(0,0,0,.82)),
        url('../assets/hero-beegod-v2.png');
      background-size:cover;
      background-position:center top;
      color:#fff8ec;
      overflow:auto;
      display:flex;
      align-items:flex-end;
      padding:22px;
    }

    .beegod-onboarding-card{
      width:100%;
      max-width:720px;
      margin:0 auto;
      background:rgba(5,5,5,.72);
      border:1px solid rgba(214,168,79,.32);
      border-radius:28px;
      padding:28px 22px;
      backdrop-filter:blur(18px);
      box-shadow:0 30px 100px rgba(0,0,0,.75);
      animation:beeFadeUp .55s ease both;
    }

    .bee-step{
      display:none;
    }

    .bee-step.active{
      display:block;
    }

    .bee-kicker{
      color:#f2d27b;
      text-transform:uppercase;
      letter-spacing:.18em;
      font-size:11px;
      font-weight:900;
      margin-bottom:12px;
    }

    .beegod-onboarding h2{
      font-size:clamp(34px,10vw,64px);
      line-height:.9;
      letter-spacing:-.06em;
      margin:0 0 18px;
    }

    .beegod-onboarding p{
      color:rgba(255,248,236,.82);
      font-size:17px;
      line-height:1.55;
      margin:0 0 14px;
    }

    .bee-list{
      display:grid;
      gap:10px;
      margin:18px 0;
      color:#fff8ec;
      font-weight:700;
    }

    .bee-actions{
      display:grid;
      gap:12px;
      margin-top:24px;
    }

    .bee-btn{
      min-height:56px;
      border:0;
      border-radius:999px;
      font-weight:950;
      cursor:pointer;
      font-size:15px;
      padding:14px 20px;
    }

    .bee-btn.primary{
      background:linear-gradient(135deg,#f2d27b,#d6a84f);
      color:#111;
    }

    .bee-btn.ghost{
      background:rgba(255,255,255,.08);
      border:1px solid rgba(214,168,79,.28);
      color:#fff8ec;
    }

    .bee-progress{
      display:flex;
      gap:8px;
      margin-top:22px;
    }

    .bee-dot{
      height:6px;
      flex:1;
      border-radius:999px;
      background:rgba(255,255,255,.18);
    }

    .bee-dot.active{
      background:#f2d27b;
    }

    @keyframes beeFadeUp{
      from{opacity:0;transform:translateY(18px)}
      to{opacity:1;transform:translateY(0)}
    }

    @media(min-width:760px){
      .beegod-onboarding{
        align-items:center;
        padding:44px;
      }
      .beegod-onboarding-card{
        padding:42px;
      }
    }
  `;
  document.head.appendChild(style);
}

function showBeeGodOnboarding() {
  if (localStorage.getItem('beegod_onboarding_seen') === 'yes') return;

  injectOnboardingStyles();

  const overlay = document.createElement('div');
  overlay.className = 'beegod-onboarding';
  overlay.id = 'beegodOnboarding';

  overlay.innerHTML = `
    <div class="beegod-onboarding-card">
      <section class="bee-step active" data-step="0">
        <div class="bee-kicker">BeeGod Connect</div>
        <h2>Bem-vindo.</h2>
        <p>Eu sou o <strong>DJ BeeGod</strong>.</p>
        <p>Enquanto estou atrás da controladora, quero estar sentado aqui com você.</p>
        <p>Criei essa experiência para que você participe da noite comigo.</p>
        <div class="bee-actions">
          <button class="bee-btn primary" data-next>Continuar</button>
        </div>
      </section>

      <section class="bee-step" data-step="1">
        <div class="bee-kicker">A experiência</div>
        <h2>Sua música, em um toque.</h2>
        <p>Peça uma música, faça uma dedicatória, conheça quem está tornando essa noite possível e sinta-se parte dela.</p>
        <p>Aqui, você não é apenas cliente. Você participa da energia da noite.</p>
        <div class="bee-actions">
          <button class="bee-btn primary" data-next>Entendi</button>
        </div>
      </section>

      <section class="bee-step" data-step="2">
        <div class="bee-kicker">🌼 Por que BeeGod Connect?</div>
        <h2>O Efeito Pólen.</h2>
        <p><strong>Bee</strong> significa abelha. <strong>God</strong> representa algo maior: propósito, conexão e serviço.</p>
        <p>A abelha não cria a flor, nem o fruto, nem a semente. Ela conecta. Ao levar o pólen de uma flor para outra, torna possível o nascimento de novos frutos.</p>
        <p>A BeeGod Connect faz exatamente isso.</p>
        <div class="bee-list">
          <span>🌱 Novos fãs</span>
          <span>🌱 Novos contratos</span>
          <span>🌱 Novas amizades</span>
          <span>🌱 Novos artistas</span>
          <span>🌱 Novas oportunidades</span>
          <span>🌱 Novas histórias</span>
        </div>
        <p>Ela não cria o artista. Não cria a música. Não cria o público. Ela conecta todos eles.</p>
        <div class="bee-actions">
          <button class="bee-btn primary" data-finish>Entrar na experiência</button>
          <button class="bee-btn ghost" data-skip>Ver depois</button>
        </div>
      </section>

      <div class="bee-progress">
        <span class="bee-dot active"></span>
        <span class="bee-dot"></span>
        <span class="bee-dot"></span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  let step = 0;
  const steps = overlay.querySelectorAll('.bee-step');
  const dots = overlay.querySelectorAll('.bee-dot');

  function goToStep(nextStep) {
    step = nextStep;
    steps.forEach((el, index) => el.classList.toggle('active', index === step));
    dots.forEach((el, index) => el.classList.toggle('active', index === step));
  }

  overlay.querySelectorAll('[data-next]').forEach(btn => {
    btn.onclick = () => goToStep(Math.min(step + 1, steps.length - 1));
  });

  function closeOnboarding() {
    localStorage.setItem('beegod_onboarding_seen', 'yes');
    overlay.remove();
  }

  overlay.querySelector('[data-finish]').onclick = closeOnboarding;
  overlay.querySelector('[data-skip]').onclick = closeOnboarding;
}

function applyLang() {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('.lang').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

  const whats = $('#whatsappLink');
  if (whats) {
    whats.href = `https://wa.me/${WHATSAPP_DJ}?text=${encodeURIComponent('Olá, BeeGod! Vim pelo BeeGod Connect.')}`;
  }
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
    await db.collection(collectionName).add({
      ...clean,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } else {
    saveLocalRequests([
      { ...clean, id: Date.now().toString(), collectionName },
      ...getLocalRequests()
    ]);
  }
}

async function updateRequestStatus(id, status, collectionName = 'requests') {
  if (FIREBASE_READY) {
    await db.collection(collectionName).doc(id).update({
      status,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
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

    liveItems = [
      ...liveItems.filter(i => i.collectionName !== collectionName),
      ...incoming
    ].sort((a, b) => {
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

function openSupportInvite() {
  const c = $('#modalContent');

  c.innerHTML = `
    <h2>${t('supportTitle')}</h2>
    <p>${t('supportText')}</p>
    <p>${t('supportQuestion')}</p>
    <p>${t('supportDescription')}</p>

    <div class="btns">
      <button class="btn primary full" id="supportNowBtn">${t('supportButton')}</button>
      <button class="btn ghost full" id="supportLaterBtn">${t('supportLater')}</button>
    </div>
  `;

  $('#supportNowBtn').onclick = () => openPixSupport();
  $('#supportLaterBtn').onclick = () => $('#modal').classList.add('hidden');

  $('#modal').classList.remove('hidden');
}

function openPixSupport() {
  const c = $('#modalContent');

  c.innerHTML = `
    <h2>${t('pixTitle')}</h2>
    <p>${t('pixText')}</p>

    <div class="pixbox">
      <strong>Pix:</strong><br>
      ${PIX}
    </div>

    <button class="btn primary full" id="copyPixBtn">${t('pixCopy')}</button>
    <button class="btn ghost full" id="closePixBtn">${t('supportLater')}</button>
  `;

  $('#copyPixBtn').onclick = copyPix;
  $('#closePixBtn').onclick = () => $('#modal').classList.add('hidden');
}

function openModal(type) {
  const c = $('#modalContent');

  if (type === 'song' || type === 'dedication') {
    const temp = $('#formTemplate').content.cloneNode(true);

    c.innerHTML = '';
    c.appendChild(temp);

    $('#formTitle').textContent = type === 'song' ? t('formSong') : t('formDed');

    if (type === 'song') {
      $('#dedicationWrap').style.display = 'none';
    }

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

      openSupportInvite();
    };

  } else if (type === 'pix') {
    openPixSupport();

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

  $$('[data-status]').forEach(b => {
    b.onclick = () => updateRequestStatus(b.dataset.id, b.dataset.status, b.dataset.col);
  });

  $$('[data-delete]').forEach(b => {
    b.onclick = () => removeRequest(b.dataset.delete, b.dataset.col);
  });
}

async function copyPix() {
  try {
    await navigator.clipboard?.writeText(PIX);

    await createItem({
      type: 'support',
      name: 'Visitante',
      song: 'Pix copiado',
      message: `Chave Pix copiada: ${PIX}`
    });

    const c = $('#modalContent');

    c.innerHTML = `
      <h2>💛</h2>
      <p>${t('pixCopied')}</p>
      <button class="btn primary full" id="finishSupportBtn">${t('supportLater')}</button>
    `;

    $('#finishSupportBtn').onclick = () => $('#modal').classList.add('hidden');

  } catch (err) {
    console.warn('Não foi possível copiar o Pix:', err);
    alert('Pix: ' + PIX);
  }
}

$$('.lang').forEach(b => {
  b.onclick = () => {
    lang = b.dataset.lang;
    localStorage.setItem('beegod_lang', lang);
    applyLang();
  };
});

$$('[data-open]').forEach(b => {
  b.onclick = () => openModal(b.dataset.open);
});

$('#closeModal').onclick = () => $('#modal').classList.add('hidden');

$('#modal').onclick = e => {
  if (e.target.id === 'modal') $('#modal').classList.add('hidden');
};

$('#clearRequests').onclick = () => {
  if (confirm('Limpar apenas a fila local deste navegador?')) {
    localStorage.removeItem('beegod_requests');
    renderRequests([]);
  }
};

$('#year').textContent = new Date().getFullYear();

applyLang();
listenRequests();
showBeeGodOnboarding();

window.copyPix = copyPix;