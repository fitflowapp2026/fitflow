
function uid(prefix = 'id') {
  let rand;
  try {
    const buf = new Uint8Array(6);
    crypto.getRandomValues(buf);
    rand = Array.from(buf, b => b.toString(36).padStart(2, '0')).join('').slice(0, 8);
  } catch(e) {
    rand = Math.random().toString(36).slice(2, 10);
  }
  return `${prefix}_${rand}_${Date.now().toString(36)}`;
}

function generateShareToken() {
  try {
    const buf = new Uint8Array(18);
    crypto.getRandomValues(buf);
    return Array.from(buf, b => b.toString(36).padStart(2,'0')).join('').slice(0, 24);
  } catch(e) {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }
}

/* URL del portale cliente — adatta al tuo dominio */
function clientPortalUrl(token) {
  const dir  = window.location.pathname.replace(/\/[^\/]*$/, '/');
  const base = window.location.origin + dir + 'client.html';
  return `${base}?t=${token}`;
}

function pad(n) { return String(n).padStart(2, '0'); }
function toISO(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
function fromISO(iso) {
  if (!iso) return new Date();
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
function todayISO() { return toISO(new Date()); }
function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function addDays(date, days) { const copy = new Date(date); copy.setDate(copy.getDate() + days); return copy; }
function addWeeks(date, weeks) { return addDays(date, weeks * 7); }
function addMonths(date, months) { return new Date(date.getFullYear(), date.getMonth() + months, 1); }
function sameMonth(date, monthDate) { return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear(); }
function formatDateShort(iso) { return fromISO(iso).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function formatDateFancy(iso) { return fromISO(iso).toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'long' }); }
function formatMonthLabel(date) { return `${MONTHS_IT[date.getMonth()]} ${date.getFullYear()}`; }
function minutesFromTime(time) {
  const [h, m] = String(time || '00:00').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}
function normalizeWeekday(jsDay) { return jsDay === 0 ? 7 : jsDay; }
function initials(name) {
  return String(name || '?').split(' ').filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('') || '?';
}
function splitFullName(value) {
  const parts = String(value || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() || '',
    lastName: parts.join(' ')
  };
}
function getClientFullName(client) {
  if (!client) return 'Cliente';
  const first = String(client.firstName || '').trim();
  const last = String(client.lastName || '').trim();
  return [first, last].filter(Boolean).join(' ').trim() || String(client.name || 'Cliente').trim() || 'Cliente';
}
function weekdayLabel(day) {
  return DAYS_IT[(Number(day || 1) - 1 + 7) % 7] || '---';
}
function sortWeekdays(days) {
  return [...new Set((days || []).map(Number).filter(day => day >= 1 && day <= 7))].sort((a, b) => a - b);
}
function cloneJson(value) {
  try { return structuredClone(value || {}); } catch(_) { return JSON.parse(JSON.stringify(value || {})); }
}
function normalizeCheckMode(mode) {
  if (mode === 'both') return '12';
  return ['8', '12', 'none'].includes(mode) ? mode : '12';
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"'`]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;', '`':'&#96;' }[char]));
}

function showToast(message, type = 'info') {
  const icons = { ok: '✓', warn: '⚠', error: '✕', info: '' };
  const durations = { ok: 2200, warn: 4000, error: 4500, info: 2200 };
  const icon = icons[type] || '';
  el.toast.innerHTML = icon ? `<span class="toast-icon">${icon}</span><span>${message}</span>` : message;
  el.toast.className = 'toast';
  if (type !== 'info') el.toast.classList.add(`toast-${type}`);
  el.toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.toast.classList.remove('show'), durations[type] || 2200);
  /* Haptic: pulse breve su ok, doppio su errore */
  if (type === 'ok') haptic(8);
  else if (type === 'error') haptic([10, 60, 10]);
  else if (type === 'warn') haptic(20);
}

function formatNumberMax2(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return '0';
  return amount.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return '0,00 €';
  return amount.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
