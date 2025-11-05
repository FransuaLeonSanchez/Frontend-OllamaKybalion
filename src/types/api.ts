export type EndpointType = "test" | "question" | "custom";

export type InputFormat = "formulario" | "json";

export type OutputFormat = "json" | "formulario";

export interface ResponseData {
  [key: string]: unknown;
}

export interface EndpointConfig {
  ip: string;
  port: string;
  method: EndpointType;
}

export interface FormData {
  testText: string;
  testQuestion: string;
  questionPrompt: string;
  questionText: string; // Campo opcional para question
  customJson: string; // JSON libre para método custom
}

