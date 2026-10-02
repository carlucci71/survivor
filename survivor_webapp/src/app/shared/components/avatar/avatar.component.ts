import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FotoProfiloService } from '../../../core/services/foto-profilo.service';

const PALETTES = [
  'linear-gradient(135deg, #6366F1, #8B5CF6)',
  'linear-gradient(135deg, #EC4899, #F43F5E)',
  'linear-gradient(135deg, #0EA5E9, #06B6D4)',
  'linear-gradient(135deg, #10B981, #059669)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #8B5CF6, #EC4899)',
  'linear-gradient(135deg, #14B8A6, #0EA5E9)',
];

/**
 * Avatar del giocatore: la foto se ce n'e' una visibile, altrimenti le iniziali su sfondo colorato (stesso schema
 * di colori dell'avatar in home e nel profilo). Se la foto non si carica o non e' visibile, ricade da solo sulle
 * iniziali. Il click non e' gestito qui: lo decide chi lo usa.
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="av"
          [style.width.px]="size" [style.height.px]="size"
          [style.fontSize.px]="size * 0.4"
          [style.background]="url ? '#E2E8F0' : gradient">
      <img *ngIf="url" class="av-img" [src]="url" alt="" draggable="false" (error)="url = null">
      <span *ngIf="!url" class="av-ini">{{ iniziali }}</span>
    </span>
  `,
  styles: [`
    :host { display: inline-flex; flex-shrink: 0; }
    .av {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.5px;
      user-select: none;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
    }
    .av-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  `],
})
export class AvatarComponent implements OnChanges, OnDestroy {
  @Input() giocatoreId: number | null | undefined;
  @Input() fotoVersion: number | null | undefined;
  @Input() nome = '';
  @Input() size = 34;

  url: string | null = null;
  private sub?: Subscription;

  constructor(private foto: FotoProfiloService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['giocatoreId'] || changes['fotoVersion']) this.carica();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private carica(): void {
    this.sub?.unsubscribe();
    if (!this.giocatoreId || !this.fotoVersion) {
      this.url = null;
      return;
    }
    this.sub = this.foto.getUrl(this.giocatoreId, this.fotoVersion).subscribe((u) => (this.url = u));
  }

  get iniziali(): string {
    const n = (this.nome || '').trim();
    return n ? n.substring(0, 2).toUpperCase() : '?';
  }

  get gradient(): string {
    const n = (this.nome || 'A').trim();
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = (hash * 31 + n.charCodeAt(i)) % PALETTES.length;
    }
    return PALETTES[Math.abs(hash) % PALETTES.length];
  }
}
