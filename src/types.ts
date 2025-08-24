export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  error?: never;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: number;
    details?: any;
  };
  data?: never;
}

export interface ResponseConfig {
  defaultSuccessMessage?: string;
  defaultErrorMessage?: string;
  includeErrorDetails?: boolean;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;