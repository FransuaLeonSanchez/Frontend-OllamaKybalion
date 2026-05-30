import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Braces, List } from "lucide-react";
import { JsonEditor } from "./JsonEditor";
import { KeyValueEditor } from "./KeyValueEditor";
import { AuthFields } from "./AuthFields";
import {
  AuthConfig,
  BodyMode,
  HttpMethod,
  KeyValue,
} from "@/types/api";
import { methodAllowsBody } from "@/utils/requestUtils";

interface RequestEditorProps {
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

export const RequestEditor = ({
  httpMethod,
  bodyMode,
  bodyPairs,
  bodyJson,
  headers,
  auth,
  onBodyModeChange,
  onBodyPairsChange,
  onBodyJsonChange,
  onHeadersChange,
  onAuthChange,
}: RequestEditorProps) => {
  const activeHeaders = headers.filter((h) => h.enabled && h.key.trim()).length;
  const authActive = auth.type !== "none";
  const allowsBody = methodAllowsBody(httpMethod);

  return (
    <Tabs defaultValue="body" className="flex flex-col h-full min-h-0">
      <TabsList className="shrink-0 self-start">
        <TabsTrigger value="body">Body</TabsTrigger>
        <TabsTrigger value="headers">
          Headers
          {activeHeaders > 0 && (
            <span className="ml-1.5 rounded-full bg-accent/20 px-1.5 text-[10px] text-accent">
              {activeHeaders}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="auth">
          Auth
          {authActive && <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-accent" />}
        </TabsTrigger>
      </TabsList>

      {/* BODY */}
      <TabsContent
        value="body"
        className="flex-1 min-h-0 mt-2 data-[state=inactive]:hidden"
      >
        {!allowsBody ? (
          <p className="text-xs text-muted-foreground pt-2">
            El verbo <span className="font-mono">{httpMethod}</span> no envía
            cuerpo. Cambia a POST/PUT/PATCH/DELETE para incluir un body.
          </p>
        ) : (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <Label className="text-sm font-medium">Body</Label>
              <div className="flex gap-1">
                <Button
                  variant={bodyMode === "campos" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onBodyModeChange("campos")}
                  className="h-7 text-xs gap-1.5"
                >
                  <List className="h-3.5 w-3.5" />
                  Campos
                </Button>
                <Button
                  variant={bodyMode === "json" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onBodyModeChange("json")}
                  className="h-7 text-xs gap-1.5"
                >
                  <Braces className="h-3.5 w-3.5" />
                  JSON
                </Button>
              </div>
            </div>

            {bodyMode === "campos" ? (
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <KeyValueEditor
                  rows={bodyPairs}
                  onChange={onBodyPairsChange}
                  keyPlaceholder="parametro"
                  valuePlaceholder="valor"
                  addLabel="Agregar campo"
                />
              </div>
            ) : (
              <div className="flex flex-col flex-1 min-h-0">
                <JsonEditor
                  id="custom-json"
                  placeholder='{"parametro1": "respuesta1"}'
                  value={bodyJson}
                  onChange={onBodyJsonChange}
                />
              </div>
            )}
          </div>
        )}
      </TabsContent>

      {/* HEADERS */}
      <TabsContent
        value="headers"
        className="flex-1 min-h-0 mt-2 overflow-y-auto pr-1 data-[state=inactive]:hidden"
      >
        <KeyValueEditor
          rows={headers}
          onChange={onHeadersChange}
          keyPlaceholder="Header"
          valuePlaceholder="valor"
          addLabel="Agregar header"
        />
      </TabsContent>

      {/* AUTH */}
      <TabsContent
        value="auth"
        className="flex-1 min-h-0 mt-2 overflow-y-auto pr-1 data-[state=inactive]:hidden"
      >
        <AuthFields auth={auth} onChange={onAuthChange} />
      </TabsContent>
    </Tabs>
  );
};
