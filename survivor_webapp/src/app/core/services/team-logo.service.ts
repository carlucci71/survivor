import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TeamLogoService {

  private readonly calcioLogoFiles: { [key: string]: string } = {
    'LIGA_BAR': 'BARC.png', 'LIGA_RMA': 'RMA.png', 'LIGA_ATM': 'ATM.png',
    'LIGA_ATH': 'ATH.png', 'LIGA_ALA': 'ALA.png', 'LIGA_BET': 'BET.png',
    'LIGA_RSO': 'RSO.png', 'LIGA_OVI': 'OVI.png', 'LIGA_RAY': 'RAY.png',
    'LIGA_VIL': 'VIL.png', 'LIGA_ESP': 'ESP.png', 'LIGA_VIG': 'CEL.png',
    'LIGA_OSA': 'OSA.png', 'LIGA_SEV': 'SIV.png', 'LIGA_GIR': 'GIR.png',
    'LIGA_MLL': 'MAI.png', 'LIGA_LEV': 'LEV.png', 'LIGA_ELC': 'ELC.png',
    'LIGA_GET': 'GET.png', 'LIGA_VAL': 'VAL.png',
    'SERIE_A_ATA': 'ATA.png', 'SERIE_A_BOL': 'BOLO.png', 'SERIE_A_CAG': 'CAGL.png',
    'SERIE_A_COM': 'COMO.png', 'SERIE_A_CRE': 'CREMON.png', 'SERIE_A_EMP': 'EMP.png',
    'SERIE_A_FIO': 'FIO.png', 'SERIE_A_GEN': 'GENOA.png', 'SERIE_A_INT': 'INT.png',
    'SERIE_A_JUV': 'JUV.png', 'SERIE_A_LAZ': 'LAZIO.png', 'SERIE_A_LEC': 'LECCE.webp',
    'SERIE_A_MIL': 'MIL.png', 'SERIE_A_MON': 'MON.png', 'SERIE_A_NAP': 'NAP.png',
    'SERIE_A_PAR': 'PARMA.png', 'SERIE_A_PIS': 'PISA.png', 'SERIE_A_ROM': 'ROMA.webp',
    'SERIE_A_SAS': 'SASS.png', 'SERIE_A_TOR': 'TORO.png', 'SERIE_A_UDI': 'UDI.png',
    'SERIE_A_VEN': 'VEN.png', 'SERIE_A_VER': 'VER.png',
    'SERIE_B_AVE': 'AVE.png', 'SERIE_B_BAR': 'BARI.png', 'SERIE_B_CAR': 'CARRARESE.png',
    'SERIE_B_CTZ': 'CATANZARO.png', 'SERIE_B_CES': 'CES.png', 'SERIE_B_ENT': 'ENT.png',
    'SERIE_B_JST': 'JUVE_STABIA.png', 'SERIE_B_MAN': 'MANT.png', 'SERIE_B_MOD': 'MOD.png',
    'SERIE_B_PAD': 'PADOVA.png', 'SERIE_B_PAL': 'PAL.png', 'SERIE_B_PES': 'PESC.png',
    'SERIE_B_REG': 'REGGIANA.png', 'SERIE_B_SAM': 'SAMP.png', 'SERIE_B_SPE': 'SPEZIA.webp',
    'SERIE_B_STR': 'SUDTIROL.png', 'SERIE_B_FRO': 'FRO.png', 'SERIE_B_EMP': 'EMP.png',
    'SERIE_B_MON': 'MON.png', 'SERIE_B_VEN': 'VEN.png',
  };

  private readonly tennisPhotos: { [key: string]: string } = {
    'ALCARAZ': 'ALCARAZ.png', 'BUBLIK': 'BUBLIK.png', 'CERUNDOLO': 'CERUNDOLO.png',
    'DARDERI': 'DARDERI.png', 'DE_MINAUR': 'DE_MIINAUR.png',
    'DE MINAUR': 'DE_MIINAUR.png', 'DEMINAUR': 'DE_MIINAUR.png',
    'DJOKOVIC': 'DJOKOVIC.png', 'FRITZ': 'FRITZ.png', 'MEDVEDEV': 'MEDVEDEV.png',
    'MENSIK': 'MENSIK.png', 'MUSETTI': 'MUSETTI.webp', 'PAUL': 'PAUL.png',
    'RUUD': 'RUUD.png', 'SHELTON': 'SHELTON.png', 'SINNER': 'SINNER.png',
    'TIEN': 'TIEN.png', 'ZVEREV': 'ZVEREV.webp',
  };

  private readonly basketLogos: { [key: string]: string } = {
    'PHI': '76ERS.png', 'ATL': 'HAWKS.png', 'BOS': 'CELTICS.png',
    'BKN': 'NETS.png', 'CHA': 'HORNETS.png', 'CHI': 'BULLS.png',
    'CLE': 'CAVALIERS.png', 'IND': 'PACERS.png', 'MIA': 'HEAT.png',
    'MIL': 'BUCKS.png', 'NYK': 'KNICKS.png', 'ORL': 'ORLANDO_MAGIC.png',
    'TOR': 'RAPTORS.png', 'WAS': 'WIZARDS.png', 'DET': 'PISTONS.png',
    'DEN': 'NUGGETS.png', 'SAS': 'SPURS.png', 'LAL': 'LAKERS.png',
    'HOU': 'ROCKETS.png', 'MIN': 'TIMBERWOLVES.png', 'PHX': 'SUNS.png',
    'MEM': 'GRIZZLIES.png', 'GSW': 'WARRIORS.png', 'POR': 'BLAZERS.png',
    'DAL': 'MAVERICKS.png', 'UTA': 'UTAH.webp', 'LAC': 'CLIPPERS.png',
    'SAC': 'SACRAMENTO.png', 'NOP': 'PELICANS.png', 'OKC': 'THUNDER.png',
  };

  getLogoUrl(sportId: string | undefined, campionatoId: string | undefined, sigla: string): string | null {
    if (!sigla) return null;

    if (sportId === 'TENNIS') {
      const original = sigla.toUpperCase().trim();
      const withUnderscore = original.replace(/\s+/g, '_');
      const withoutSpaces = original.replace(/\s+/g, '');
      let photoFile = this.tennisPhotos[original] || this.tennisPhotos[withUnderscore] || this.tennisPhotos[withoutSpaces];
      if (!photoFile) {
        const cognome = original.split(/[\s_]+/).pop() || original;
        const matchingKey = Object.keys(this.tennisPhotos).find(k => k.includes(cognome) || cognome.includes(k));
        if (matchingKey) photoFile = this.tennisPhotos[matchingKey];
      }
      return photoFile ? `assets/logos/tennis/${photoFile}` : 'assets/logos/tennis/placeholder.svg';
    }

    if (sportId === 'CALCIO') {
      const fileName = this.calcioLogoFiles[`${campionatoId}_${sigla}`];
      return fileName ? `assets/logos/calcio/${fileName}` : null;
    }

    if (sportId === 'BASKET') {
      const logoFile = this.basketLogos[sigla];
      return logoFile ? `assets/logos/basket/${logoFile}` : null;
    }

    return null;
  }
}
