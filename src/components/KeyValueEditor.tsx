import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { KeyValue } from "@/types/api";
import { emptyRow } from "@/utils/requestUtils";

interface KeyValueEditorProps {
  rows: KeyValue[];
  onChange: (rows: KeyValue[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
}

/**
 * Editor estilo Postman: filas clave-valor con checkbox para activar/desactivar,
 * botón de borrar por fila y un "+" para añadir campos (sin escribir llaves).
 */
export const KeyValueEditor = ({
  rows,
  onChange,
  keyPlaceholder = "clave",
  valuePlaceholder = "valor",
  addLabel = "Agregar campo",
}: KeyValueEditorProps) => {
  const update = (id: string, patch: Partial<KeyValue>) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const remove = (id: string) => {
    const next = rows.filter((r) => r.id !== id);
    onChange(next.length ? next : [emptyRow()]);
  };

  const add = () => onChange([...rows, emptyRow()]);

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={row.enabled}
            onChange={(e) => update(row.id, { enabled: e.target.checked })}
            title={row.enabled ? "Campo activo" : "Campo ignorado"}
            className="h-4 w-4 shrink-0 accent-accent cursor-pointer"
          />
          <Input
            placeholder={keyPlaceholder}
            value={row.key}
            onChange={(e) => update(row.id, { key: e.target.value })}
            className={`h-9 font-mono text-sm bg-secondary/50 border-border/50 focus:border-accent ${
              row.enabled ? "" : "opacity-50"
            }`}
          />
          <span className="text-muted-foreground text-sm shrink-0">:</span>
          <Input
            placeholder={valuePlaceholder}
            value={row.value}
            onChange={(e) => update(row.id, { value: e.target.value })}
            className={`h-9 font-mono text-sm bg-secondary/50 border-border/50 focus:border-accent ${
              row.enabled ? "" : "opacity-50"
            }`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => remove(row.id)}
            title="Eliminar campo"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={add}
        className="h-8 self-start text-xs gap-1.5 mt-1"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </Button>
    </div>
  );
};
