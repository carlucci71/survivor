import { User } from "./auth.model";


export class StatoGiocatore {
  static readonly ATTIVO = new StatoGiocatore('ATTIVO', 'Attivo');
  static readonly ELIMINATO = new StatoGiocatore('ELIMINATO', 'Eliminato');
  static readonly PENDING = new StatoGiocatore('PENDING', 'In attesa');

  private constructor(
    public readonly value: string,
    public readonly descrizione: string
  ) {}

  static values(): StatoGiocatore[] {
    return [
      StatoGiocatore.ATTIVO,
      StatoGiocatore.ELIMINATO,
      StatoGiocatore.PENDING
    ];
  }
}

export function statoGiocatoreFromCodice(codice: string): StatoPartita {
  switch (codice) {
    case StatoGiocatore.ATTIVO.value:
      return StatoGiocatore.ATTIVO;
    case StatoGiocatore.ELIMINATO.value:
      return StatoGiocatore.ELIMINATO;
    case StatoGiocatore.PENDING.value:
      return StatoGiocatore.PENDING;
    default:
      throw new Error(`Codice StatoGiocatore sconosciuto: ${codice}`);
  }
}


export class StatoPartita {
  static readonly DA_GIOCARE = new StatoPartita('DA_GIOCARE', 'Da giocare');
  static readonly SOSPESA = new StatoPartita('SOSPESA', 'Sospesa');
  static readonly TERMINATA = new StatoPartita('TERMINATA', 'Terminata');
  static readonly IN_CORSO = new StatoPartita('IN_CORSO', 'In corso');

  private constructor(
    public readonly value: string,
    public readonly descrizione: string
  ) {}

  static values(): StatoPartita[] {
    return [
      StatoPartita.DA_GIOCARE,
      StatoPartita.SOSPESA,
      StatoPartita.TERMINATA,
      StatoPartita.IN_CORSO
    ];
  }
}

export function statoPartitaFromCodice(codice: string): StatoPartita {
  switch (codice) {
    case StatoPartita.DA_GIOCARE.value:
      return StatoPartita.DA_GIOCARE;
    case StatoPartita.SOSPESA.value:
      return StatoPartita.SOSPESA;
    case StatoPartita.TERMINATA.value:
      return StatoPartita.TERMINATA;
    case StatoPartita.IN_CORSO.value:
      return StatoPartita.IN_CORSO;
    default:
      throw new Error(`Codice StatoPartita sconosciuto: ${codice}`);
  }
}

export interface Lega {
  id: number;
  nome: string;
  campionato?: Campionato;
  giocatori?: Giocatore[];
  giornataIniziale: number;
  giornataCalcolata: number;
  giornataCorrente: number;
  statoGiornataCorrente: StatoPartita;
  statiGiornate?: Record<number, StatoPartita>;
}


export interface Sport {
  campionati?: Campionato[];
  id?: string;
  nome: string;
}

export interface Partita {
    sportId: string;
    campionatoId: string;
    giornata: number;
    orario: Date;
    stato: StatoPartita;
    casaSigla: string;
    fuoriSigla: string;
    casaNome: string;
    fuoriNome: string;
    scoreCasa: number;
    scoreFuori: number; 
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
  sigla: string;
  nome: string;
  campionato?: Campionato;
}

export interface Giocatore {
  id: number;
  nome: string;
  statiPerLega?: Record<number, StatoGiocatore>;
  user?: User;
  giocate?: Giocata[]
}

export interface Giocata {
  id?: number;
  giornata?: number;
  squadraId?: number;
  squadraSigla?: string;
  esito?: string;
}

export interface StatiPerLega {
  id?: number;
  statoGiocatore?: StatoGiocatore;
}
