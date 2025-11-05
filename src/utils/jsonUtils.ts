import { EndpointType, FormData } from "@/types/api";

export const generateBaseJson = (
  method: EndpointType,
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
    case "question":
      const body: Record<string, unknown> = {
        prompt: formData.questionPrompt || "",
      };
      if (formData.questionText) {
        body.text = formData.questionText;
      }
      return JSON.stringify(body, null, 2);
    case "custom":
      return formData.customJson || JSON.stringify(
        {
          parametro1: "respuesta1"
        },
        null,
        2
      );
    default:
      return "{}";
  }
};

export const parseJsonToFormData = (
  jsonString: string,
  method: EndpointType
): Partial<FormData> => {
  try {
    const parsed = JSON.parse(jsonString);
    switch (method) {
      case "test":
        return {
          testText: parsed.text || "",
          testQuestion: parsed.question || "",
        };
      case "question":
        return {
          questionPrompt: parsed.prompt || "",
          questionText: parsed.text || "",
        };
      case "custom":
        return {
          customJson: jsonString,
        };
      default:
        return {};
    }
  } catch {
    return {};
  }
};

export const buildRequestBody = (
  method: EndpointType,
  formData: FormData,
  jsonInput: string,
  inputFormat: "formulario" | "json"
): Record<string, unknown> => {
  if (inputFormat === "json" || method === "custom") {
    return JSON.parse(jsonInput);
  }

  switch (method) {
    case "test":
      return {
        text: formData.testText,
        question: formData.testQuestion,
      };
    case "question":
      const body: Record<string, unknown> = {
        prompt: formData.questionPrompt,
      };
      if (formData.questionText) {
        body.text = formData.questionText;
      }
      return body;
    default:
      return {};
  }
};

export const validateFormData = (
  method: EndpointType,
  formData: FormData,
  inputFormat: "formulario" | "json",
  jsonInput: string
): string | null => {
  if (inputFormat === "json" || method === "custom") {
    try {
      JSON.parse(jsonInput);
      return null;
    } catch {
      return "El JSON no es válido";
    }
  }

  switch (method) {
    case "test":
      if (!formData.testText || !formData.testQuestion) {
        return "Por favor completa todos los campos";
      }
      break;
    case "question":
      if (!formData.questionPrompt) {
        return "Por favor completa el campo prompt";
      }
      break;
  }

  return null;
};

