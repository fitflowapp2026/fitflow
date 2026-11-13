'use strict';
/**
 * Dati di prova (finti) usati dal server locale e dai test: un trainer con molti
 * clienti, lezioni passate e future, pacchetti. Nessun dato reale.
 */
// ── Dati di prova: un trainer con molti clienti (dimensioni simili a un account reale) ──
function buildDemoState(total = 40) {
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const names = ['Anna', 'Marco', 'Giulia', 'Luca', 'Sara', 'Paolo', 'Elena', 'Davide', 'Chiara', 'Matteo', 'Francesca', 'Andrea'];
  const surnames = ['Rossi', 'Bianchi', 'Verdi', 'Neri', "D'Angelo", 'Russo', 'Ferrari', 'Esposito', 'Romano', 'Colombo', 'Ricci', 'Marino'];
  const packages = [
    { id: 'pkg_base12', name: 'Base 12', lessonsTotal: 12, weeks: 8, perWeek: 2, duration: 60, totalPrice: 480, createdAt: '2026-01-05T09:00:00.000Z' },
    { id: 'pkg_start8', name: 'Start 8', lessonsTotal: 8, weeks: 4, perWeek: 2, duration: 60, totalPrice: 340, createdAt: '2026-01-05T09:00:00.000Z' },
    { id: 'pkg_free', name: 'FREE SESSION', lessonsTotal: 1, weeks: 1, perWeek: 1, duration: 60, totalPrice: 0, createdAt: '2026-01-05T09:00:00.000Z' }
  ];
  const clients = [], plans = [], lessons = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < total; i++) {
    const free = i % 9 === 8;
    const pkg = free ? packages[2] : packages[i % 2];
    const id = `client_demo_${i}`;
    const planId = `plan_demo_${i}`;
    const firstName = names[i % names.length];
    const lastName = surnames[(i * 5 + Math.floor(i / names.length)) % surnames.length];
    clients.push({
      id, firstName, lastName, name: `${firstName} ${lastName}`,
      email: '', phone: free ? `33312345${pad(i % 100)}` : '',
      notes: '', shareToken: `demotoken${String(i).padStart(15, '0')}`,
      serviceType: free ? 'free_session' : 'personal',
      freeSessionDone: !free, packagePurchased: true, conversionStatus: 'path_started',
      paymentStatus: free ? 'paid' : ['paid', 'unpaid', 'partial'][i % 3],
      paymentMode: free ? 'included' : 'single', installmentsTotal: 1, installmentsPaid: free ? 1 : 0,
      packagePrice: pkg.totalPrice, scheduleMode: 'same', fixedTime: `${pad(8 + (i % 10))}:00`,
      fixedDays: [1 + (i % 5), 1 + ((i + 2) % 5)], variableSchedule: [],
      sendCalendarInvite: false, activePlanId: planId,
      paymentHistory: [], renewalHistory: [],
      createdAt: new Date(today.getTime() - (20 + i) * 86400000).toISOString()
    });
    plans.push({
      id: planId, clientId: id, packageId: pkg.id, startDate: iso(new Date(today.getTime() - 14 * 86400000)),
      checkMode: '12', saleType: 'new', planType: free ? 'free_session' : 'personal', status: 'active',
      totalPrice: pkg.totalPrice, createdAt: new Date(today.getTime() - (20 + i) * 86400000).toISOString()
    });
    const count = free ? (i % 2) : Math.min(pkg.lessonsTotal, 4 + (i % 7));
    for (let k = 0; k < count; k++) {
      // lezioni sparse da tre settimane fa a tre settimane avanti, mai due nello stesso slot
      const dayOffset = -21 + ((i * 3 + k * 5) % 42);
      const date = new Date(today.getTime() + dayOffset * 86400000);
      const hour = 7 + ((i + k * 3) % 14);
      const minute = (i % 2) * 30;
      const past = dayOffset < 0;
      lessons.push({
        id: `lesson_demo_${i}_${k}`, clientId: id, planId, date: iso(date), time: `${pad(hour)}:${pad(minute)}`,
        duration: 60, lessonType: free ? 'free_session' : 'personal',
        status: past ? (k % 6 === 5 ? 'cancelled' : 'done') : 'scheduled',
        note: '', linkedTo: null, googleEventId: '', createdAt: new Date(today.getTime() - 20 * 86400000).toISOString()
      });
    }
  }
  return { clients, packages, plans, lessons, selectedClientId: clients[0]?.id || null, viewDate: iso(new Date(today.getFullYear(), today.getMonth(), 1)), dismissedAlerts: [] };
}

module.exports = { buildDemoState };
