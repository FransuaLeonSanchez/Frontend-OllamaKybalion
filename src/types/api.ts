// Endpoints predefinidos + opción de ruta personalizada
export type PresetEndpoint = "test" | "question" | "custom";
export type EndpointId = PresetEndpoint | "personalizado";

// Verbos HTTP soportados
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Formato de entrada para los endpoints simples (test/question)
export type InputFormat = "formulario" | "json";

// Modo de edición del body para custom/personalizado
export type BodyMode = "campos" | "json";

export type OutputFormat = "json" | "formulario";

// Tipo de autenticación
export type AuthType = "none" | "bearer" | "apikey" | "basic";

// Fila genérica clave-valor (body en modo campos, headers, etc.)
export interface KeyValue {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface AuthConfig {
  type: AuthType;
  token: string; // Bearer
  apiKeyName: string; // nombre del header para API Key
  apiKeyValue: string; // valor del API Key
  basicUser: string; // Basic auth
  basicPass: string;
}

export interface EndpointConfig {
  ip: string;
  port: string;
  endpoint: EndpointId;
  customPath: string; // usado cuando endpoint === "personalizado"
  httpMethod: HttpMethod;
}

export interface FormData {
  testText: string;
  testQuestion: string;
  questionPrompt: string;
  questionText: string; // Campo opcional para question
}

export interface ResponseData {
  [key: string]: unknown;
}

// Resultado enriquecido de una petición (status, tiempo, tamaño)
export interface RequestResult {
  ok: boolean;
  status: number | null;
  statusText: string;
  durationMs: number;
  sizeBytes: number;
  data: unknown; // body parseado (JSON) o texto
  isError: boolean; // error de red / cliente (no respuesta del servidor)
}

// Descriptor de petición listo para fetch
export interface RequestDescriptor {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string; // JSON serializado, ausente en GET/HEAD
}
