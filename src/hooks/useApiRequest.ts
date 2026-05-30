import { useCallback, useState } from "react";
import { toast } from "sonner";
import { RequestDescriptor, RequestResult } from "@/types/api";

/** Lee el body de la respuesta como JSON si se puede, si no como texto. */
const parseResponseBody = async (
  res: Response
): Promise<{ data: unknown; sizeBytes: number }> => {
  const raw = await res.text();
  const sizeBytes = new Blob([raw]).size;
  if (!raw) return { data: null, sizeBytes };
  try {
    return { data: JSON.parse(raw), sizeBytes };
  } catch {
    return { data: raw, sizeBytes };
  }
};

/** Traduce errores de fetch a mensajes entendibles. */
const describeNetworkError = (error: unknown): string => {
  if (error instanceof TypeError) {
    // fetch lanza TypeError ante fallos de red / CORS / host inalcanzable
    return "No se pudo conectar. Verifica IP, puerto, que el servidor esté activo y que permita CORS.";
  }
  return error instanceof Error ? error.message : "Error desconocido";
};

export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RequestResult | null>(null);

  const sendRequest = useCallback(async (req: RequestDescriptor) => {
    setLoading(true);
    setResult(null);

    const start = performance.now();

    try {
      const res = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });

      const { data, sizeBytes } = await parseResponseBody(res);
      const durationMs = performance.now() - start;

      setResult({
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        durationMs,
        sizeBytes,
        data,
        isError: false,
      });

      if (res.ok) {
        toast.success(`Solicitud exitosa (${res.status})`);
      } else {
        toast.error(`El servidor respondió ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      const durationMs = performance.now() - start;
      const message = describeNetworkError(error);
      console.error(error);
      toast.error(message);
      setResult({
        ok: false,
        status: null,
        statusText: "Error de red",
        durationMs,
        sizeBytes: 0,
        data: { error: message },
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, result, sendRequest };
};
