// INSTRUMENTACIÓN DE EVENTOS
// Cada evento se guarda con id, tipo, fecha, sesión, usuario y payload.
// Ahora mismo se persiste durante la pestaña actual + consola estructurada.
// Cuando tengáis backend, sustituid la función `persist` por un POST a /api/events.

const KEY = 'ucam_events'

export const EVENT_TYPES = [
  'product.viewed',
  'cart.item_added',
  'checkout.started',
  'order.created',
  'payment.simulated',
  'support.requested',
  'order.status_changed',
]

function getSessionId() {
  let id = sessionStorage.getItem('ucam_session')
  if (!id) {
    id = 'ses_' + Math.random().toString(36).slice(2, 10)
    sessionStorage.setItem('ucam_session', id)
  }
  return id
}

function currentUserEmail() {
  try {
    return JSON.parse(sessionStorage.getItem('ucam_user'))?.email ?? null
  } catch {
    return null
  }
}

export function getEvents() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

function persist(event) {
  const all = getEvents()
  all.push(event)
  sessionStorage.setItem(KEY, JSON.stringify(all))
}

export function trackEvent(type, payload = {}) {
  const event = {
    id: 'evt_' + Math.random().toString(36).slice(2, 10),
    type,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    user: currentUserEmail(),
    payload,
  }
  persist(event)
  console.log('[event]', JSON.stringify(event))
  return event
}

export function clearEvents() {
  sessionStorage.removeItem(KEY)
}

export function downloadEvents(events, format = 'json') {
  let content, mime, ext
  if (format === 'csv') {
    const rows = ['id,type,timestamp,sessionId,user,payload']
    events.forEach((e) =>
      rows.push([e.id, e.type, e.timestamp, e.sessionId, e.user ?? '', JSON.stringify(e.payload).replaceAll('"', '""')]
        .map((v) => `"${v}"`).join(','))
    )
    content = rows.join('\n'); mime = 'text/csv'; ext = 'csv'
  } else {
    content = JSON.stringify(events, null, 2); mime = 'application/json'; ext = 'json'
  }
  const url = URL.createObjectURL(new Blob([content], { type: mime }))
  const a = document.createElement('a')
  a.href = url
  a.download = `ucam-events.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}
