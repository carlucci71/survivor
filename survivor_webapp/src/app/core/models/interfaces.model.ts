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

export class RuoloGiocatore {
  static readonly LEADER = new RuoloGiocatore('LEADER', 'Leader');
  static readonly NESSUNO = new RuoloGiocatore('NESSUNO', 'Nessuno');
  static readonly GIOCATORE = new RuoloGiocatore('GIOCATORE', 'Giocatore');
  
  private constructor(
    public readonly value: string,
    public readonly descrizione: string
  ) {}

  static values(): RuoloGiocatore[] {
    return [
      RuoloGiocatore.LEADER,
      RuoloGiocatore.GIOCATORE,
      RuoloGiocatore.NESSUNO
    ];
  }
}

export function ruoloGiocatoreFromCodice(codice: string): RuoloGiocatore {
  switch (codice) {
    case RuoloGiocatore.LEADER.value:
      return RuoloGiocatore.LEADER;
    case RuoloGiocatore.NESSUNO.value:
      return RuoloGiocatore.NESSUNO;
    case RuoloGiocatore.GIOCATORE.value:
      return RuoloGiocatore.GIOCATORE;
    default:
      throw new Error(`Codice RuoloGiocatore sconosciuto: ${codice}`);
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
  name: string;
  edizione: number;
  edizioni: number[];
  withPwd: string;
  campionato?: Campionato;
  giocatori?: Giocatore[];
  giornataIniziale: number;
  giornataCalcolata: number;
  giornataCorrente: number;
  statoGiornataCorrente: StatoPartita;
  ruoloGiocatoreLega: RuoloGiocatore;
  stato: StatoLega;
  statiGiornate?: Record<number, StatoPartita>;
}


export interface Sport {
  campionati?: Campionato[];
  id: string;
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
    aliasGiornataCasa: string;
    aliasGiornataFuori: string;
}

export interface Campionato {
  id: string;
  nome: string;
  sport?: Sport;
  leghe?: Lega[];
  squadre?: Squadra[];
  numGiornate?: number;
  giornataDaGiocare?: number;
  iniziGiornate?: Date[];
}

export interface Squadra {
  id?: number;
  sigla: string;
  nome: string;
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
  squadraSigla: string;
  esito?: string;
}

export interface StatiPerLega {
  id?: number;
  statoGiocatore?: StatoGiocatore;
}


export class StatoLega {
  static readonly DA_AVVIARE = new StatoLega('DA_AVVIARE', 'Da Avviare');
  static readonly AVVIATA = new StatoLega('AVVIATA', 'Avviata');
  static readonly TERMINATA = new StatoLega('TERMINATA', 'Terminata');
  
  private constructor(
    public readonly value: string,
    public readonly descrizione: string
  ) {}

  static values(): StatoLega[] {
    return [
      StatoLega.DA_AVVIARE,
      StatoLega.AVVIATA,
      StatoLega.TERMINATA
    ];
  }
}

export function statoLegaFromCodice(codice: string): StatoLega {
  switch (codice) {
    case StatoLega.DA_AVVIARE.value:
      return StatoLega.DA_AVVIARE;
    case StatoLega.AVVIATA.value:
      return StatoLega.AVVIATA;
    case StatoLega.TERMINATA.value:
      return StatoLega.TERMINATA;
    default:
      throw new Error(`Codice StatoLega sconosciuto: ${codice}`);
  }
}
