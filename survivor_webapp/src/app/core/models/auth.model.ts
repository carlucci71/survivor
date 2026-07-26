export interface MagicLinkRequest {
  email: string;
  mobile: boolean;
  /** Percorso a cui tornare dopo la verifica del magic link (es. "join/93"), opzionale. */
  addInfo?: string;
}

export interface LoginRequest {
  email: string;
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
