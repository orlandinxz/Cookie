const memoryForm = document.getElementById('memoryForm');
const resetButton = document.getElementById('resetCookies');
const portalStatus = document.getElementById('portalStatus');
const visitNote = document.getElementById('visitNote');
const cookiePanel = document.getElementById('cookiePanel');
const portalCore = document.getElementById('portalCore');
const portalEffects = document.getElementById('portalEffects');
const toast = document.getElementById('toastMessage');
const explorerNameInput = document.getElementById('explorerName');
const planetChoiceInput = document.getElementById('planetChoice');
const auraColorInput = document.getElementById('auraColor');
const alienClassInput = document.getElementById('alienClass');
const memoryMessageInput = document.getElementById('memoryMessage');

const cookieKeys = {
  explorerName: 'cookieverseExplorer',
  planet: 'cookieversePlanet',
  auraColor: 'cookieverseAura',
  alienClass: 'cookieverseClass',
  visits: 'cookieverseVisits',
  lastMessage: 'cookieverseLastMessage'
};

// Cria ou atualiza um cookie com validade definida em dias.
function setCookie(name, value, days = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

// Lê um cookie pelo nome e retorna o valor armazenado.
function getCookie(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ').reduce((acc, pair) => {
    const [key, value] = pair.split('=');
    if (key) acc[key] = decodeURIComponent(value || '');
    return acc;
  }, {});
  return cookies[name] || '';
}

// Remove um cookie definindo sua expiração em uma data passada.
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

function getAllCookies() {
  if (!document.cookie) return [];
  return document.cookie.split('; ').map(pair => {
    const [key, value] = pair.split('=');
    return { key, value: decodeURIComponent(value || '') };
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3600);
}

function renderCookiePanel() {
  const cookies = getAllCookies();
  if (!cookies.length) {
    cookiePanel.innerHTML = '<p>Nenhum cookie encontrado. Crie uma memória para ativar o portal.</p>';
    return;
  }

  cookiePanel.innerHTML = cookies.map(({ key, value }) => {
    const label = getCookieLabel(key);
    return `
      <div class="cookie-item">
        <div>
          <strong>${label}</strong>
          <span>${value}</span>
        </div>
        <div>${formatCookieValue(key, value)}</div>
      </div>
    `;
  }).join('');
}

function getCookieLabel(key) {
  switch (key) {
    case cookieKeys.explorerName: return 'Explorador';
    case cookieKeys.planet: return 'Planeta';
    case cookieKeys.auraColor: return 'Aura';
    case cookieKeys.alienClass: return 'Classe';
    case cookieKeys.visits: return 'Visitas';
    case cookieKeys.lastMessage: return 'Última Memória';
    default: return key;
  }
}

function formatCookieValue(key, value) {
  if (key === cookieKeys.auraColor) {
    return `<span class="color-chip" style="background:${value}"></span> ${value}`;
  }
  return value;
}

function populateFormFromCookies() {
  const storedName = getCookie(cookieKeys.explorerName);
  const storedPlanet = getCookie(cookieKeys.planet);
  const storedAura = getCookie(cookieKeys.auraColor);
  const storedClass = getCookie(cookieKeys.alienClass);
  const storedMessage = getCookie(cookieKeys.lastMessage);

  if (storedName) explorerNameInput.value = storedName;
  if (storedPlanet) planetChoiceInput.value = storedPlanet;
  if (storedAura) auraColorInput.value = storedAura;
  if (storedClass) alienClassInput.value = storedClass;
  if (storedMessage) memoryMessageInput.value = storedMessage;
}

function updatePortalAppearance() {
  const aura = getCookie(cookieKeys.auraColor) || auraColorInput.value;
  portalCore.style.boxShadow = `0 0 180px ${aura}60, inset 0 0 60px ${aura}80`;
  portalCore.style.background = `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.92), ${aura}40%, rgba(19, 6, 56, 0.7) 72%)`;
}

function initializePortal() {
  const visits = Number(getCookie(cookieKeys.visits));
  if (visits) {
    setCookie(cookieKeys.visits, visits + 1);
  } else {
    setCookie(cookieKeys.visits, 1);
  }

  const name = getCookie(cookieKeys.explorerName);
  const storedMessage = getCookie(cookieKeys.lastMessage);
  populateFormFromCookies();
  updatePortalAppearance();
  renderCookiePanel();

  const visitCount = getCookie(cookieKeys.visits);
  visitNote.textContent = `${visitCount} conexão(ões)`;

  if (name) {
    portalStatus.textContent = `RECONHECENDO ${name.toUpperCase()}`;
    showToast(`Bem-vindo de volta, Explorador ${name}. O portal lembra sua última mensagem.`);
  } else {
    portalStatus.textContent = 'ADORMECIDO';
    showToast('Bem-vindo ao portal. Crie sua primeira memória.');
  }

  if (storedMessage && name) {
    const planet = getCookie(cookieKeys.planet);
    const alienClass = getCookie(cookieKeys.alienClass);
    portalStatus.textContent = `${alienClass || 'Classe desconhecida'} de ${planet || 'planeta desconhecido'}`;
  }
}

function addPortalAnimation(message) {
  const wave = document.createElement('div');
  wave.className = 'memory-wave';
  wave.textContent = message;
  portalEffects.appendChild(wave);

  setTimeout(() => {
    wave.classList.add('explode');
  }, 40);

  setTimeout(() => {
    wave.remove();
  }, 1800);
}

memoryForm.addEventListener('submit', event => {
  event.preventDefault();

  const name = explorerNameInput.value.trim();
  const planet = planetChoiceInput.value;
  const aura = auraColorInput.value;
  const alienClass = alienClassInput.value;
  const message = memoryMessageInput.value.trim();

  if (!name || !planet || !alienClass || !message) {
    showToast('Preencha todos os campos para conectar o portal.');
    return;
  }

  setCookie(cookieKeys.explorerName, name);
  setCookie(cookieKeys.planet, planet);
  setCookie(cookieKeys.auraColor, aura);
  setCookie(cookieKeys.alienClass, alienClass);
  setCookie(cookieKeys.lastMessage, message);

  updatePortalAppearance();
  renderCookiePanel();
  showToast('Memória enviada. Portal gravando lembranças...');
  portalStatus.textContent = `MEMÓRIA RECEBIDA DE ${name.toUpperCase()}`;
  addPortalAnimation(message);
});

resetButton.addEventListener('click', () => {
  Object.values(cookieKeys).forEach(deleteCookie);
  portalStatus.textContent = 'PORTAL RESETADO';
  visitNote.textContent = '0 conexão(ões)';
  cookiePanel.innerHTML = '<p>Todos os cookies foram apagados. Reative o portal com uma nova memória.</p>';
  showToast('Cookies apagados. O portal voltou ao estado inicial.');
  explorerNameInput.value = '';
  planetChoiceInput.value = '';
  auraColorInput.value = '#7b00ff';
  alienClassInput.value = '';
  memoryMessageInput.value = '';
  setTimeout(() => initializePortal(), 100);
});

initializePortal();
