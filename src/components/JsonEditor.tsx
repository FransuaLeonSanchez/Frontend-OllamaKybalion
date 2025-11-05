import { KeyboardEvent, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export const JsonEditor = ({
  value,
  onChange,
  placeholder,
  id,
}: JsonEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      // Obtener la indentación de la línea actual
      const lines = text.substring(0, start).split("\n");
      const currentLine = lines[lines.length - 1];
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : "";

      // Determinar si necesitamos más indentación
      const lastChar = currentLine.trim().slice(-1);
      const needsExtraIndent =
        lastChar === "{" || lastChar === "[" || lastChar === ":";

      const newIndent = needsExtraIndent
        ? indent + "  "
        : indent;

      const newValue =
        text.substring(0, start) +
        "\n" +
        newIndent +
        text.substring(end);

      onChange(newValue);

      // Posicionar el cursor después de la nueva línea
      setTimeout(() => {
        const newCursorPos = start + 1 + newIndent.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      if (e.shiftKey) {
        // Shift+Tab: eliminar indentación
        const lines = text.split("\n");
        const lineIndex = text.substring(0, start).split("\n").length - 1;
        const line = lines[lineIndex];

        if (line.startsWith("  ")) {
          lines[lineIndex] = line.substring(2);
          const newText = lines.join("\n");

          onChange(newText);
          setTimeout(() => {
            textarea.setSelectionRange(
              Math.max(0, start - 2),
              Math.max(0, end - 2)
            );
            textarea.focus();
          }, 0);
        }
      } else {
        // Tab: agregar indentación
        const newValue =
          text.substring(0, start) + "  " + text.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2);
          textarea.focus();
        }, 0);
      }
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className="flex-1 font-mono text-sm bg-secondary/50 border-border/50 focus:border-accent transition-colors resize-none"
    />
  );
};

