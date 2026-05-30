import {
  AuthConfig,
  EndpointConfig,
  HttpMethod,
  KeyValue,
  RequestDescriptor,
} from "@/types/api";

// IDs estables sin depender de crypto.randomUUID (no disponible en http://IP)
let idCounter = 0;
export const newId = (): string => `kv_${++idCounter}`;

export const emptyRow = (): KeyValue => ({
  id: newId(),
  key: "",
  value: "",
  enabled: true,
});

export const rowsFrom = (
  entries: Array<[string, string]>,
  enabled = true
): KeyValue[] =>
  entries.map(([key, value]) => ({ id: newId(), key, value, enabled }));

/**
 * Convierte el texto de una cajita al tipo JSON más adecuado:
 * true/false/null y números -> nativo, {..}/[..] -> JSON, resto -> string.
 */
export const coerceValue = (raw: string): unknown => {
  const t = raw.trim();
  if (t === "") return "";
  if (t === "true") return true;
  if (t === "false") return false;
  if (t === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  if (t[0] === "{" || t[0] === "[") {
    try {
      return JSON.parse(t);
    } catch {
      return raw;
    }
  }
  return raw;
};

/** Filas habilitadas con clave no vacía -> objeto JS (con coerción de valores). */
export const pairsToObject = (pairs: KeyValue[]): Record<string, unknown> => {
  const obj: Record<string, unknown> = {};
  for (const p of pairs) {
    if (!p.enabled) continue;
    const key = p.key.trim();
    if (!key) continue;
    obj[key] = coerceValue(p.value);
  }
  return obj;
};

/** Objeto JS -> filas clave-valor (los no-string se muestran como JSON). */
export const objectToPairs = (obj: Record<string, unknown>): KeyValue[] => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return [emptyRow()];
  return entries.map(([key, value]) => ({
    id: newId(),
    key,
    value: typeof value === "string" ? value : JSON.stringify(value),
    enabled: true,
  }));
};

export const pairsToJsonString = (pairs: KeyValue[]): string =>
  JSON.stringify(pairsToObject(pairs), null, 2);

/** Intenta parsear un objeto JSON plano. Devuelve null si no es un objeto. */
export const tryParseJsonObject = (
  str: string
): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(str);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
};

/** Normaliza la ruta del endpoint asegurando un único "/" inicial. */
export const resolvePath = (config: EndpointConfig): string => {
  if (config.endpoint === "personalizado") {
    const raw = config.customPath.trim();
    if (!raw) return "/";
    return raw.startsWith("/") ? raw : `/${raw}`;
  }
  return `/${config.endpoint}`;
};

export const buildUrl = (config: EndpointConfig): string => {
  const path = resolvePath(config);
  return `http://${config.ip}:${config.port}${path}`;
};

/** Construye los headers finales fusionando headers manuales + autenticación. */
export const buildHeaders = (
  headers: KeyValue[],
  auth: AuthConfig,
  hasBody: boolean
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const h of headers) {
    if (!h.enabled) continue;
    const key = h.key.trim();
    if (!key) continue;
    result[key] = h.value;
  }

  // La autenticación se aplica al final (puede sobrescribir un header manual)
  if (auth.type === "bearer" && auth.token.trim()) {
    result["Authorization"] = `Bearer ${auth.token.trim()}`;
  } else if (auth.type === "apikey" && auth.apiKeyName.trim()) {
    result[auth.apiKeyName.trim()] = auth.apiKeyValue;
  } else if (auth.type === "basic" && auth.basicUser) {
    result["Authorization"] = `Basic ${btoa(
      `${auth.basicUser}:${auth.basicPass}`
    )}`;
  }

  // Asegura Content-Type cuando hay body y no se definió uno
  if (hasBody && !Object.keys(result).some((k) => k.toLowerCase() === "content-type")) {
    result["Content-Type"] = "application/json";
  }

  return result;
};

export const methodAllowsBody = (method: HttpMethod): boolean =>
  method !== "GET";

/** Genera el comando cURL equivalente a la petición. */
export const buildCurl = (req: RequestDescriptor): string => {
  const lines: string[] = [`curl -X ${req.method} '${req.url}'`];
  for (const [key, value] of Object.entries(req.headers)) {
    lines.push(`  -H '${key}: ${value}'`);
  }
  if (req.body !== undefined) {
    // Escapa comillas simples para shells POSIX
    const safe = req.body.replace(/'/g, `'\\''`);
    lines.push(`  -d '${safe}'`);
  }
  return lines.join(" \\\n");
};

/** Copia texto al portapapeles con fallback para contextos http (no seguros). */
export const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // cae al fallback
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};
