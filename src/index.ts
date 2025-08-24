import { SuccessResponse, ErrorResponse, ResponseConfig, ApiResponse } from './types';

class ResponseWrapper {
  private config: ResponseConfig;

  constructor(config: ResponseConfig = {}) {
    this.config = {
      defaultSuccessMessage: 'Operation completed successfully',
      defaultErrorMessage: 'An error occurred',
      includeErrorDetails: false,
      ...config
    };
  }

  /**
   * Create a success response
   */
  success<T = any>(data: T, message?: string): SuccessResponse<T> {
    return {
      success: true,
      message: message || this.config.defaultSuccessMessage!,
      data
    };
  }

  /**
   * Create an error response
   */
  error(message?: string, code: number = 500, details?: any): ErrorResponse {
    const errorResponse: ErrorResponse = {
      success: false,
      message: message || this.config.defaultErrorMessage!,
      error: {
        code
      }
    };

    if (this.config.includeErrorDetails && details) {
      errorResponse.error.details = details;
    }

    return errorResponse;
  }

  /**
   * Express middleware for consistent responses
   */
  middleware() {
    return (req: any, res: any, next: any) => {
      res.apiSuccess = <T = any>(data: T, message?: string) => {
        res.json(this.success(data, message));
      };

      res.apiError = (message?: string, code: number = 500, details?: any) => {
        res.status(code).json(this.error(message, code, details));
      };

      next();
    };
  }

  /**
   * Fastify decorator for consistent responses
   */
  decorateFastify(fastify: any) {
    fastify.decorateReply('apiSuccess', function <T = any>(this: any, data: T, message?: string) {
      const response = this.responseWrapper.success(data, message);
      this.send(response);
    });

    fastify.decorateReply('apiError', function (this: any, message?: string, code: number = 500, details?: any) {
      const response = this.responseWrapper.error(message, code, details);
      this.code(code).send(response);
    });

    fastify.decorate('responseWrapper', this);
  }

  /**
   * Update configuration
   */
  configure(newConfig: Partial<ResponseConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): ResponseConfig {
    return { ...this.config };
  }
}

// Default instance
const defaultWrapper = new ResponseWrapper();

// Export individual functions for convenience
export const success = defaultWrapper.success.bind(defaultWrapper);
export const error = defaultWrapper.error.bind(defaultWrapper);
export const middleware = defaultWrapper.middleware.bind(defaultWrapper);
export const configure = defaultWrapper.configure.bind(defaultWrapper);
export const getConfig = defaultWrapper.getConfig.bind(defaultWrapper);

// Export the class for custom instances
export { ResponseWrapper };
export type { SuccessResponse, ErrorResponse, ApiResponse, ResponseConfig };