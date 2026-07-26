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
    'LIGA_CEL': 'CELTA_VIGO.png', 'LIGA_DEP': 'DEPORTIVO_LA_CORUNA.webp',
    'LIGA_MAL': 'MALAGA.png', 'LIGA_RAC': 'RACING_SANTANDER.png',
    'SERIE_A_ATA': 'ATA.png', 'SERIE_A_BOL': 'BOLO.png', 'SERIE_A_CAG': 'CAGL.png',
    'SERIE_A_COM': 'COMO.png', 'SERIE_A_CRE': 'CREMON.png', 'SERIE_A_EMP': 'EMP.png',
    'SERIE_A_FIO': 'FIO.png', 'SERIE_A_GEN': 'GENOA.png', 'SERIE_A_INT': 'INT.png',
    'SERIE_A_JUV': 'JUV.png', 'SERIE_A_LAZ': 'LAZIO.png', 'SERIE_A_LEC': 'LECCE.webp',
    'SERIE_A_MIL': 'MIL.png', 'SERIE_A_MON': 'MON.png', 'SERIE_A_NAP': 'NAP.png',
    'SERIE_A_PAR': 'PARMA.png', 'SERIE_A_PIS': 'PISA.png', 'SERIE_A_ROM': 'ROMA.webp',
    'SERIE_A_SAS': 'SASS.png', 'SERIE_A_TOR': 'TORO.png', 'SERIE_A_UDI': 'UDI.png',
    'SERIE_A_VEN': 'VEN.png', 'SERIE_A_VER': 'VER.png', 'SERIE_A_FRO': 'FRO.png',
    // PREMIER LEAGUE
    'PREMIER_LEAGUE_ARS': 'inghilterra/arsenal.png',
    'PREMIER_LEAGUE_AST': 'inghilterra/aston_villa.png',
    'PREMIER_LEAGUE_AFC': 'inghilterra/bournemouth.webp',
    'PREMIER_LEAGUE_BRE': 'inghilterra/brentford.png',
    'PREMIER_LEAGUE_BHA': 'inghilterra/brighton.png',
    'PREMIER_LEAGUE_CHL': 'inghilterra/chelsea.webp',
    'PREMIER_LEAGUE_COV': 'inghilterra/coventry.webp',
    'PREMIER_LEAGUE_CPL': 'inghilterra/crystal_palace.png',
    'PREMIER_LEAGUE_EVT': 'inghilterra/everton.png',
    'PREMIER_LEAGUE_FUL': 'inghilterra/fulham.png',
    'PREMIER_LEAGUE_HUL': 'inghilterra/hull.webp',
    'PREMIER_LEAGUE_IPS': 'inghilterra/ipswich.png',
    'PREMIER_LEAGUE_LDS': 'inghilterra/leeds.png',
    'PREMIER_LEAGUE_LIV': 'inghilterra/liverpool.png',
    'PREMIER_LEAGUE_MNC': 'inghilterra/manchester_city.png',
    'PREMIER_LEAGUE_MNU': 'inghilterra/manchester_united.png',
    'PREMIER_LEAGUE_NEW': 'inghilterra/newcastle.webp',
    'PREMIER_LEAGUE_NOF': 'inghilterra/forest.png',
    'PREMIER_LEAGUE_SUN': 'inghilterra/sunderland.png',
    'PREMIER_LEAGUE_TOT': 'inghilterra/tottenham.png',
    'SERIE_B_AVE': 'AVE.png', 'SERIE_B_BAR': 'BARI.png', 'SERIE_B_CAR': 'CARRARESE.png',
    'SERIE_B_CTZ': 'CATANZARO.png', 'SERIE_B_CES': 'CES.png', 'SERIE_B_ENT': 'ENT.png',
    'SERIE_B_JST': 'JUVE_STABIA.png', 'SERIE_B_MAN': 'MANT.png', 'SERIE_B_MOD': 'MOD.png',
    'SERIE_B_PAD': 'PADOVA.png', 'SERIE_B_PAL': 'PAL.png', 'SERIE_B_PES': 'PESC.png',
    'SERIE_B_REG': 'REGGIANA.png', 'SERIE_B_SAM': 'SAMP.png', 'SERIE_B_SPE': 'SPEZIA.webp',
    'SERIE_B_STR': 'SUDTIROL.png', 'SERIE_B_FRO': 'FRO.png', 'SERIE_B_EMP': 'EMP.png',
    'SERIE_B_MON': 'MON.png', 'SERIE_B_VEN': 'VEN.png', 'SERIE_B_BEN': 'benevento.png',
    // MONDIALI 2026
    'MONDIALI_2026_ALG': 'mondiali/algeria.png',
    'MONDIALI_2026_SAU': 'mondiali/arabia-saudita.png',
    'MONDIALI_2026_ARG': 'mondiali/argentina.png',
    'MONDIALI_2026_AUS': 'mondiali/australia.png',
    'MONDIALI_2026_AUT': 'mondiali/austria.png',
    'MONDIALI_2026_BEL': 'mondiali/belgio.png',
    'MONDIALI_2026_BRA': 'mondiali/brasile.png',
    'MONDIALI_2026_CAN': 'mondiali/canada.png',
    'MONDIALI_2026_CPV': 'mondiali/capoverde.png',
    'MONDIALI_2026_COL': 'mondiali/colombia.png',
    'MONDIALI_2026_COR': 'mondiali/corea.png',
    'MONDIALI_2026_CIV': 'mondiali/costa-avorio.png',
    'MONDIALI_2026_CRO': 'mondiali/croazia.png',
    'MONDIALI_2026_CUR': 'mondiali/curacao.png',
    'MONDIALI_2026_ECU': 'mondiali/ecuador.png',
    'MONDIALI_2026_EGI': 'mondiali/egitto.png',
    'MONDIALI_2026_FRA': 'mondiali/francia.png',
    'MONDIALI_2026_GER': 'mondiali/germania.png',
    'MONDIALI_2026_GHA': 'mondiali/ghana.png',
    'MONDIALI_2026_JAP': 'mondiali/giappone.png',
    'MONDIALI_2026_GIO': 'mondiali/giordania.png',
    'MONDIALI_2026_HAI': 'mondiali/haiti.png',
    'MONDIALI_2026_ING': 'mondiali/inghilterra.png',
    'MONDIALI_2026_IRA': 'mondiali/iran.png',
    'MONDIALI_2026_MAR': 'mondiali/marocco.png',
    'MONDIALI_2026_MES': 'mondiali/messico.png',
    'MONDIALI_2026_NOR': 'mondiali/norvegia.png',
    'MONDIALI_2026_NZE': 'mondiali/nuova-zelanda.png',
    'MONDIALI_2026_OLA': 'mondiali/olanda.png',
    'MONDIALI_2026_PAN': 'mondiali/panama.png',
    'MONDIALI_2026_PAR': 'mondiali/paraguay.png',
    'MONDIALI_2026_POR': 'mondiali/portogallo.png',
    'MONDIALI_2026_QAT': 'mondiali/qatar.png',
    'MONDIALI_2026_SCO': 'mondiali/scozia.png',
    'MONDIALI_2026_SEN': 'mondiali/senegal.png',
    'MONDIALI_2026_SPA': 'mondiali/spagna.png',
    'MONDIALI_2026_USA': 'mondiali/stati-uniti.png',
    'MONDIALI_2026_SAF': 'mondiali/sudafrica.png',
    'MONDIALI_2026_SVI': 'mondiali/svizzera.png',
    'MONDIALI_2026_TUN': 'mondiali/tunisia.png',
    'MONDIALI_2026_URU': 'mondiali/uruguay.png',
    'MONDIALI_2026_UZB': 'mondiali/uzbekistan.png',
    'MONDIALI_2026_BOS': 'mondiali/bosnia-erzegovina.png',
    'MONDIALI_2026_CEC': 'mondiali/repubblica-ceca.png',
    'MONDIALI_2026_TUR': 'mondiali/turchia.png',
    'MONDIALI_2026_SVE': 'mondiali/svezia.png',
    'MONDIALI_2026_IRQ': 'mondiali/iraq.png',
    'MONDIALI_2026_COD': 'mondiali/congo.png',
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
