import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

export interface FotoCropData {
  file: File;
}

/** Lato (px CSS) del riquadro di ritaglio: il cerchio che vede l'utente e' esattamente cio' che finisce nell'avatar. */
const VIEW = 280;
/** Lato (px) della foto prodotta. Il backend la ricodifica comunque a 256x256. */
const OUT = 256;
const ZOOM_MAX = 4;

/**
 * Ritaglio circolare della foto profilo, senza librerie: la foto scelta dal selettore del telefono viene mostrata
 * dentro un riquadro quadrato che si sposta col dito/mouse e si ingrandisce con slider, rotella o pizzico a due dita.
 * Alla conferma si disegna la parte visibile su un canvas 256x256 e si restituisce un JPEG (Blob), pronto da caricare.
 * Restituisce null se si annulla.
 */
@Component({
  selector: 'app-foto-crop-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule],
  template: `
    <div class="fc">
      <h2 class="fc-title">{{ 'PHOTO.CROP_TITLE' | translate }}</h2>
      <p class="fc-hint">{{ errore ? ('PHOTO.ERROR_INVALID' | translate) : ('PHOTO.CROP_HINT' | translate) }}</p>

      <div class="fc-stage" #stage
           [style.width.px]="view" [style.height.px]="view"
           (pointerdown)="onDown($event)" (pointermove)="onMove($event)"
           (pointerup)="onUp($event)" (pointercancel)="onUp($event)"
           (wheel)="onWheel($event)">
        <img *ngIf="src" #img class="fc-img" [src]="src" alt="" draggable="false"
             (load)="onLoad($event)" (error)="errore = true"
             [style.width.px]="dw" [style.height.px]="dh"
             [style.transform]="'translate(' + offX + 'px,' + offY + 'px)'">
        <div class="fc-mask"></div>
      </div>

      <input type="range" class="fc-zoom" min="1" [max]="zoomMax" step="0.01"
             [value]="zoom" (input)="onZoom($event)" [disabled]="!pronta"
             [attr.aria-label]="'PHOTO.ZOOM' | translate">

      <p class="fc-rules">{{ 'PHOTO.RULES' | translate }}</p>

      <div class="fc-actions">
        <button type="button" class="fc-btn fc-btn--ghost" (click)="annulla()">{{ 'COMMON.CANCEL' | translate }}</button>
        <button type="button" class="fc-btn fc-btn--primary" [disabled]="!pronta || elaborazione" (click)="conferma()">
          {{ 'PHOTO.USE' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .fc {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 22px 20px 20px;
      background: var(--bg-card, #fff);
      border-radius: 22px;
      font-family: 'Poppins', sans-serif;
      text-align: center;
    }
    .fc-title { margin: 0; font-size: 1.1rem; font-weight: 700; color: #0A3D91; }
    .fc-hint { margin: 0; font-size: 0.8rem; color: #64748B; line-height: 1.4; }

    .fc-stage {
      position: relative;
      flex-shrink: 0;
      overflow: hidden;
      border-radius: 12px;
      background: #0F172A;
      touch-action: none;
      cursor: grab;
      user-select: none;
      -webkit-user-select: none;
    }
    .fc-stage:active { cursor: grabbing; }
    .fc-img {
      position: absolute;
      top: 0; left: 0;
      max-width: none;
      transform-origin: 0 0;
      will-change: transform;
      pointer-events: none;
    }
    /* Cerchio = cio' che finira' nell'avatar; fuori dal cerchio si scurisce */
    .fc-mask {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      box-shadow: 0 0 0 400px rgba(15, 23, 42, 0.62);
      border: 2px solid rgba(255, 255, 255, 0.9);
      box-sizing: border-box;
      pointer-events: none;
    }

    .fc-zoom { width: 100%; max-width: 280px; accent-color: #0A3D91; }

    .fc-rules {
      margin: 0;
      padding: 8px 10px;
      border-radius: 10px;
      background: rgba(10, 61, 145, 0.05);
      font-size: 0.7rem;
      line-height: 1.45;
      color: #64748B;
    }

    .fc-actions { display: flex; gap: 8px; width: 100%; }
    .fc-btn {
      flex: 1;
      padding: 11px 12px;
      border: none;
      border-radius: 14px;
      font-family: inherit;
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.2s ease, box-shadow 0.2s ease;
    }
    .fc-btn:active { transform: scale(0.97); }
    .fc-btn:disabled { opacity: 0.5; cursor: default; }
    .fc-btn--ghost { background: rgba(100, 116, 139, 0.14); color: #475569; }
    .fc-btn--primary {
      background: linear-gradient(135deg, #0A3D91, #1565C0 60%, #4FC3F7 140%);
      color: #fff;
      box-shadow: 0 6px 16px rgba(10, 61, 145, 0.3);
    }
  `],
})
export class FotoCropDialogComponent implements OnInit, OnDestroy {
  @ViewChild('stage', { static: true }) stage!: ElementRef<HTMLElement>;
  @ViewChild('img') imgRef?: ElementRef<HTMLImageElement>;

