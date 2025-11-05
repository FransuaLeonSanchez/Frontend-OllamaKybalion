import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EndpointType, FormData, InputFormat } from "@/types/api";
import { JsonEditor } from "./JsonEditor";

interface ParameterFieldsProps {
  method: EndpointType;
  formData: FormData;
  inputFormat: InputFormat;
  jsonInput: string;
  onFormDataChange: (data: Partial<FormData>) => void;
  onJsonChange: (value: string) => void;
}

export const ParameterFields = ({
  method,
  formData,
  inputFormat,
  jsonInput,
  onFormDataChange,
  onJsonChange,
}: ParameterFieldsProps) => {
  // Si está en modo JSON o es método custom, usar editor JSON
  if (inputFormat === "json" || method === "custom") {
    return (
      <div className="flex flex-col space-y-2 h-full min-h-0">
        <Label htmlFor="json-input" className="text-sm font-medium">
          JSON
        </Label>
        <JsonEditor
          id="json-input"
          placeholder='{"text": "", "question": ""}'
          value={jsonInput}
          onChange={onJsonChange}
        />
      </div>
    );
  }

  switch (method) {
    case "test":
      return (
        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col space-y-2 flex-1 min-h-0">
            <Label htmlFor="text" className="text-sm font-medium">
              Text
            </Label>
            <Textarea
              id="text"
              placeholder="Ej: El Sol es una estrella de tipo G..."
              value={formData.testText}
              onChange={(e) =>
                onFormDataChange({ testText: e.target.value })
              }
              className="flex-1 bg-secondary/50 border-border/50 focus:border-accent transition-colors resize-none"
            />
          </div>
          <div className="flex flex-col space-y-2 flex-1 min-h-0">
            <Label htmlFor="question" className="text-sm font-medium">
              Question
            </Label>
            <Textarea
              id="question"
              placeholder="Ej: ¿Qué tipo de estrella es el Sol?"
              value={formData.testQuestion}
              onChange={(e) =>
                onFormDataChange({ testQuestion: e.target.value })
              }
              className="flex-1 bg-secondary/50 border-border/50 focus:border-accent transition-colors resize-none"
            />
          </div>
        </div>
      );

    case "question":
      return (
        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col space-y-2 flex-1 min-h-0">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Ej: Explica brevemente qué es el aprendizaje por refuerzo"
              value={formData.questionPrompt}
              onChange={(e) =>
                onFormDataChange({ questionPrompt: e.target.value })
              }
              className="flex-1 bg-secondary/50 border-border/50 focus:border-accent transition-colors resize-none"
            />
          </div>
          <div className="flex flex-col space-y-2 flex-1 min-h-0">
            <Label htmlFor="question-text" className="text-sm font-medium">
              Text <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Textarea
              id="question-text"
              placeholder="Ej: Texto adicional opcional..."
              value={formData.questionText}
              onChange={(e) =>
                onFormDataChange({ questionText: e.target.value })
              }
              className="flex-1 bg-secondary/50 border-border/50 focus:border-accent transition-colors resize-none"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

