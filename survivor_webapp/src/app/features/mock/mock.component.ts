import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MockResetDialogComponent } from './mock-reset-dialog.component';
import { SportService } from '../../core/services/sport.service';
import { CampionatoService } from '../../core/services/campionato.service';
import { Campionato, Sport } from '../../core/models/interfaces.model';
import { MockService } from '../../core/services/mock.service';
import { PartitaMock } from '../../core/models/interfaces.model';
import { forkJoin, Observable } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mock',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, HeaderComponent, MatFormFieldModule, MatInputModule, MatIconModule, MatSelectModule, MatRadioModule, MatButtonModule, MatCardModule, TranslateModule],
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.scss']
})
export class MockComponent implements OnInit {
  sportSel: string | null = null;
  campionatoSel: Campionato | null = null;
  sportDisponibili: Sport[] = [];
  campionatiDisponibili: Campionato[] = [];
  anno: number | null = null;
  giornata: number | null = null;
  dataRiferimento: Date | null = null;
  originalDataRiferimento: Date | null = null;
  message: string | null = null;
  clearCache = false;
  partite: PartitaMock[] = [];
  originalPartite: PartitaMock[] = [];
  saving = false;

  // merged constructor with router/auth
  constructor(
    private dialog: MatDialog,
    private sportService: SportService,
    private campionatoService: CampionatoService,
    private mockService: MockService,
    private router: Router,
    private authService: AuthService
  ) {}

  @ViewChild('dataRifInput', { static: false }) dataRifInput?: ElementRef<HTMLInputElement>;

  openDataRiferimentoPicker(): void {
    const el = this.dataRifInput?.nativeElement;
    if (!el) return;
    // try showPicker if supported, otherwise focus+click
    const anyEl = el as any;
    if (typeof anyEl.showPicker === 'function') {
      try { anyEl.showPicker(); return; } catch { /* ignore */ }
    }
    try {
      el.focus(); el.click();
    } catch { /* ignore */ }
  }

  ngOnInit(): void {
    this.caricaSport();
  }

  caricaSport(): void {
    this.sportService.getSport().subscribe({
      next: (sport) => (this.sportDisponibili = sport),
      error: (err) => console.error('Errore caricamento sport', err),
    });
  }

  selezionaSport(): void {
    if (this.sportSel) {
      this.campionatoService.getCampionatoBySport(this.sportSel).subscribe({
        next: (campionati) => {
          this.campionatiDisponibili = campionati;
          this.campionatoSel = null;
          // reset giornata when sport changed
          this.giornata = 1;
        },
        error: (err) => console.error('Errore caricamento campionati', err),
      });
    } else {
      this.campionatiDisponibili = [];
      this.campionatoSel = null;
    }
  }

  onCampionatoChange(): void {
    if (this.campionatoSel) {
      // set default anno from campionato.annoCorrente if available
      // fallback to campionatoSel.anno or keep existing
      // @ts-ignore possible server field
      const annoCorrente = (this.campionatoSel as any).annoCorrente ?? (this.campionatoSel as any).anno ?? null;
      if (annoCorrente) this.anno = Number(annoCorrente);
      // set default giornata from campionato.giornataDaGiocare if available, otherwise 1
      const max = this.campionatoSel.numGiornate ?? Infinity;
      // @ts-ignore possible server field
      const defaultGiornata = (this.campionatoSel as any).giornataDaGiocare ?? 1;
      this.giornata = Number(defaultGiornata) || 1;
      if (this.giornata > max) this.giornata = max;
      if (this.giornata < 1) this.giornata = 1;
      // auto-load partite and data riferimento when campionato selected and form is valid
      if (this.isFormValid() && this.giornata) {
        this.loadDataRiferimento();
        this.loadPartite();
      }
    }
  }

  onGiornataChange(value: number | string): void {
    const num = Number(value) || 1;
    const max = this.campionatoSel?.numGiornate ?? Infinity;
    let clamped = num;
    if (clamped < 1) clamped = 1;
    if (max !== Infinity && clamped > max) clamped = max;
    this.giornata = clamped;
    // load partite and default data riferimento for the selected giornata
    if (this.isFormValid() && this.giornata) {
      this.loadDataRiferimento();
      this.loadPartite();
    } else {
      this.partite = [];
    }
  }

  loadPartite(): void {
    if (!this.campionatoSel || !this.anno || !this.giornata) {
      this.partite = [];
      return;
    }
    this.mockService.getPartite(this.campionatoSel.id, Number(this.anno), Number(this.giornata)).subscribe({
      next: (p) => {
        // normalize orario to Date
        this.partite = (p || []).map(x => ({ ...x, orario: x && x.orario ? new Date(x.orario) : new Date(0) }));
        // keep a deep copy for change detection
        this.originalPartite = JSON.parse(JSON.stringify(this.partite));
      },
      error: (err) => {
        console.error('Errore caricamento partite', err);
        this.partite = [];
      }
    });
  }

