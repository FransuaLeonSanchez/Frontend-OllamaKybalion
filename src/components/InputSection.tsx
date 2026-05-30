import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Send, Code, FileText, Terminal } from "lucide-react";
import { ParameterFields } from "./ParameterFields";
import { RequestEditor } from "./RequestEditor";
import { JsonEditor } from "./JsonEditor";
import {
  AuthConfig,
  BodyMode,
  EndpointId,
  FormData,
  HttpMethod,
  InputFormat,
  KeyValue,
} from "@/types/api";

interface InputSectionProps {
  endpoint: EndpointId;
  loading: boolean;
  onSubmit: () => void;
  onCopyCurl: () => void;

  // test / question
  formData: FormData;
  inputFormat: InputFormat;
  jsonInput: string;
  onFormDataChange: (data: Partial<FormData>) => void;
  onJsonChange: (value: string) => void;
  onFormatToggle: () => void;

  // custom (editor JSON simple)
  customJson: string;
  onCustomJsonChange: (value: string) => void;

  // custom / personalizado
  httpMethod: HttpMethod;
  bodyMode: BodyMode;
  bodyPairs: KeyValue[];
  bodyJson: string;
  headers: KeyValue[];
  auth: AuthConfig;
  onBodyModeChange: (mode: BodyMode) => void;
  onBodyPairsChange: (rows: KeyValue[]) => void;
  onBodyJsonChange: (value: string) => void;
  onHeadersChange: (rows: KeyValue[]) => void;
  onAuthChange: (patch: Partial<AuthConfig>) => void;
}

export const InputSection = (props: InputSectionProps) => {
  const {
    endpoint,
    loading,
    onSubmit,
    onCopyCurl,
    formData,
    inputFormat,
    jsonInput,
    onFormDataChange,
    onJsonChange,
    onFormatToggle,
  } = props;

  const isPersonalizado = endpoint === "personalizado";
  const isCustom = endpoint === "custom";
  const isSimple = endpoint === "test" || endpoint === "question";

  return (
    <Card className="border-border/50 shadow-lg flex flex-col min-h-0">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-secondary/30 py-2 sm:py-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm sm:text-base">Input</CardTitle>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyCurl}
              className="h-8 text-xs gap-1.5"
              title="Copiar como comando cURL"
            >
              <Terminal className="h-3.5 w-3.5" />
              cURL
            </Button>
            {isSimple && (
              <Button
                variant="outline"
                size="sm"
                onClick={onFormatToggle}
                className="h-8 text-xs gap-1.5"
              >
                {inputFormat === "formulario" ? (
                  <>
                    <Code className="h-3.5 w-3.5" />
                    JSON
                  </>
                ) : (
                  <>
                    <FileText className="h-3.5 w-3.5" />
                    Formulario
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 sm:pt-4 flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-hidden min-h-0">
          {isPersonalizado ? (
            <RequestEditor
              httpMethod={props.httpMethod}
              bodyMode={props.bodyMode}
              bodyPairs={props.bodyPairs}
              bodyJson={props.bodyJson}
              headers={props.headers}
              auth={props.auth}
              onBodyModeChange={props.onBodyModeChange}
              onBodyPairsChange={props.onBodyPairsChange}
              onBodyJsonChange={props.onBodyJsonChange}
              onHeadersChange={props.onHeadersChange}
              onAuthChange={props.onAuthChange}
            />
          ) : isCustom ? (
            <div className="flex flex-col space-y-2 h-full min-h-0">
              <Label htmlFor="custom-json" className="text-sm font-medium">
                JSON
              </Label>
              <JsonEditor
                id="custom-json"
                placeholder='{"parametro1": "respuesta1"}'
                value={props.customJson}
                onChange={props.onCustomJsonChange}
              />
            </div>
          ) : (
            <ParameterFields
              method={endpoint as "test" | "question"}
              formData={formData}
              inputFormat={inputFormat}
              jsonInput={jsonInput}
              onFormDataChange={onFormDataChange}
              onJsonChange={onJsonChange}
            />
          )}
        </div>
        <Button
          onClick={onSubmit}
          disabled={loading}
          className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium shadow-lg hover:shadow-accent/20 transition-all mt-3 sm:mt-4 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              Enviando solicitud...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Enviar Solicitud
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
