export interface Lega {
  id: number;
  nome: string;
  campionatoId?: string;
  giocatori?: Giocatore[];
}

export interface Sport {
  id?: number;
  nome: string;
  // Aggiungi altri campi se necessario
}

export interface Campionato {
  id?: number;
  nome: string;
  // Aggiungi altri campi se necessario
}

export interface Squadra {
  id?: number;
  nome: string;
  // Aggiungi altri campi se necessario
}

export interface Giocatore {
  id?: number;
  nome: string;
  stato?: string;
  giocate?: Giocata[]
}

export interface Giocata {
  id?: number;
  giornata?: number;
  squadraId?: string;
  esito?: string;
}