  formatDateForInput(d: any): string {
    if (!d) return '';
    const date = new Date(d);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISO = new Date(date.getTime() - tzOffset).toISOString().slice(0,16);
    return localISO;
  }

  // Format a Date into backend-expected LocalDateTime string: yyyyMMddHHmm
  formatDateForBackend(d: Date | null): string | undefined {
    if (!d) return undefined;
    const date = new Date(d);
    const pad = (n: number, len = 2) => String(n).padStart(len, '0');
    const y = date.getFullYear();
    const M = pad(date.getMonth() + 1);
    const D = pad(date.getDate());
    const h = pad(date.getHours());
    const m = pad(date.getMinutes());
    return `${y}${M}${D}${h}${m}`;
  }

  parseDateFromInput(v: string): Date | null {
    // convert local datetime-local value to Date
    if (!v) return null;
    const dt = new Date(v);
    return dt;
  }

  // parse backend pattern yyyyMMddHHmm into Date (local)
  parseBackendDate(s: string | null | undefined): Date | null {
    if (!s) return null;
    let clean = String(s).trim();
    // strip surrounding quotes if present
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      clean = clean.slice(1, -1).trim();
    }
    // if backend returned compact yyyyMMddHHmm
    if (/^\d{12}$/.test(clean)) {
      const y = Number(clean.substr(0,4));
      const M = Number(clean.substr(4,2));
      const D = Number(clean.substr(6,2));
      const h = Number(clean.substr(8,2));
      const m = Number(clean.substr(10,2));
      return new Date(y, M-1, D, h, m);
    }

    // try parsing common ISO-like strings (e.g. 2026-02-08T11:10:00)
    const tryParse = (str: string): Date | null => {
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    };

    // direct parse
    let parsed = tryParse(clean);
    if (parsed) return parsed;

    // sometimes backend returns with space instead of T
    parsed = tryParse(clean.replace(' ', 'T'));
    if (parsed) return parsed;

    // sometimes seconds are missing/present; try removing timezone offset
    const withoutZone = clean.replace(/([+-]\d{2}:?\d{2})$/, '');
    parsed = tryParse(withoutZone);
    if (parsed) return parsed;

