import { FormData, InputFormat, PresetEndpoint } from "@/types/api";

// Helpers para los endpoints simples test/question (formulario <-> JSON).

export const generateBaseJson = (
  method: PresetEndpoint,
  formData: FormData
): string => {
  switch (method) {
    case "test":
      return JSON.stringify(
        {
          text: formData.testText || "",
          question: formData.testQuestion || "",
        },
        null,
        2
      );
    case "question": {
      const body: Record<string, unknown> = {
        prompt: formData.questionPrompt || "",
      };
      if (formData.questionText) {
        body.text = formData.questionText;
      }
      return JSON.stringify(body, null, 2);
    }
    default:
      return "{}";
  }
};

/** Body para test/question según el formato activo. */
export const buildSimpleBody = (
  method: "test" | "question",
  formData: FormData,
  jsonInput: string,
  inputFormat: InputFormat
): Record<string, unknown> => {
  if (inputFormat === "json") {
    return JSON.parse(jsonInput);
  }
  if (method === "test") {
    return {
      text: formData.testText,
      question: formData.testQuestion,
    };
  }
  const body: Record<string, unknown> = { prompt: formData.questionPrompt };
  if (formData.questionText) {
    body.text = formData.questionText;
  }
  return body;
};

/** Validación de los endpoints simples. Devuelve mensaje de error o null. */
export const validateSimpleForm = (
  method: "test" | "question",
  formData: FormData,
  inputFormat: InputFormat,
  jsonInput: string
): string | null => {
  if (inputFormat === "json") {
    try {
      JSON.parse(jsonInput);
      return null;
    } catch {
      return "El JSON no es válido";
    }
  }

  if (method === "test") {
    if (!formData.testText || !formData.testQuestion) {
      return "Por favor completa todos los campos";
    }
  } else if (method === "question") {
    if (!formData.questionPrompt) {
      return "Por favor completa el campo prompt";
    }
  }

  return null;
};
