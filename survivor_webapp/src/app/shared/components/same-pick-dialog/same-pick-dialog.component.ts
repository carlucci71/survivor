import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';

export interface SamePickDialogData {
  squadraNome: string;
  nicknames: string[];
}

@Component({
  selector: 'app-same-pick-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="sp-dialog">
      <button class="sp-close" (click)="dialogRef.close()" aria-label="Chiudi">
        <mat-icon>close</mat-icon>
      </button>

      <div class="sp-emoji">🎯</div>

      <div class="sp-sentence">
        <span [innerHTML]="sentenceText"></span>
      </div>

      <p class="sp-phrase">{{ phrase }}</p>

      <div class="sp-team-chip">
        <span class="sp-team-name">{{ data.squadraNome }}</span>
      </div>
    </div>
  `,
  styles: [`
    .sp-dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding: 32px 24px 26px;
      background: linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 100%);
      border-radius: 20px;
      position: relative;
      text-align: center;
      min-width: 0;
      width: 100%;
      box-sizing: border-box;
    }

    .sp-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      min-width: 32px;
      border: none;
      background: rgba(10, 61, 145, 0.07);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      padding: 0;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #0A3D91;
      }

      &:hover { background: rgba(10, 61, 145, 0.14); }
    }

    .sp-emoji {
      font-size: 3.2rem;
      line-height: 1;
      animation: pop 0.45s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      margin-top: 4px;
    }

    @keyframes pop {
      from { transform: scale(0.3) rotate(-15deg); opacity: 0; }
      to   { transform: scale(1)   rotate(0deg);   opacity: 1; }
    }

    .sp-sentence {
      font-size: 1.2rem;
      font-weight: 800;
      font-family: 'Poppins', sans-serif;
      line-height: 1.35;
      color: #1E3A5F;
      padding: 0 8px;
    }

    .sp-names-inline {
      color: #0A3D91;
    }

    .sp-phrase {
      font-size: 0.88rem;
      font-style: italic;
      color: #374151;
      line-height: 1.5;
      margin: 0;
      padding: 0 8px;
      max-width: 300px;
      opacity: 0.8;
    }

    .sp-team-chip {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, #0A3D91, #1a6bcc);
      border-radius: 24px;
      padding: 8px 24px;
      margin-top: 4px;
    }

    .sp-team-name {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.3px;
    }

    @media (max-width: 400px) {
      .sp-dialog   { padding: 28px 16px 22px; gap: 13px; }
      .sp-emoji    { font-size: 2.6rem; }
      .sp-sentence { font-size: 1.05rem; }
      .sp-phrase   { font-size: 0.82rem; }
    }
  `]
})
export class SamePickDialogComponent implements OnInit {

  phrase = '';
  lang = 'it';

  private readonly phrases: Record<string, string[]> = {
    it: [
      'Grandi menti pensano allo stesso modo! 🧠',
      'Avete fiutato lo stesso affare... ma uno solo vincerà! 😈',
      'Siete della stessa scuola di pensiero. Per ora. ⚔️',
      'Alleanza temporanea o rivali eterni? Solo il campo decide! 🏟️',
      'Stessa squadra, stesso coraggio. Che la fortuna abbia un solo favorito! 🍀',
      'Li avete scelti insieme... ma potete perdere insieme! 💀',
      'Sembra una cospirazione. O forse solo buon senso! 🔍',
      'L\'unione fa la forza, ma in Survivor vince solo uno! 🏆',
      'Occhio aquilino, gusto condiviso. Che venga il meglio! 🦅',
      'Vi siete consultati di nascosto? Confessate! 😂',
      'Stesso istinto, destini diversi. Chi sopravviverà? 🎯',
      'La vostra scelta è la stessa, ma il cuore batte per uno solo! ❤️',
      'Siete sul carrozzone giusto? Lo scopriremo presto! 🎢',
      'Due teste, una scelta. La tattica è la stessa, la fortuna no! 🎲',
      'Compagni di avventura... o di sventura? 😅',
      'Stessa visione strategica! Ma solo uno alzerà la coppa! 🥇',
      'Avete scelto bene... o così credete entrambi! 😏',
      'Il destino vi accomuna per ora. Poi si vedrà! 🌪️',
      'Cervelli sintonizzati sulla stessa frequenza! 📡',
      'Solidarietà è bella, ma la vittoria è solitaria! 😤',
    ],
    en: [
      'Great minds think alike! 🧠',
      'You both sniffed the same deal... but only one can win! 😈',
      'Same school of thought. For now. ⚔️',
      'Temporary alliance or eternal rivals? Only the pitch decides! 🏟️',
      'Same team, same courage. May fortune favour only one! 🍀',
      'You picked together... you might lose together! 💀',
      'Looks like a conspiracy — or just good instincts! 🔍',
      'United you stand, but in Survivor only one survives! 🏆',
      'Eagle-eyed and aligned. May the best one win! 🦅',
      'Did you secretly agree? Confess! 😂',
      'Same instinct, different fates. Who will survive? 🎯',
      'Your choice is the same, but only one heart wins! ❤️',
      'Are you on the right wagon? We\'ll find out soon! 🎢',
      'Two heads, one pick. Same tactic, different luck! 🎲',
      'Partners in adventure... or in disaster? 😅',
      'Same strategic vision! But only one will lift the trophy! 🥇',
      'You both chose well... or so you both think! 😏',
      'Fate unites you for now. Then we\'ll see! 🌪️',
      'Brains tuned to the same frequency! 📡',
      'Solidarity is great, but victory is lonely! 😤',
    ]
  };

  constructor(
    public dialogRef: MatDialogRef<SamePickDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SamePickDialogData,
    private translate: TranslateService
  ) {}

  get sentenceText(): string {
    const nicks = this.data.nicknames;
    const it = this.lang === 'it';
    const MAX_NAMES = 3;

    if (nicks.length > MAX_NAMES) {
      const count = nicks.length;
      return it
        ? `<span class="sp-names-inline">Altre ${count} persone</span> hanno votato come te!`
        : `<span class="sp-names-inline">${count} others</span> voted like you!`;
    }

    let names: string;
    if (nicks.length === 1) {
      names = nicks[0];
    } else if (nicks.length === 2) {
      names = it ? `${nicks[0]} e ${nicks[1]}` : `${nicks[0]} and ${nicks[1]}`;
    } else {
      names = it
        ? `${nicks[0]}, ${nicks[1]} e ${nicks[2]}`
        : `${nicks[0]}, ${nicks[1]} and ${nicks[2]}`;
    }

    const verb = nicks.length === 1
      ? (it ? ' ha votato come te!' : ' voted like you!')
      : (it ? ' hanno votato come te!' : ' voted like you!');

    return `<span class="sp-names-inline">${names}</span>${verb}`;
  }

  get formattedNames(): string {
    const nicks = this.data.nicknames;
    if (nicks.length === 1) return nicks[0];
    if (nicks.length === 2) return `${nicks[0]} e ${nicks[1]}`;
    return `${nicks[0]}, ${nicks[1]} e altri ${nicks.length - 2}`;
  }

  ngOnInit(): void {
    this.lang = this.translate.currentLang || this.translate.getDefaultLang() || 'it';
    const pool = this.phrases[this.lang] ?? this.phrases['it'];
    this.phrase = pool[Math.floor(Math.random() * pool.length)];
  }
}