    return null;
  }

  onDataRiferimentoChange(value: string): void {
    const d = this.parseDateFromInput(value);
    this.dataRiferimento = d ? d : this.dataRiferimento;
  }

  loadDataRiferimento(): void {
    if (!this.campionatoSel || !this.anno) return;
    // if user already modified dataRiferimento (original vs current differ), don't override
    const origISO = this.originalDataRiferimento ? new Date(this.originalDataRiferimento).toISOString() : null;
    const curISO = this.dataRiferimento ? new Date(this.dataRiferimento).toISOString() : null;
    const userModified = origISO !== null && curISO !== null && origISO !== curISO;
    if (userModified) return;

    this.mockService.dataRiferimento().subscribe({
      next: (txt) => {
        const parsed = this.parseBackendDate(String(txt));
        this.dataRiferimento = parsed;
        this.originalDataRiferimento = parsed ? new Date(parsed.getTime()) : null;
      },
      error: (err) => {
        console.error('Errore caricamento data riferimento', err);
        this.dataRiferimento = null;
        this.originalDataRiferimento = null;
      }
    });
  }

  onPartitaChange(partita: PartitaMock, field: 'orario'|'scoreCasa'|'scoreFuori', value: any): void {
    if (field === 'orario') {
      const d = this.parseDateFromInput(value);
      partita.orario = d ? d : partita.orario;
    } else if (field === 'scoreCasa') {
      partita.scoreCasa = value === '' ? null as any : Number(value);
    } else if (field === 'scoreFuori') {
      partita.scoreFuori = value === '' ? null as any : Number(value);
    }
  }

  // Returns true if any field in the partita row was modified
  rowChanged(p: PartitaMock): boolean {
    const o = this.originalPartite.find(x => x.id === p.id);
    if (!o) return true;
    const or = (o.orario ? new Date(o.orario).toISOString() : null);
    const pr = (p.orario ? new Date(p.orario).toISOString() : null);
    if (or !== pr) return true;
    if ((o.scoreCasa as any) !== (p.scoreCasa as any)) return true;
    if ((o.scoreFuori as any) !== (p.scoreFuori as any)) return true;
    return false;
  }

  // Returns true if specific field changed
  fieldChanged(p: PartitaMock, field: 'orario'|'scoreCasa'|'scoreFuori'): boolean {
    const o = this.originalPartite.find(x => x.id === p.id);
    if (!o) return true;
    if (field === 'orario') {
      const or = o.orario ? new Date(o.orario).toISOString() : null;
      const pr = p.orario ? new Date(p.orario).toISOString() : null;
      return or !== pr;
    }
    if (field === 'scoreCasa') return (o.scoreCasa as any) !== (p.scoreCasa as any);
    if (field === 'scoreFuori') return (o.scoreFuori as any) !== (p.scoreFuori as any);
    return false;
  }

  dataRiferimentoChanged(): boolean {
    const orig = this.originalDataRiferimento ? new Date(this.originalDataRiferimento).toISOString() : null;
    const cur = this.dataRiferimento ? new Date(this.dataRiferimento).toISOString() : null;
    return orig !== cur;
  }

  hasChanges(): boolean {
    if (!this.partite || !this.originalPartite) return false;
    // check dataRiferimento changes
    const origDR = this.originalDataRiferimento ? new Date(this.originalDataRiferimento).toISOString() : null;
    const curDR = this.dataRiferimento ? new Date(this.dataRiferimento).toISOString() : null;
    if (origDR !== curDR) return true;
    for (const p of this.partite) {
      const o = this.originalPartite.find(x => x.id === p.id);
      if (!o) return true;
      const or = (o.orario ? new Date(o.orario).toISOString() : null);
      const pr = (p.orario ? new Date(p.orario).toISOString() : null);
      if (or !== pr) return true;
      if ((o.scoreCasa as any) !== (p.scoreCasa as any)) return true;
      if ((o.scoreFuori as any) !== (p.scoreFuori as any)) return true;
    }
    return false;
  }

  applyAllChanges(): void {
    if (!this.campionatoSel) return;
    const observables: Observable<any>[] = [];
    const origDR = this.originalDataRiferimento ? new Date(this.originalDataRiferimento).toISOString() : null;
    const curDR = this.dataRiferimento ? new Date(this.dataRiferimento).toISOString() : null;
    const changedDataRif = origDR !== curDR;
    const dataRifFormatted = changedDataRif ? this.formatDateForBackend(this.dataRiferimento) : undefined;
    for (const p of this.partite) {
      const o = this.originalPartite.find(x => x.id === p.id);
      if (!o) continue;
      const oldOr = o.orario ? new Date(o.orario).toISOString() : null;
      const newOr = p.orario ? new Date(p.orario).toISOString() : null;
      const changedOrario = oldOr !== newOr;
      const changedScoreCasa = (o.scoreCasa as any) !== (p.scoreCasa as any);
      const changedScoreFuori = (o.scoreFuori as any) !== (p.scoreFuori as any);
      const changedScores = changedScoreCasa || changedScoreFuori;
      if (!changedOrario && !changedScores) continue;

      const casaSigla = (changedOrario || changedScores) ? p.casaSigla : undefined;
      const fuoriSigla = (changedOrario || changedScores) ? p.fuoriSigla : undefined;
      const orarioPartita = changedOrario ? this.formatDateForBackend(p.orario) : undefined;
      const scoreCasa = changedScores ? p.scoreCasa : undefined;
      const scoreFuori = changedScores ? p.scoreFuori : undefined;

      observables.push(
        this.mockService.updateMock(
          this.campionatoSel.id,
          this.clearCache,
          Number(this.anno),
          Number(this.giornata),
          dataRifFormatted,
          casaSigla,
          fuoriSigla,
          scoreCasa,
          scoreFuori,
          orarioPartita
        )
      );
    }

    // If no partita-specific changes but dataRiferimento changed, still call updateMock once with only dataRif
    if (observables.length === 0 && changedDataRif) {
      observables.push(this.mockService.updateMock(this.campionatoSel.id, this.clearCache,Number(this.anno), Number(this.giornata), dataRifFormatted));
    }

    if (observables.length === 0) {
      this.message = 'Nessuna modifica da salvare';
      return;
    }

    this.saving = true;
    forkJoin(observables).subscribe({
      next: () => {
        this.saving = false;
        this.message = 'Modifiche applicate con successo';
        // if dataRiferimento was part of the call(s), mark it as saved (remove highlight)
        if (changedDataRif) {
          this.originalDataRiferimento = this.dataRiferimento ? new Date(this.dataRiferimento.getTime()) : null;
        }
        // reload partite to refresh originals
        this.loadPartite();
      },
      error: (err) => {
        this.saving = false;
        console.error('Errore salvataggio modifiche', err);
        this.message = 'Errore durante il salvataggio delle modifiche';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  openResetDialog(): void {
    const ref = this.dialog.open(MockResetDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: { sportSel: this.sportSel, campionatoSel: this.campionatoSel, anno: this.anno, giornata: this.giornata }
    });
    ref.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.message = 'Reset eseguito con successo';
      } else if (result) {
        this.message = String(result);
      }
    });
  }

  isFormValid(): boolean {
    return !!this.sportSel && !!this.campionatoSel && this.anno !== null && this.anno !== undefined;
  }
}
