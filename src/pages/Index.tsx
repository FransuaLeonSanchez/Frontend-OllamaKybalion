import { useState, useEffect, useCallback } from "react";
import { EndpointConfigComponent } from "@/components/EndpointConfig";
import { InputSection } from "@/components/InputSection";
import { OutputSection } from "@/components/OutputSection";
import { useApiRequest } from "@/hooks/useApiRequest";
import { EndpointConfig, FormData, InputFormat } from "@/types/api";
import { generateBaseJson, parseJsonToFormData } from "@/utils/jsonUtils";

const Index = () => {
  const [config, setConfig] = useState<EndpointConfig>({
    ip: "192.168.1.207",
    port: "5001",
    method: "test",
  });

  const [inputFormat, setInputFormat] = useState<InputFormat>("formulario");
  const [jsonInput, setJsonInput] = useState("");

  const [formData, setFormData] = useState<FormData>({
    testText: "",
    testQuestion: "",
    questionPrompt: "",
    questionText: "",
    customJson: JSON.stringify(
      {
        parametro1: "respuesta1"
      },
      null,
      2
    ),
  });

  const { loading, response, sendRequest } = useApiRequest();

  const generateJson = useCallback(() => {
    return generateBaseJson(config.method, formData);
  }, [config.method, formData]);

  // Cuando cambia el método a custom, establecer formato JSON y cargar el ejemplo
  useEffect(() => {
    if (config.method === "custom") {
      setInputFormat("json");
      // Usar el JSON de ejemplo que ya está inicializado en formData.customJson
      setJsonInput(formData.customJson);
    }
  }, [config.method, formData.customJson]);

  useEffect(() => {
    if (inputFormat === "json" && config.method !== "custom") {
      setJsonInput(generateJson());
    }
  }, [inputFormat, generateJson, config.method]);

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    if (config.method === "custom") {
      setFormData((prev) => ({ ...prev, customJson: value }));
    } else {
      const parsed = parseJsonToFormData(value, config.method);
      setFormData((prev) => ({ ...prev, ...parsed }));
    }
  };

  const handleSubmit = () => {
    sendRequest(config, formData, inputFormat, jsonInput);
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
          {/* Input Section */}
          <InputSection
            method={config.method}
            formData={formData}
            inputFormat={inputFormat}
            jsonInput={jsonInput}
            loading={loading}
            onFormDataChange={(updates) =>
              setFormData((prev) => ({ ...prev, ...updates }))
            }
            onJsonChange={handleJsonChange}
            onFormatToggle={() =>
              setInputFormat((prev) =>
                prev === "formulario" ? "json" : "formulario"
              )
            }
            onSubmit={handleSubmit}
          />

          {/* Output Section */}
          <OutputSection response={response} />
        </div>
      </div>
    </div>
  );
};

export default Index;
