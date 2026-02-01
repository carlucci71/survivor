import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>('it');
  public currentLang$: Observable<string> = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage(): void {
    // Lingue disponibili
    this.translate.addLangs(['it', 'en']);

    // Lingua di default
    this.translate.setDefaultLang('it');

    // Recupera la lingua salvata o usa quella del browser
    const savedLang = localStorage.getItem('survivor_language');
    const browserLang = this.translate.getBrowserLang();
    const langToUse = savedLang || (browserLang?.match(/it|en/) ? browserLang : 'it');

    this.changeLanguage(langToUse);
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    localStorage.setItem('survivor_language', lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'it';
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
