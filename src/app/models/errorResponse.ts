export interface Error {
  message?: string;
  required?: string[];
}

export interface ErrorResponse {
  error: Error;
}
