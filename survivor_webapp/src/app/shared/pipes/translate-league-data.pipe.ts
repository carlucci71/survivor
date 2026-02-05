import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translateLeagueData',
  standalone: true,
  pure: false // Per reagire ai cambi di lingua
})
export class TranslateLeagueDataPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string, type: 'status' | 'sport' | 'championship' | 'role'): string {
    if (!value) return value;

    let translationKey = '';

    switch (type) {
      case 'status':
        translationKey = `LEAGUE_STATUS.${value}`;
        break;
      case 'sport':
        translationKey = `SPORTS.${value}`;
        break;
      case 'championship':
        translationKey = `CHAMPIONSHIPS.${value}`;
        break;
      case 'role':
        translationKey = `PLAYER_ROLES.${value}`;
        break;
    }

    const translated = this.translate.instant(translationKey);
    // Se la traduzione non esiste, ritorna il valore originale
    return translated !== translationKey ? translated : value;
  }
}
