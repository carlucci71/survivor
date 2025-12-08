export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkResponse {
  message: string;
  success: boolean;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}

export interface User {
  email: string;
  name: string;
  role: string;
}
