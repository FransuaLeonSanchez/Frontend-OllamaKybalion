import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthConfig, AuthType } from "@/types/api";

interface AuthFieldsProps {
  auth: AuthConfig;
  onChange: (patch: Partial<AuthConfig>) => void;
}

const fieldClass =
  "h-9 font-mono text-sm bg-secondary/50 border-border/50 focus:border-accent";

export const AuthFields = ({ auth, onChange }: AuthFieldsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Tipo</Label>
        <Select
          value={auth.type}
          onValueChange={(value) => onChange({ type: value as AuthType })}
        >
          <SelectTrigger className="h-9 text-sm bg-secondary/50 border-border/50 focus:border-accent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin autenticación</SelectItem>
            <SelectItem value="bearer">Bearer Token</SelectItem>
            <SelectItem value="apikey">API Key (header)</SelectItem>
            <SelectItem value="basic">Basic Auth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {auth.type === "bearer" && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Token</Label>
          <Input
            placeholder="eyJhbG..."
            value={auth.token}
            onChange={(e) => onChange({ token: e.target.value })}
            className={fieldClass}
          />
          <p className="text-[10px] text-muted-foreground">
            Se envía como <span className="font-mono">Authorization: Bearer &lt;token&gt;</span>
          </p>
        </div>
      )}

      {auth.type === "apikey" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Nombre del header</Label>
            <Input
              placeholder="X-API-Key"
              value={auth.apiKeyName}
              onChange={(e) => onChange({ apiKeyName: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Valor</Label>
            <Input
              placeholder="tu-api-key"
              value={auth.apiKeyValue}
              onChange={(e) => onChange({ apiKeyValue: e.target.value })}
              className={fieldClass}
            />
          </div>
        </div>
      )}

      {auth.type === "basic" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Usuario</Label>
            <Input
              placeholder="usuario"
              value={auth.basicUser}
              onChange={(e) => onChange({ basicUser: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Contraseña</Label>
            <Input
              type="password"
              placeholder="••••••"
              value={auth.basicPass}
              onChange={(e) => onChange({ basicPass: e.target.value })}
              className={fieldClass}
            />
          </div>
        </div>
      )}

      {auth.type === "none" && (
        <p className="text-xs text-muted-foreground">
          La petición se envía sin cabecera de autenticación.
        </p>
      )}
    </div>
  );
};
