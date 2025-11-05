import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointType, EndpointConfig } from "@/types/api";

interface EndpointConfigProps {
  config: EndpointConfig;
  onConfigChange: (config: Partial<EndpointConfig>) => void;
}

export const EndpointConfigComponent = ({
  config,
  onConfigChange,
}: EndpointConfigProps) => {
  return (
    <Card className="border-border/50 shadow-lg shrink-0">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-secondary/30 py-2 sm:py-2.5">
        <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Configuración del Endpoint
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-3 pb-2 sm:pb-3">
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
              className="h-9 font-mono text-sm bg-secondary/50 border-border/50 focus:border-accent transition-colors"
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
              className="h-9 font-mono text-sm bg-secondary/50 border-border/50 focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
            <Label htmlFor="method" className="text-xs font-medium">
              Método
            </Label>
            <Select
              value={config.method}
              onValueChange={(value) =>
                onConfigChange({ method: value as EndpointType })
              }
            >
              <SelectTrigger
                id="method"
                className="h-9 text-sm bg-secondary/50 border-border/50 focus:border-accent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">POST /test</SelectItem>
                <SelectItem value="question">POST /question</SelectItem>
                <SelectItem value="custom">POST /custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-2 sm:mt-2.5 p-2 bg-secondary/30 rounded-lg border border-border/30">
          <p className="text-[10px] text-muted-foreground mb-0.5">
            URL completa:
          </p>
          <p className="font-mono text-xs text-accent break-all">
            http://{config.ip}:{config.port}/{config.method}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

