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
  /** Valorizzato solo per l'account riservato alla review Apple/Google: permette il login senza email reale. */
  reviewToken?: string;
  reviewCodiceTipoMagicLink?: string;
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

/** Risposta di POST /auth/verify-code: come AuthResponse, piu' il token del magic link per il join libero. */
export interface VerificaCodiceResponse extends AuthResponse {
  magicToken?: string;
}

/** Errore di POST /auth/verify-code (HTTP 400). */
export interface VerificaCodiceErrore {
  success: false;
  errore: 'CODICE_ERRATO' | 'CODICE_SCADUTO' | 'TROPPI_TENTATIVI';
  tentativiRimasti: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}
