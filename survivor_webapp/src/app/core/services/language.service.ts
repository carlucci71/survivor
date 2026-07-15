import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LanguageOption {
  code: string;
  /** Nome della lingua nella lingua stessa (es. "Italiano", "English"), mostrato nel selettore lingua */
  nativeName: string;
}

/**
 * Unico punto in cui registrare le lingue supportate dall'app.
 * Per aggiungerne una: creare src/assets/i18n/<code>.json e aggiungere una riga qui.
 */
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'it', nativeName: 'Italiano' },
  { code: 'en', nativeName: 'English' },
  { code: 'es', nativeName: 'Español' },
];

const DEFAULT_LANG = 'it';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>(DEFAULT_LANG);
  public currentLang$: Observable<string> = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage(): void {
    const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);

    this.translate.addLangs(supportedCodes);
    this.translate.setDefaultLang(DEFAULT_LANG);

    // Recupera la lingua salvata o usa quella del browser
    const savedLang = localStorage.getItem('survivor_language');
    const browserLang = this.translate.getBrowserLang();
    const browserLangSupported = !!browserLang && supportedCodes.includes(browserLang);
    const langToUse = savedLang || (browserLangSupported ? browserLang! : DEFAULT_LANG);

    this.changeLanguage(langToUse);
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    localStorage.setItem('survivor_language', lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || DEFAULT_LANG;
  }

  /** Nome nativo della lingua correntemente attiva (es. "Italiano"), per il selettore lingua */
  getCurrentLanguageName(): string {
    const current = this.getCurrentLanguage();
    return SUPPORTED_LANGUAGES.find(l => l.code === current)?.nativeName || current;
  }

  /** Elenco delle lingue supportate (codice + nome nativo), per popolare il selettore lingua */
  getSupportedLanguages(): LanguageOption[] {
    return SUPPORTED_LANGUAGES;
  }

  getAvailableLanguages(): string[] {
    // Converte readonly string[] in string[] usando spread operator
    return [...this.translate.getLangs()];
  }

  instant(key: string, params?: any): string {
    // Rinominato da translate() a instant() per evitare conflitto di nomi
    return this.translate.instant(key, params);
  }
}