  readonly view = VIEW;
  readonly zoomMax = ZOOM_MAX;

  src: string | null = null;
  errore = false;
  pronta = false;
  elaborazione = false;

  zoom = 1;
  dw = 0;
  dh = 0;
  offX = 0;
  offY = 0;

  private naturalW = 0;
  private naturalH = 0;
  private baseScale = 1;

  private pointers = new Map<number, { x: number; y: number }>();
  private pinchDist0 = 0;
  private pinchZoom0 = 1;

  constructor(
    public dialogRef: MatDialogRef<FotoCropDialogComponent, Blob | null>,
    @Inject(MAT_DIALOG_DATA) public data: FotoCropData
  ) {}

  ngOnInit(): void {
    this.src = URL.createObjectURL(this.data.file);
  }

  ngOnDestroy(): void {
    if (this.src) URL.revokeObjectURL(this.src);
  }

  /** Foto caricata: parte "a riempimento" (il lato corto copre tutto il riquadro), centrata. */
  onLoad(ev: Event): void {
    const el = ev.target as HTMLImageElement;
    this.naturalW = el.naturalWidth;
    this.naturalH = el.naturalHeight;
    if (!this.naturalW || !this.naturalH) {
      this.errore = true;
      return;
    }
    this.baseScale = VIEW / Math.min(this.naturalW, this.naturalH);
    this.zoom = 1;
    this.dw = this.naturalW * this.baseScale;
    this.dh = this.naturalH * this.baseScale;
    this.offX = (VIEW - this.dw) / 2;
    this.offY = (VIEW - this.dh) / 2;
    this.pronta = true;
  }

  /** Cambia lo zoom tenendo fermo, sotto il dito/mouse, lo stesso punto della foto. */
  private applyZoom(nuovo: number, ax = VIEW / 2, ay = VIEW / 2): void {
    const z = Math.min(ZOOM_MAX, Math.max(1, nuovo));
    const oldScale = this.baseScale * this.zoom;
    const newScale = this.baseScale * z;
    const ix = (ax - this.offX) / oldScale;
    const iy = (ay - this.offY) / oldScale;
    this.zoom = z;
    this.dw = this.naturalW * newScale;
    this.dh = this.naturalH * newScale;
    this.offX = ax - ix * newScale;
    this.offY = ay - iy * newScale;
    this.clamp();
  }

  /** La foto deve sempre coprire tutto il riquadro: niente bordi vuoti. */
  private clamp(): void {
    this.offX = Math.min(0, Math.max(VIEW - this.dw, this.offX));
    this.offY = Math.min(0, Math.max(VIEW - this.dh, this.offY));
  }

  onZoom(ev: Event): void {
    if (!this.pronta) return;
    this.applyZoom(parseFloat((ev.target as HTMLInputElement).value));
  }

  onWheel(ev: WheelEvent): void {
    if (!this.pronta) return;
    ev.preventDefault();
    const r = this.stage.nativeElement.getBoundingClientRect();
    this.applyZoom(this.zoom * (ev.deltaY < 0 ? 1.08 : 1 / 1.08), ev.clientX - r.left, ev.clientY - r.top);
  }

  onDown(ev: PointerEvent): void {
    if (!this.pronta) return;
    this.stage.nativeElement.setPointerCapture(ev.pointerId);
    this.pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (this.pointers.size === 2) {
      this.pinchDist0 = this.distanza();
      this.pinchZoom0 = this.zoom;
    }
  }

  onMove(ev: PointerEvent): void {
    const prev = this.pointers.get(ev.pointerId);
    if (!prev || !this.pronta) return;
    this.pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });

    if (this.pointers.size === 1) {
      this.offX += ev.clientX - prev.x;
      this.offY += ev.clientY - prev.y;
      this.clamp();
    } else if (this.pointers.size === 2 && this.pinchDist0 > 0) {
      const [a, b] = [...this.pointers.values()];
      const r = this.stage.nativeElement.getBoundingClientRect();
      this.applyZoom(this.pinchZoom0 * (this.distanza() / this.pinchDist0), (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
    }
  }

  onUp(ev: PointerEvent): void {
    this.pointers.delete(ev.pointerId);
    if (this.pointers.size < 2) this.pinchDist0 = 0;
  }

  private distanza(): number {
    const [a, b] = [...this.pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  annulla(): void {
    this.dialogRef.close(null);
  }

  /** Disegna su un canvas 256x256 esattamente la parte della foto che sta dentro il cerchio e la esporta in JPEG. */
  conferma(): void {
    const img = this.imgRef?.nativeElement;
    if (!img || !this.pronta) return;
    this.elaborazione = true;

    const scale = this.baseScale * this.zoom;
    const canvas = document.createElement('canvas');
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      this.elaborazione = false;
      this.errore = true;
      return;
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, OUT, OUT);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, -this.offX / scale, -this.offY / scale, VIEW / scale, VIEW / scale, 0, 0, OUT, OUT);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          this.elaborazione = false;
          this.errore = true;
          return;
        }
        this.dialogRef.close(blob);
      },
      'image/jpeg',
      0.88
    );
  }
}
