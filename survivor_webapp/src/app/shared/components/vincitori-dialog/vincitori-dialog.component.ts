import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Giocatore, Lega } from '../../../core/models/interfaces.model';
import { environment } from '../../../../environments/environment';

export interface VincitoriDialogData {
  lega: Lega;
  vincitori: Giocatore[];
}

@Component({
  selector: 'app-vincitori-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './vincitori-dialog.component.html',
  styleUrls: ['./vincitori-dialog.component.scss']
})
export class VincitoriDialogComponent {
  confettiPieces = Array.from({ length: 16 }, (_, i) => i);
  sharing = false;

  /** Mostrato nella card condivisa e nel testo di share, cosi' chi la vede sa dove trovare l'app. */
  readonly shareUrl = environment.baseUrl.replace(/^https?:\/\//, '');

  @ViewChild('shareCard') shareCardRef!: ElementRef<HTMLElement>;

  readonly frase: string;

  constructor(
    public dialogRef: MatDialogRef<VincitoriDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VincitoriDialogData,
    private translate: TranslateService
  ) {
    const frasi: string[] = this.translate.instant('VINCITORI_DIALOG.FRASI');
    const list = Array.isArray(frasi) ? frasi : [];
    this.frase = list.length ? list[Math.floor(Math.random() * list.length)] : '🥂';
  }

  close(): void {
    this.dialogRef.close();
  }

  private buildShareText(): string {
    const names = this.data.vincitori.map(v => v.nickname).join(', ');
    const subtitleKey = this.data.vincitori.length === 1 ? 'VINCITORI_DIALOG.SUBTITLE_ONE' : 'VINCITORI_DIALOG.SUBTITLE_MANY';
    return [
      `🏆 ${this.data.lega.name}`,
      `👑 ${names}`,
      this.translate.instant(subtitleKey),
      '',
      this.translate.instant('VINCITORI_DIALOG.SHARE_CTA', { url: this.shareUrl })
    ].join('\n');
  }

  async shareImage(): Promise<void> {
    if (this.sharing) return;
    this.sharing = true;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = this.shareCardRef.nativeElement;
      const canvas = await html2canvas(el, { backgroundColor: '#0e1435', scale: 2, useCORS: true, logging: false });
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'survivor-vincitori.png', { type: 'image/png' });

      // Native mobile share via Capacitor
      try {
        const { Share } = await import('@capacitor/share');
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const base64 = dataUrl.split(',')[1];
        const saved = await Filesystem.writeFile({
          path: 'survivor-vincitori.png',
          data: base64,
          directory: Directory.Cache
        });
        await Share.share({
          title: `${this.data.lega.name} - Vincitori Survivor`,
          text: this.buildShareText(),
          files: [saved.uri],
          dialogTitle: 'Condividi su Instagram o altrove'
        });
        return;
      } catch {
        // fallback web
      }

      // Web: navigator.share con file oppure download diretto
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'survivor-vincitori.png';
      a.click();
    } finally {
      this.sharing = false;
    }
  }
}