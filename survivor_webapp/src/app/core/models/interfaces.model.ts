import { User } from "./auth.model";

export interface Lega {
  id: number;
  nome: string;
  campionato?: Campionato;
  giocatori?: Giocatore[];
  giornataIniziale: number;
  giornataCalcolata: number;
}

export interface Sport {
  campionati?: Campionato[];
  id?: number;
  nome: string;
  // Aggiungi altri campi se necessario
}

export interface Campionato {
  id?: string;
  nome: string;
  sport?: Sport;
  leghe?: Lega[];
  squadre?: Squadra[];
}

export interface Squadra {
  id?: number;
  nome: string;
  campionato?: Campionato;
}

export interface Giocatore {
  id?: number;
  nome: string;
  stato?: string;
  user?: User;
  giocate?: Giocata[]
}

export interface Giocata {
  id?: number;
  giornata?: number;
  squadraId?: string;
  esito?: string;
}
