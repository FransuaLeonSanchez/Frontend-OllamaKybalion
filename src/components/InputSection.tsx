import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Code, FileText } from "lucide-react";
import { ParameterFields } from "./ParameterFields";
import { EndpointType, FormData, InputFormat } from "@/types/api";

interface InputSectionProps {
  method: EndpointType;
  formData: FormData;
  inputFormat: InputFormat;
  jsonInput: string;
  loading: boolean;
  onFormDataChange: (data: Partial<FormData>) => void;
  onJsonChange: (value: string) => void;
  onFormatToggle: () => void;
  onSubmit: () => void;
}

export const InputSection = ({
  method,
  formData,
  inputFormat,
  jsonInput,
  loading,
  onFormDataChange,
  onJsonChange,
  onFormatToggle,
  onSubmit,
}: InputSectionProps) => {
  return (
    <Card className="border-border/50 shadow-lg flex flex-col min-h-0">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-secondary/30 py-2 sm:py-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base">Input</CardTitle>
          {method !== "custom" && (
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
      </CardHeader>
      <CardContent className="pt-3 sm:pt-4 flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-hidden min-h-0">
          <ParameterFields
            method={method}
            formData={formData}
            inputFormat={inputFormat}
            jsonInput={jsonInput}
            onFormDataChange={onFormDataChange}
            onJsonChange={onJsonChange}
          />
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

