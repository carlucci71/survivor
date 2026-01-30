export interface Trofeo {
  idLega: number;
  nomeLega: string;
  edizione: number;
  anno: number;
  posizioneFinale: number;
  nomeCampionato: string;
  nomeSport: string;
  idSport: string;
  giornateGiocate: number;
  ultimaSquadraScelta?: string;
}

export interface StatisticheTrofei {
  trofei: Trofeo[];
  torneiGiocati: number;
  vittorie: number;
  podi: number;
  winRate: number;
}
