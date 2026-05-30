import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Code, FileText, Copy } from "lucide-react";
import { toast } from "sonner";
import { RequestResult, OutputFormat } from "@/types/api";
import { copyText, formatBytes, formatDuration } from "@/utils/requestUtils";

interface OutputSectionProps {
  result: RequestResult | null;
}

const renderField = (
  key: string,
  value: unknown,
  level: number = 0
): JSX.Element => {
  const isNested = level > 0;
  const indentStyle = level > 0 ? { marginLeft: `${level * 16}px` } : {};

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
    return (
      <div key={key} className="space-y-3" style={indentStyle}>
        <Label
          className={`text-sm font-medium capitalize ${
            isNested ? "text-muted-foreground" : ""
          }`}
        >
          {key}
        </Label>
        {value.map((item, index) => (
          <div
            key={index}
            className="bg-secondary/30 p-3 rounded-lg border border-border/30 space-y-2"
          >
            <div className="text-xs font-medium text-muted-foreground mb-2">
              {key} #{index + 1}
            </div>
            {Object.entries(item as Record<string, unknown>).map(
              ([subKey, subValue]) => renderField(subKey, subValue, level + 1)
            )}
          </div>
        ))}
      </div>
    );
  }

  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return (
      <div key={key} className="space-y-3" style={indentStyle}>
        <Label
          className={`text-sm font-medium capitalize ${
            isNested ? "text-muted-foreground" : ""
          }`}
        >
          {key}
        </Label>
        <div className="bg-secondary/30 p-3 rounded-lg border border-border/30 space-y-2">
          {Object.entries(value as Record<string, unknown>).map(
            ([subKey, subValue]) => renderField(subKey, subValue, level + 1)
          )}
        </div>
      </div>
    );
  }

  return (
    <div key={key} className="space-y-2" style={indentStyle}>
      <Label
        className={`text-sm font-medium capitalize ${
          isNested ? "text-muted-foreground" : ""
        }`}
      >
        {key}
      </Label>
      <Textarea
        value={
          Array.isArray(value)
            ? JSON.stringify(value, null, 2)
            : value === null
            ? "null"
            : String(value)
        }
        readOnly
        className="bg-secondary/50 border-border/50 text-sm font-mono resize-none min-h-[60px]"
      />
    </div>
  );
};

const renderFormatted = (data: unknown): JSX.Element => {
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) {
      return (
        <div className="text-sm text-muted-foreground">
          No hay datos para mostrar
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {entries.map(([key, value]) => renderField(key, value, 0))}
      </div>
    );
  }

  // string / número / array en raíz
  return (
    <Textarea
      value={typeof data === "string" ? data : JSON.stringify(data, null, 2)}
      readOnly
      className="bg-secondary/50 border-border/50 text-sm font-mono resize-none min-h-[120px]"
    />
  );
};

const statusColor = (result: RequestResult): string => {
  if (result.isError || result.status === null) return "bg-destructive";
  if (result.status >= 200 && result.status < 300) return "bg-green-500";
  if (result.status >= 400) return "bg-destructive";
  return "bg-yellow-500";
};

const asText = (data: unknown): string =>
  typeof data === "string" ? data : JSON.stringify(data, null, 2);

export const OutputSection = ({ result }: OutputSectionProps) => {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("json");

  const handleCopy = async () => {
    if (!result) return;
    const ok = await copyText(asText(result.data));
    if (ok) toast.success("Respuesta copiada");
    else toast.error("No se pudo copiar");
  };

  return (
    <Card className="border-border/50 shadow-lg flex flex-col min-h-0">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-secondary/30 py-2 sm:py-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 flex-wrap">
            {result && (
              <span
                className={`h-2 w-2 rounded-full ${statusColor(result)}`}
              />
            )}
            Output
            {result && (
              <span className="flex items-center gap-2 text-[11px] font-normal text-muted-foreground">
                <span className="font-mono">
                  {result.status !== null
                    ? `${result.status} ${result.statusText}`.trim()
                    : "Sin respuesta"}
                </span>
                <span>·</span>
                <span>{formatDuration(result.durationMs)}</span>
                {!result.isError && (
                  <>
                    <span>·</span>
                    <span>{formatBytes(result.sizeBytes)}</span>
                  </>
                )}
              </span>
            )}
          </CardTitle>
          {result && (
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8 text-xs gap-1.5"
                title="Copiar respuesta"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setOutputFormat((prev) =>
                    prev === "json" ? "formulario" : "json"
                  )
                }
                className="h-8 text-xs gap-1.5"
              >
                {outputFormat === "json" ? (
                  <>
                    <FileText className="h-3.5 w-3.5" />
                    Formulario
                  </>
                ) : (
                  <>
                    <Code className="h-3.5 w-3.5" />
                    JSON
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-3 sm:pt-4 flex-1 overflow-hidden min-h-0 bg-card">
        {result ? (
          <div className="h-full overflow-y-auto overflow-x-auto">
            {outputFormat === "json" ? (
              <pre className="bg-secondary/50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm border border-border/50 font-mono text-foreground whitespace-pre-wrap break-words max-w-full">
                <code className="break-words">{asText(result.data)}</code>
              </pre>
            ) : (
              <div className="space-y-3">{renderFormatted(result.data)}</div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <p className="text-xs sm:text-sm">La respuesta aparecerá aquí</p>
              <p className="text-[10px] sm:text-xs">
                Configura los parámetros y envía la solicitud
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
