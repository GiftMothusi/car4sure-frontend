export interface ApiResponse<T = any> {
    data?: T;
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
  }
  
  export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
  }