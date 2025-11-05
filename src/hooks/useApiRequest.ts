import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ResponseData, EndpointConfig, EndpointType, FormData, InputFormat } from "@/types/api";
import { buildRequestBody, validateFormData } from "@/utils/jsonUtils";

export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);

  const sendRequest = useCallback(
    async (
      config: EndpointConfig,
      formData: FormData,
      inputFormat: InputFormat,
      jsonInput: string
    ) => {
      setLoading(true);
      setResponse(null);

      const error = validateFormData(
        config.method,
        formData,
        inputFormat,
        jsonInput
      );
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }

      try {
        const url = `http://${config.ip}:${config.port}/${config.method}`;
        const body = buildRequestBody(
          config.method,
          formData,
          jsonInput,
          inputFormat
        );

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setResponse(data);
        toast.success("Solicitud exitosa");
      } catch (error) {
        console.error(error);
        toast.error("Error al realizar la solicitud");
        setResponse({
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, response, sendRequest };
};

