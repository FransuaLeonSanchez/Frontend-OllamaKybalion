import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EndpointConfigComponent } from "@/components/EndpointConfig";
import { InputSection } from "@/components/InputSection";
import { OutputSection } from "@/components/OutputSection";
import { useApiRequest } from "@/hooks/useApiRequest";
import {
  AuthConfig,
  BodyMode,
  EndpointConfig,
  FormData,
  InputFormat,
  KeyValue,
  PresetEndpoint,
  RequestDescriptor,
} from "@/types/api";
import {
  buildSimpleBody,
  generateBaseJson,
  validateSimpleForm,
} from "@/utils/jsonUtils";
import {
  buildCurl,
  buildHeaders,
  buildUrl,
  copyText,
  methodAllowsBody,
  objectToPairs,
  pairsToJsonString,
  pairsToObject,
  rowsFrom,
  tryParseJsonObject,
} from "@/utils/requestUtils";

const Index = () => {
  const [config, setConfig] = useState<EndpointConfig>({
    ip: "192.168.1.207",
    port: "5001",
    endpoint: "test",
    customPath: "/mi-endpoint",
    httpMethod: "POST",
  });

  // test / question
  const [inputFormat, setInputFormat] = useState<InputFormat>("formulario");
  const [jsonInput, setJsonInput] = useState("");
  const [formData, setFormData] = useState<FormData>({
    testText: "",
    testQuestion: "",
    questionPrompt: "",
    questionText: "",
  });

  // custom (editor JSON simple, como antes)
  const [customJson, setCustomJson] = useState(
    JSON.stringify({ parametro1: "respuesta1" }, null, 2)
  );

  // personalizado (estilo Postman)
  const [bodyMode, setBodyMode] = useState<BodyMode>("campos");
  const [bodyPairs, setBodyPairs] = useState<KeyValue[]>(
    rowsFrom([["parametro1", "respuesta1"]])
  );
  const [bodyJson, setBodyJson] = useState(
    JSON.stringify({ parametro1: "respuesta1" }, null, 2)
  );
  const [headers, setHeaders] = useState<KeyValue[]>(
    rowsFrom([["Content-Type", "application/json"]])
  );
  const [auth, setAuth] = useState<AuthConfig>({
    type: "none",
    token: "",
    apiKeyName: "X-API-Key",
    apiKeyValue: "",
    basicUser: "",
    basicPass: "",
  });

  const { loading, result, sendRequest } = useApiRequest();

  const isSimple = config.endpoint === "test" || config.endpoint === "question";

  // Al entrar a modo JSON (o cambiar de endpoint simple), generar el JSON desde el formulario
  useEffect(() => {
    if (isSimple && inputFormat === "json") {
      setJsonInput(generateBaseJson(config.endpoint as PresetEndpoint, formData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFormat, config.endpoint]);

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      if (config.endpoint === "test") {
        setFormData((prev) => ({
          ...prev,
          testText: parsed.text ?? "",
          testQuestion: parsed.question ?? "",
        }));
      } else if (config.endpoint === "question") {
        setFormData((prev) => ({
          ...prev,
          questionPrompt: parsed.prompt ?? "",
          questionText: parsed.text ?? "",
        }));
      }
    } catch {
      // JSON incompleto mientras se escribe: no sincronizar
    }
  };

  const handleBodyModeChange = (mode: BodyMode) => {
    if (mode === bodyMode) return;
    if (mode === "json") {
      setBodyJson(pairsToJsonString(bodyPairs));
      setBodyMode("json");
    } else {
      const obj = tryParseJsonObject(bodyJson);
      if (!obj) {
        toast.error("El JSON debe ser un objeto plano para verlo como campos");
        return;
      }
      setBodyPairs(objectToPairs(obj));
      setBodyMode("campos");
    }
  };

  /** Construye el descriptor de petición a partir del estado actual. */
  const buildDescriptor = (): {
    req: RequestDescriptor | null;
    error: string | null;
  } => {
    if (!config.ip.trim() || !config.port.trim()) {
      return { req: null, error: "Indica la IP y el puerto" };
    }

    const url = buildUrl(config);

    // test / question -> siempre POST con JSON
    if (isSimple) {
      const endpoint = config.endpoint as "test" | "question";
      const error = validateSimpleForm(
        endpoint,
        formData,
        inputFormat,
        jsonInput
      );
      if (error) return { req: null, error };
      const body = JSON.stringify(
        buildSimpleBody(endpoint, formData, jsonInput, inputFormat)
      );
      return {
        req: {
          url,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        },
        error: null,
      };
    }

    // custom -> POST con JSON libre (comportamiento original)
    if (config.endpoint === "custom") {
      let bodyObj: unknown;
      try {
        bodyObj = JSON.parse(customJson);
      } catch {
        return { req: null, error: "El JSON no es válido" };
      }
      return {
        req: {
          url,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObj),
        },
        error: null,
      };
    }

    // personalizado -> verbo + body (campos/json) + headers + auth
    if (!config.customPath.trim()) {
      return { req: null, error: "Escribe la ruta del endpoint personalizado" };
    }

    let body: string | undefined;
    if (methodAllowsBody(config.httpMethod)) {
      let bodyObj: unknown;
      if (bodyMode === "campos") {
        bodyObj = pairsToObject(bodyPairs);
      } else {
        try {
          bodyObj = JSON.parse(bodyJson);
        } catch {
          return { req: null, error: "El JSON del body no es válido" };
        }
      }
      body = JSON.stringify(bodyObj);
    }

    const finalHeaders = buildHeaders(headers, auth, body !== undefined);
    return {
      req: { url, method: config.httpMethod, headers: finalHeaders, body },
      error: null,
    };
  };

  const handleSubmit = () => {
    const { req, error } = buildDescriptor();
    if (error || !req) {
      toast.error(error ?? "No se pudo construir la petición");
      return;
    }
    sendRequest(req);
  };

  const handleCopyCurl = async () => {
    const { req, error } = buildDescriptor();
    if (error || !req) {
      toast.error(error ?? "No se pudo generar el cURL");
      return;
    }
    const ok = await copyText(buildCurl(req));
    if (ok) toast.success("Comando cURL copiado");
    else toast.error("No se pudo copiar el cURL");
  };

  return (
    <div className="h-screen bg-background p-3 sm:p-4 md:p-6 overflow-hidden flex flex-col">
      <div className="mx-auto w-full max-w-[1600px] flex flex-col flex-1 min-h-0 space-y-2 sm:space-y-3">
        {/* Header */}
        <div className="text-center space-y-1 shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            API Tester
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Prueba tus endpoints de forma simple y elegante
          </p>
        </div>

        {/* Endpoint Configuration */}
        <EndpointConfigComponent
          config={config}
          onConfigChange={(updates) =>
            setConfig((prev) => ({ ...prev, ...updates }))
          }
        />

        {/* Two Column Layout: Input and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 min-h-0">
          <InputSection
            endpoint={config.endpoint}
            loading={loading}
            onSubmit={handleSubmit}
            onCopyCurl={handleCopyCurl}
            formData={formData}
            inputFormat={inputFormat}
            jsonInput={jsonInput}
            onFormDataChange={(updates) =>
              setFormData((prev) => ({ ...prev, ...updates }))
            }
            onJsonChange={handleJsonChange}
            onFormatToggle={() =>
              setInputFormat((prev) =>
                prev === "formulario" ? "json" : "formulario"
              )
            }
            customJson={customJson}
            onCustomJsonChange={setCustomJson}
            httpMethod={config.httpMethod}
            bodyMode={bodyMode}
            bodyPairs={bodyPairs}
            bodyJson={bodyJson}
            headers={headers}
            auth={auth}
            onBodyModeChange={handleBodyModeChange}
            onBodyPairsChange={setBodyPairs}
            onBodyJsonChange={setBodyJson}
            onHeadersChange={setHeaders}
            onAuthChange={(patch) => setAuth((prev) => ({ ...prev, ...patch }))}
          />

          <OutputSection result={result} />
        </div>
      </div>
    </div>
  );
};

export default Index;
