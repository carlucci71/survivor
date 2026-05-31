import { Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';

export interface FinalTeam {
  name: string;
  score: number;
  penalties?: number;
  logo?: string;
  flag?: string;
}

export interface WorldCupFinal {
  year: number;
  date: string;
  home: FinalTeam;
  away: FinalTeam;
  resultType: 'FT' | 'AET' | 'AP';
  winnerName: string;
}

@Component({
  selector: 'app-mondiali-history-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './mondiali-history-widget.component.html',
  styleUrls: ['./mondiali-history-widget.component.scss'],
  animations: [
    trigger('cardAnim', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('250ms ease-out', style({ height: '*', opacity: 1, overflow: 'visible' }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('200ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class MondialiHistoryWidgetComponent {

  constructor(@Optional() private readonly dialogRef?: MatDialogRef<MondialiHistoryWidgetComponent>) {}

  close(): void {
    this.dialogRef?.close();
  }

  readonly years = [2026, 2022, 2018, 2014, 2010, 2006, 2002, 1998, 1994, 1990, 1986, 1982, 1978, 1974, 1970, 1966, 1962, 1958, 1954, 1950, 1938, 1934, 1930];

  selectedYear = 2022;

  private readonly finals: WorldCupFinal[] = [
    {
      year: 2022,
      date: '18 dic 2022',
      home: { name: 'Argentina', score: 3, penalties: 4, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      away: { name: 'Francia',   score: 3, penalties: 2, logo: 'assets/logos/calcio/mondiali/francia.png' },
      resultType: 'AP',
      winnerName: 'Argentina',
    },
    {
      year: 2018,
      date: '15 lug 2018',
      home: { name: 'Francia',  score: 4, logo: 'assets/logos/calcio/mondiali/francia.png' },
      away: { name: 'Croazia',  score: 2, logo: 'assets/logos/calcio/mondiali/croazia.png' },
      resultType: 'FT',
      winnerName: 'Francia',
    },
    {
      year: 2014,
      date: '13 lug 2014',
      home: { name: 'Germania',  score: 1, logo: 'assets/logos/calcio/mondiali/germania.png' },
      away: { name: 'Argentina', score: 0, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      resultType: 'AET',
      winnerName: 'Germania',
    },
    {
      year: 2010,
      date: '11 lug 2010',
      home: { name: 'Spagna', score: 1, logo: 'assets/logos/calcio/mondiali/spagna.png' },
      away: { name: 'Olanda', score: 0, logo: 'assets/logos/calcio/mondiali/olanda.png' },
      resultType: 'AET',
      winnerName: 'Spagna',
    },
    {
      year: 2006,
      date: '9 lug 2006',
      home: { name: 'Italia',  score: 1, penalties: 5, logo: 'assets/logos/calcio/mondiali/italia.png' },
      away: { name: 'Francia', score: 1, penalties: 3, logo: 'assets/logos/calcio/mondiali/francia.png' },
      resultType: 'AP',
      winnerName: 'Italia',
    },
    {
      year: 2002,
      date: '30 giu 2002',
      home: { name: 'Germania', score: 0, logo: 'assets/logos/calcio/mondiali/germania.png' },
      away: { name: 'Brasile',  score: 2, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      resultType: 'FT',
      winnerName: 'Brasile',
    },
    {
      year: 1998,
      date: '12 lug 1998',
      home: { name: 'Brasile', score: 0, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Francia', score: 3, logo: 'assets/logos/calcio/mondiali/francia.png' },
      resultType: 'FT',
      winnerName: 'Francia',
    },
    {
      year: 1994,
      date: '17 lug 1994',
      home: { name: 'Brasile', score: 0, penalties: 3, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Italia',  score: 0, penalties: 2, logo: 'assets/logos/calcio/mondiali/italia.png' },
      resultType: 'AP',
      winnerName: 'Brasile',
    },
    {
      year: 1990,
      date: '8 lug 1990',
      home: { name: 'Germania Ovest', score: 1, logo: 'assets/logos/calcio/mondiali/germania.png' },
      away: { name: 'Argentina',      score: 0, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      resultType: 'FT',
      winnerName: 'Germania Ovest',
    },
    {
      year: 1986,
      date: '29 giu 1986',
      home: { name: 'Argentina',      score: 3, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      away: { name: 'Germania Ovest', score: 2, logo: 'assets/logos/calcio/mondiali/germania.png' },
      resultType: 'FT',
      winnerName: 'Argentina',
    },
    {
      year: 1982,
      date: '11 lug 1982',
      home: { name: 'Italia',         score: 3, logo: 'assets/logos/calcio/mondiali/italia.png' },
      away: { name: 'Germania Ovest', score: 1, logo: 'assets/logos/calcio/mondiali/germania.png' },
      resultType: 'FT',
      winnerName: 'Italia',
    },
    {
      year: 1978,
      date: '25 giu 1978',
      home: { name: 'Argentina', score: 3, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      away: { name: 'Olanda',    score: 1, logo: 'assets/logos/calcio/mondiali/olanda.png' },
      resultType: 'AET',
      winnerName: 'Argentina',
    },
    {
      year: 1974,
      date: '7 lug 1974',
      home: { name: 'Olanda',         score: 1, logo: 'assets/logos/calcio/mondiali/olanda.png' },
      away: { name: 'Germania Ovest', score: 2, logo: 'assets/logos/calcio/mondiali/germania.png' },
      resultType: 'FT',
      winnerName: 'Germania Ovest',
    },
    {
      year: 1970,
      date: '21 giu 1970',
      home: { name: 'Brasile', score: 4, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Italia',  score: 1, logo: 'assets/logos/calcio/mondiali/italia.png' },
      resultType: 'FT',
      winnerName: 'Brasile',
    },
    {
      year: 1966,
      date: '30 lug 1966',
      home: { name: 'Inghilterra',    score: 4, logo: 'assets/logos/calcio/mondiali/inghilterra.png' },
      away: { name: 'Germania Ovest', score: 2, logo: 'assets/logos/calcio/mondiali/germania.png' },
      resultType: 'AET',
      winnerName: 'Inghilterra',
    },
    {
      year: 1962,
      date: '17 giu 1962',
      home: { name: 'Brasile',        score: 3, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Cecoslovacchia', score: 1, logo: 'assets/logos/calcio/mondiali/slovacchia.png' },
      resultType: 'FT',
      winnerName: 'Brasile',
    },    {
      year: 1958,
      date: '29 giu 1958',
      home: { name: 'Brasile', score: 5, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Svezia',  score: 2, logo: 'assets/logos/calcio/mondiali/svezia.png' },
      resultType: 'FT',
      winnerName: 'Brasile',
    },
    {
      year: 1954,
      date: '4 lug 1954',
      home: { name: 'Germania Ovest', score: 3, logo: 'assets/logos/calcio/mondiali/germania.png' },
      away: { name: 'Ungheria',       score: 2, logo: 'assets/logos/calcio/mondiali/ungheria.png' },
      resultType: 'FT',
      winnerName: 'Germania Ovest',
    },
    {
      year: 1950,
      date: '16 lug 1950',
      home: { name: 'Uruguay', score: 2, logo: 'assets/logos/calcio/mondiali/uruguay.png' },
      away: { name: 'Brasile', score: 1, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      resultType: 'FT',
      winnerName: 'Uruguay',
    },
    {
      year: 1938,
      date: '19 giu 1938',
      home: { name: 'Italia',   score: 4, logo: 'assets/logos/calcio/mondiali/italia.png' },
      away: { name: 'Ungheria', score: 2, logo: 'assets/logos/calcio/mondiali/ungheria.png' },
      resultType: 'FT',
      winnerName: 'Italia',
    },
    {
      year: 1934,
      date: '10 giu 1934',
      home: { name: 'Italia',         score: 2, logo: 'assets/logos/calcio/mondiali/italia.png' },
      away: { name: 'Cecoslovacchia', score: 1, logo: 'assets/logos/calcio/mondiali/slovacchia.png' },
      resultType: 'AET',
      winnerName: 'Italia',
    },
    {
      year: 1930,
      date: '30 lug 1930',
      home: { name: 'Uruguay',   score: 4, logo: 'assets/logos/calcio/mondiali/uruguay.png' },
      away: { name: 'Argentina', score: 2, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      resultType: 'FT',
      winnerName: 'Uruguay',
    },  ];

  get selectedFinal(): WorldCupFinal | null {
    return this.finals.find(f => f.year === this.selectedYear) ?? null;
  }

  get isCurrentEdition(): boolean {
    return this.selectedYear === 2026;
  }

  get resultTypeLabel(): string {
    const f = this.selectedFinal;
    if (!f) return '';
    switch (f.resultType) {
      case 'AP': {
        const ph = f.home.penalties ?? 0;
        const pa = f.away.penalties ?? 0;
        return `d.c.r. (${ph} – ${pa})`;
      }
      case 'AET': return 'd.t.s.';
      default:    return '';
    }
  }

  hasData(year: number): boolean {
    return this.finals.some(f => f.year === year);
  }

  isWinner(team: FinalTeam, final: WorldCupFinal): boolean {
    return team.name === final.winnerName;
  }

  selectYear(year: number): void {
    this.selectedYear = year;
  }
}
