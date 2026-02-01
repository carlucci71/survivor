export interface MagicLinkRequest {
  email: string;
  mobile: boolean;
}

export interface MagicLinkResponse {
  message: string;
  success: boolean;
}

export interface AuthResponse {
  id: number;
  token: string;
  refreshToken?: string;
  email: string;
  name: string;
  role: string;
  addInfo: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}
