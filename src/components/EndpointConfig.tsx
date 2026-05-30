import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointConfig, EndpointId, HttpMethod } from "@/types/api";
import { buildUrl } from "@/utils/requestUtils";

interface EndpointConfigProps {
  config: EndpointConfig;
  onConfigChange: (config: Partial<EndpointConfig>) => void;
}

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const inputClass =
  "h-9 font-mono text-sm bg-secondary/50 border-border/50 focus:border-accent transition-colors";

export const EndpointConfigComponent = ({
  config,
  onConfigChange,
}: EndpointConfigProps) => {
  const isPersonalizado = config.endpoint === "personalizado";

  return (
    <Card className="border-border/50 shadow-lg shrink-0">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-secondary/30 py-2 sm:py-2.5">
        <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Configuración del Endpoint
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-3 pb-2 sm:pb-3 space-y-2 sm:space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
          <div className="space-y-1.5">
            <Label htmlFor="ip" className="text-xs font-medium">
              Dirección IP
            </Label>
            <Input
              id="ip"
              placeholder="192.168.1.207"
              value={config.ip}
              onChange={(e) => onConfigChange({ ip: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="port" className="text-xs font-medium">
              Puerto
            </Label>
            <Input
              id="port"
              placeholder="5001"
              value={config.port}
              onChange={(e) => onConfigChange({ port: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
            <Label htmlFor="endpoint" className="text-xs font-medium">
              Endpoint
            </Label>
            <Select
              value={config.endpoint}
              onValueChange={(value) =>
                onConfigChange({ endpoint: value as EndpointId })
              }
            >
              <SelectTrigger
                id="endpoint"
                className="h-9 text-sm bg-secondary/50 border-border/50 focus:border-accent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">/test</SelectItem>
                <SelectItem value="question">/question</SelectItem>
                <SelectItem value="custom">/custom</SelectItem>
                <SelectItem value="personalizado">Personalizado…</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Verbo HTTP + ruta (solo endpoint personalizado) */}
        {isPersonalizado && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="verb" className="text-xs font-medium">
                Verbo HTTP
              </Label>
              <Select
                value={config.httpMethod}
                onValueChange={(value) =>
                  onConfigChange({ httpMethod: value as HttpMethod })
                }
              >
                <SelectTrigger
                  id="verb"
                  className="h-9 text-sm bg-secondary/50 border-border/50 focus:border-accent"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HTTP_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="path" className="text-xs font-medium">
                Ruta
              </Label>
              <Input
                id="path"
                placeholder="/mi-endpoint"
                value={config.customPath}
                onChange={(e) => onConfigChange({ customPath: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        )}

        <div className="p-2 bg-secondary/30 rounded-lg border border-border/30">
          <p className="text-[10px] text-muted-foreground mb-0.5">
            URL completa:
          </p>
          <p className="font-mono text-xs text-accent break-all">
            <span className="text-primary font-semibold">
              {isPersonalizado ? config.httpMethod : "POST"}
            </span>{" "}
            {buildUrl(config)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
