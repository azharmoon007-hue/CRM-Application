export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  timestamp?: string;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}
