import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, PreloadAllModules, withPreloading, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
import itTranslations from '../assets/i18n/it.json';
import enTranslations from '../assets/i18n/en.json';
import esTranslations from '../assets/i18n/es.json';

import { routes } from './app.routes';

// Traduzioni bundlate a compile-time (una entry per lingua supportata, vedi SUPPORTED_LANGUAGES in language.service.ts)
const BUNDLED_TRANSLATIONS: Record<string, any> = {
  it: itTranslations,
  en: enTranslations,
  es: esTranslations,
};

// Custom loader per compatibilità con ngx-translate v18
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    // Restituisce le traduzioni importate per includerle nel bundle
    return of(BUNDLED_TRANSLATIONS[lang] ?? {});
  }
}



// Factory per il loader delle traduzioni
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new CustomTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'it',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
