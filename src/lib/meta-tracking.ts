/** LAND-IA: uma ação, um ID para Pixel e CAPI. Nenhum valor monetário. */
export const META_PIXEL_ID = "2148386099070117";
export const TRACKING_SOURCE = "landia_tracking_v5";
const ENDPOINT = "https://metamove-capi.hebrithan.workers.dev";
const ORIGINS = new Set(["https://metamove.online", "https://www.metamove.online"]);
const EVENTS = new Set([
  "PageView", "ViewContent", "InitiateCheckout", "TimeOnPage",
  "VSL_Play", "VSL_25", "VSL_50", "VSL_75", "VSL_Complete",
]);
export type MetaEventName =
  | "PageView" | "ViewContent" | "InitiateCheckout" | "TimeOnPage"
  | "VSL_Play" | "VSL_25" | "VSL_50" | "VSL_75" | "VSL_Complete";
export type CtaPosition = "pagina" | "sticky" | "vsl" | "oferta" | "resultado-final";
type Details = { cta_position?: CtaPosition };
type MetaData = Record<string, string | number>;
type Session = { token: string; expires_at: number; clockOffset: number };
type State = {
  pageId: string;
  once: Set<string>;
  lastCheckout: number;
  session?: Session;
  sessionPromise?: Promise<Session>;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    __landiaTrackingV5?: State;
  }
}

function uuid() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function state() {
  return window.__landiaTrackingV5 ??= {
    pageId: uuid(), once: new Set(), lastCheckout: -Infinity,
  };
}

function cookie(name: string) {
  try {
    const part = document.cookie.split(";").map((item) => item.trim())
      .find((item) => item.startsWith(`${name}=`));
    return part ? decodeURIComponent(part.slice(name.length + 1)) : undefined;
  } catch { return undefined; }
}

function setCookie(name: string, value: string) {
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Domain=metamove.online; Max-Age=7776000; SameSite=Lax; Secure`;
  } catch { /* Cookies indisponíveis: o evento continua sem inventar um cookie persistido. */ }
}

function matchingData() {
  // _fbp é um identificador aleatório do navegador, não uma identidade pessoal.
  if (!cookie("_fbp")) {
    setCookie("_fbp", `fb.1.${Date.now()}.${crypto.getRandomValues(new Uint32Array(1))[0]}`);
  }
  const clickId = new URL(window.location.href).searchParams.get("fbclid");
  const oldFbc = cookie("_fbc");
  // _fbc só nasce de um fbclid realmente presente no link; nunca sintetizamos um clique.
  if (clickId && /^[A-Za-z0-9._~-]{1,500}$/.test(clickId) && !oldFbc?.endsWith(`.${clickId}`)) {
    setCookie("_fbc", `fb.1.${Date.now()}.${clickId}`);
  }
  return { fbp: cookie("_fbp"), fbc: cookie("_fbc") };
}

function sourceUrl() {
  const url = new URL(window.location.href);
  const safe = new URL(url.pathname, url.origin);
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"]) {
    const value = url.searchParams.get(key);
    if (value && value.length <= 200) safe.searchParams.set(key, value);
  }
  return safe.href;
}

function dataFor(name: MetaEventName, details: Details): MetaData {
  const common = { tracking_source: TRACKING_SOURCE };
  if (name === "ViewContent" || name === "InitiateCheckout") {
    return {
      ...common, content_name: "LAND-IA", content_type: "product",
      ...(name === "InitiateCheckout" ? { cta_position: details.cta_position ?? "pagina" } : {}),
    };
  }
  if (name.startsWith("VSL_")) {
    const progress = name === "VSL_Play" ? 0 : name === "VSL_Complete" ? 100 : Number(name.slice(4));
    return { ...common, content_name: "Land-IA VSL", content_category: "video", progress };
  }
  return name === "TimeOnPage" ? { ...common, seconds: 30 } : common;
}

async function getSession(): Promise<Session> {
  const s = state();
  if (s.session && s.session.expires_at * 1000 > Date.now() + s.session.clockOffset + 60000) return s.session;
  if (s.sessionPromise) return s.sessionPromise;
  s.sessionPromise = (async () => {
    const response = await fetch(`${ENDPOINT}/session`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "omit", keepalive: true,
      body: JSON.stringify({ page_id: s.pageId, event_source_url: sourceUrl() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`session:${response.status}`);
    const result = await response.json();
    if (typeof result.token !== "string" || !Number.isFinite(result.expires_at) || !Number.isFinite(result.server_time)) {
      throw new Error("invalid-session");
    }
    return s.session = {
      token: result.token, expires_at: result.expires_at,
      clockOffset: result.server_time * 1000 - Date.now(),
    };
  })();
  try { return await s.sessionPromise; } finally { s.sessionPromise = undefined; }
}

async function sendServer(name: MetaEventName, eventId: string, data: MetaData, occurredAt: number) {
  // Tentativas sempre reutilizam o ID original, inclusive quando a resposta se perde.
  let eventTime: number | undefined;
  const url = sourceUrl();
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const session = await getSession();
      eventTime ??= Math.floor((occurredAt + session.clockOffset) / 1000);
      const response = await fetch(`${ENDPOINT}/events`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "omit", keepalive: true,
        body: JSON.stringify({
          session_token: session.token, event_name: name, event_id: eventId,
          event_time: eventTime, event_source_url: url,
          ...matchingData(), custom_data: data,
        }),
        signal: AbortSignal.timeout(12000),
      });
      if (response.ok) return;
      if (response.status === 401 && attempt < 2) {
        state().session = undefined;
      } else if (![429, 502, 503, 504].includes(response.status)) {
        console.warn(`[Land-IA] Evento recusado: ${name} (${response.status}).`);
        return;
      }
    } catch { /* Uma nova tentativa usa o mesmo ID; nunca criamos uma nova conversão. */ }
    if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 1000 * (attempt + 1)));
  }
  console.warn(`[Land-IA] CAPI indisponível para ${name}; o envio do Pixel é independente.`);
}

export function sendFacebookEvent(name: MetaEventName, details: Details = {}) {
  if (typeof window === "undefined" || !ORIGINS.has(window.location.origin) || !EVENTS.has(name)) return;
  const s = state();
  if (name === "InitiateCheckout") {
    const now = performance.now();
    if (now - s.lastCheckout < 1000) return; // Protege o duplo clique, sem bloquear uma visita posterior.
    s.lastCheckout = now;
  } else {
    if (s.once.has(name)) return;
    s.once.add(name);
  }
  const eventId = uuid();
  const data = dataFor(name, details);
  const occurredAt = Date.now();
  matchingData();
  try {
    window.fbq?.(
      name.startsWith("VSL_") || name === "TimeOnPage" ? "trackSingleCustom" : "trackSingle",
      META_PIXEL_ID, name, data, { eventID: eventId },
    );
  } catch { /* Falha no Pixel não interrompe a API nem a navegação. */ }
  void sendServer(name, eventId, data, occurredAt);
}

export function trackCheckout(position: CtaPosition, event: Event) {
  // Barreira contra cliques sintéticos simples; não é autenticação de rede.
  if (!event.isTrusted) return;
  sendFacebookEvent("InitiateCheckout", { cta_position: position });
}
