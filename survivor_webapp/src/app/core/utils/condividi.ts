import { Capacitor } from '@capacitor/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

export interface DatiCondivisione {
  title: string;
  text: string;
  dialogTitle?: string;
}

export type EsitoCondivisione = 'condiviso' | 'annullato' | 'copiato' | 'fallito';

const attendi = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function messaggio(errore: unknown): string {
  const e = errore as { message?: string } | string | null | undefined;
  return String(typeof e === 'string' ? e : e?.message ?? '').toLowerCase();
}

function isAnnullato(errore: unknown): boolean {
  const m = messaggio(errore);
  return m.includes('cancel') || m.includes('abort');
}

/** Il plugin iOS rifiuta se c'e' ancora un'altra schermata nativa aperta ("Can't share while sharing is in progress"). */
function isOccupato(errore: unknown): boolean {
  return messaggio(errore).includes('in progress');
}

async function copiaNegliAppunti(testo: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(testo);
      return true;
    }
  } catch { /* si prova il metodo alternativo */ }
  try {
    const area = document.createElement('textarea');
    area.value = testo;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Condivide un testo (con il link dentro il testo stesso, mai nel campo `url`).
 *
 * App nativa: se il foglio di condivisione e' occupato riprova una volta dopo mezzo secondo; se fallisce
 * ancora copia il testo negli appunti e lo dice all'utente, cosi' non resta mai senza niente. L'annullamento
 * da parte dell'utente non e' un errore e non apre nessun ripiego.
 * Web: comportamento invariato (plugin e, se serve, navigator.share).
 */
export async function condividi(
  dati: DatiCondivisione,
  ui: { snackBar: MatSnackBar; translate: TranslateService }
): Promise<EsitoCondivisione> {
  const payload = { title: dati.title, text: dati.text, dialogTitle: dati.dialogTitle ?? dati.title };

  if (!Capacitor.isNativePlatform()) {
    try {
      const { Share } = await import('@capacitor/share');
      await Share.share(payload);
      return 'condiviso';
    } catch (e) {
      if (isAnnullato(e)) return 'annullato';
      if (navigator.share) {
        navigator.share({ title: dati.title, text: dati.text }).catch(() => {});
        return 'condiviso';
      }
      return 'fallito';
    }
  }

  try {
    const { Share } = await import('@capacitor/share');
    for (let tentativo = 0; tentativo < 2; tentativo++) {
      try {
        await Share.share(payload);
        return 'condiviso';
      } catch (e) {
        if (isAnnullato(e)) return 'annullato';
        if (tentativo === 0 && isOccupato(e)) {
          await attendi(600);
          continue;
        }
        break;
      }
    }
  } catch { /* plugin non caricabile: si va al ripiego */ }

  if (await copiaNegliAppunti(dati.text)) {
    ui.snackBar.open(ui.translate.instant('DUEL.LINK_COPIED'), '', {
      duration: 2500, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--success'],
    });
    return 'copiato';
  }
  ui.snackBar.open(ui.translate.instant('COMMON.ERROR_GENERIC'), '', {
    duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--error'],
  });
  return 'fallito';
}
