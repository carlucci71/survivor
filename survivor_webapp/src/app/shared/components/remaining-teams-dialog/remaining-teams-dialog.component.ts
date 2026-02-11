import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface RemainingTeamsData {
  squadre: any[];
  sportId: string;
  campionatoId: string;
  campionatoNome: string;
  giocatoreNome: string;
}

@Component({
  selector: 'app-remaining-teams-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './remaining-teams-dialog.component.html',
  styleUrls: ['./remaining-teams-dialog.component.scss']
})
export class RemainingTeamsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RemainingTeamsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemainingTeamsData
  ) {
    // Debug: verifica dati ricevuti
    if (!data.campionatoId) {
      console.warn('⚠️ ATTENZIONE: campionatoId è undefined!', data);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  // Conta squadre disponibili
  getAvailableCount(): number {
    return this.data.squadre.filter(s => s.disponibile !== false).length;
  }

  // Conta squadre già giocate
  getPlayedCount(): number {
    return this.data.squadre.filter(s => s.disponibile === false).length;
  }

  getTeamLogo(sigla: string): string {
    if (!sigla) return '';

    const sportId = this.data.sportId?.toLowerCase();
    const campionatoId = this.data.campionatoId;

    // CALCIO - usa mapping con chiave CAMPIONATO_SIGLA per evitare duplicati
    if (sportId === 'calcio' && campionatoId) {
      const teamLogos: { [key: string]: string } = {
        // SERIE A - formato: SERIE_A_SIGLA
        'SERIE_A_ATA': 'ATA.png',
        'SERIE_A_BOL': 'BOLO.png',
        'SERIE_A_CAG': 'CAGL.png',
        'SERIE_A_COM': 'COMO.png',
        'SERIE_A_CRE': 'CREMON.png',
        'SERIE_A_EMP': 'EMP.png',
        'SERIE_A_FIO': 'FIO.png',
        'SERIE_A_GEN': 'GENOA.png',
        'SERIE_A_INT': 'INT.png',
        'SERIE_A_JUV': 'JUV.png',
        'SERIE_A_LAZ': 'LAZIO.png',
        'SERIE_A_LEC': 'LECCE.webp',
        'SERIE_A_MIL': 'MIL.png',
        'SERIE_A_MONZ': 'MON.png',
        'SERIE_A_MON': 'MON.png',
        'SERIE_A_NAP': 'NAP.png',
        'SERIE_A_PAR': 'PARMA.png',
        'SERIE_A_PIS': 'PISA.png',
        'SERIE_A_ROM': 'ROMA.webp',
        'SERIE_A_SAS': 'SASS.png',
        'SERIE_A_TOR': 'TORO.png',
        'SERIE_A_UDI': 'UDI.png',
        'SERIE_A_VEN': 'VEN.png',
        'SERIE_A_VER': 'VER.png',

        // SERIE B - formato: SERIE_B_SIGLA
        'SERIE_B_AVE': 'AVE.png',
        'SERIE_B_BAR': 'BARI.png',
        'SERIE_B_CAR': 'CARRARESE.png',
        'SERIE_B_CTZ': 'CATANZARO.png',
        'SERIE_B_CES': 'CES.png',
        'SERIE_B_CRE': 'CREMON.png',
        'SERIE_B_ENT': 'ENT.png',
        'SERIE_B_FRO': 'FRO.png',
        'SERIE_B_JST': 'JUVE_STABIA.png',
        'SERIE_B_MAN': 'MANT.png',
        'SERIE_B_MOD': 'MOD.png',
        'SERIE_B_PAD': 'PADOVA.png',
        'SERIE_B_PAL': 'PAL.png',
        'SERIE_B_PES': 'PESC.png',
        'SERIE_B_REG': 'REGGIANA.png',
        'SERIE_B_SAM': 'SAMP.png',
        'SERIE_B_SAS': 'SASS.png',
        'SERIE_B_SPE': 'SPEZIA.webp',
        'SERIE_B_STR': 'SUDTIROL.png',

        // LIGA - formato: LIGA_SIGLA
        'LIGA_ALA': 'ALA.png',
        'LIGA_ATH': 'ATH.png',
        'LIGA_ATM': 'ATM.png',
        'LIGA_BAR': 'BARC.png',
        'LIGA_BET': 'BET.png',
        'LIGA_VIG': 'CEL.png',
        'LIGA_ELC': 'ELC.png',
        'LIGA_ESP': 'ESP.png',
        'LIGA_GET': 'GET.png',
        'LIGA_GIR': 'GIR.png',
        'LIGA_LEV': 'LEV.png',
        'LIGA_MLL': 'MAI.png',
        'LIGA_OSA': 'OSA.png',
        'LIGA_OVI': 'OVI.png',
        'LIGA_RAY': 'RAY.png',
        'LIGA_RMA': 'RMA.png',
        'LIGA_RSO': 'RSO.png',
        'LIGA_SEV': 'SIV.png',
        'LIGA_VAL': 'VAL.png',
        'LIGA_VIL': 'VIL.png'
      };

      const key = `${campionatoId}_${sigla}`;
      let fileName = teamLogos[key];

      // Se non trovato, prova a cercare la chiave che termina con la sigla (fallback)
      if (!fileName) {
        const matchingKeys = Object.keys(teamLogos).filter(k => k.endsWith(`_${sigla}`));
        if (matchingKeys.length > 0) {
          fileName = teamLogos[matchingKeys[0]];
          console.log(`📌 Fallback calcio: ${sigla} → ${matchingKeys[0]} → ${fileName}`);
        }
      }

      if (fileName) {
        return `assets/logos/calcio/${fileName}`;
      }

      // Fallback finale
      console.warn(`⚠️ Logo calcio non trovato per: ${key}`);
      return `assets/logos/calcio/${sigla}.png`;
    }
    // BASKET - NBA mapping
    else if (sportId === 'basket' && campionatoId) {
      const basketLogos: { [key: string]: string } = {
        // NBA - formato: NBA_SIGLA
        'NBA_PHI': '76ERS.png',
        'NBA_ATL': 'HAWKS.png',
        'NBA_BOS': 'CELTICS.png',
        'NBA_BKN': 'NETS.png',
        'NBA_CHA': 'HORNETS.png',
        'NBA_CHI': 'BULLS.png',
        'NBA_CLE': 'CAVALIERS.png',
        'NBA_IND': 'PACERS.png',
        'NBA_MIA': 'HEAT.png',
        'NBA_MIL': 'BUCKS.png',
        'NBA_NYK': 'KNICKS.png',
        'NBA_ORL': 'ORLANDO_MAGIC.png',
        'NBA_TOR': 'RAPTORS.png',
        'NBA_WAS': 'WIZARDS.png',
        'NBA_DET': 'PISTONS.png',
        'NBA_DEN': 'NUGGETS.png',
        'NBA_LAL': 'LAKERS.png',
        'NBA_HOU': 'ROCKETS.png',
        'NBA_MIN': 'TIMBERWOLVES.png',
        'NBA_PHX': 'SUNS.png',
        'NBA_MEM': 'GRIZZLIES.png',
        'NBA_GSW': 'WARRIORS.png',
        'NBA_POR': 'BLAZERS.png',
        'NBA_DAL': 'MAVERICKS.png',
        'NBA_UTA': 'UTAH.webp',
        'NBA_LAC': 'CLIPPERS.png',
        'NBA_SAC': 'SACRAMENTO.png',
        'NBA_NOP': 'PELICANS.png',
        'NBA_OKC': 'THUNDER.png',
        'NBA_SAS': 'SPURS.png'
      };

      const key = `${campionatoId}_${sigla}`;
      let fileName = basketLogos[key];

      // Se non trovato, prova a cercare la chiave che termina con la sigla (fallback)
      if (!fileName) {
        const matchingKeys = Object.keys(basketLogos).filter(k => k.endsWith(`_${sigla}`));
        if (matchingKeys.length > 0) {
          fileName = basketLogos[matchingKeys[0]];
          console.log(`📌 Fallback basket: ${sigla} → ${matchingKeys[0]} → ${fileName}`);
        }
      }

      if (fileName) {
        return `assets/logos/basket/${fileName}`;
      }

      // Fallback finale
      console.warn(`⚠️ Logo basket non trovato per: ${key}`);
      return `assets/logos/basket/${sigla}.png`;
    }
    // TENNIS - Australian Open e altri tornei
    else if (sportId === 'tennis' && campionatoId) {
      const tennisPhotos: { [key: string]: string } = {
        // Australian Open - formato: AO_COGNOME
        'AO_ALCARAZ': 'ALCARAZ.png',
        'AO_BUBLIK': 'BUBLIK.png',
        'AO_CERUNDOLO': 'CERUNDOLO.png',
        'AO_DARDERI': 'DARDERI.png',
        'AO_DE_MINAUR': 'DE_MIINAUR.png',
        'AO_DEMINAUR': 'DE_MIINAUR.png',
        'AO_DE MINAUR': 'DE_MIINAUR.png',
        'AO_DJOKOVIC': 'DJOKOVIC.png',
        'AO_FRITZ': 'FRITZ.png',
        'AO_MEDVEDEV': 'MEDVEDEV.png',
        'AO_MENSIK': 'MENSIK.png',
        'AO_MUSETTI': 'MUSETTI.webp',
        'AO_PAUL': 'PAUL.png',
        'AO_RUUD': 'RUUD.png',
        'AO_SHELTON': 'SHELTON.png',
        'AO_SINNER': 'SINNER.png',
        'AO_TIEN': 'TIEN.png',
        'AO_ZVEREV': 'ZVEREV.webp'
      };

      // Prova prima con il nome esatto
      let key = `${campionatoId}_${sigla}`;
      let fileName = tennisPhotos[key];

      // Se non trovato, prova varianti con spazi/underscore
      if (!fileName) {
        const siglaUpper = sigla.toUpperCase();
        const variants = [
          siglaUpper,
          siglaUpper.replace(/\s+/g, '_'),
          siglaUpper.replace(/_/g, ' '),
          siglaUpper.replace(/\s+/g, '')
        ];

        for (const variant of variants) {
          const testKey = `${campionatoId}_${variant}`;
          if (tennisPhotos[testKey]) {
            fileName = tennisPhotos[testKey];
            console.log(`📌 Fallback tennis variante: ${sigla} → ${testKey} → ${fileName}`);
            break;
          }
        }
      }

      // Se ancora non trovato, cerca per cognome (ultima parola)
      if (!fileName) {
        const matchingKeys = Object.keys(tennisPhotos).filter(k => {
          const keyParts = k.split('_');
          const siglaParts = sigla.toUpperCase().split(/[\s_]+/);
          const lastWord = siglaParts[siglaParts.length - 1];
          return keyParts[keyParts.length - 1] === lastWord;
        });

        if (matchingKeys.length > 0) {
          fileName = tennisPhotos[matchingKeys[0]];
          console.log(`📌 Fallback tennis cognome: ${sigla} → ${matchingKeys[0]} → ${fileName}`);
        }
      }

      if (fileName) {
        return `assets/logos/tennis/${fileName}`;
      }

      // Fallback: placeholder
      console.warn(`⚠️ Foto tennista non trovata per: ${key}`);
      return 'assets/logos/tennis/placeholder.svg';
    }

    return '';
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }
}
