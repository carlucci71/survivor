import { Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';

export interface FinalTeam {
  name: string;
  nameEn: string;
  score: number;
  penalties?: number;
  logo?: string;
  flag?: string;
}

export interface WorldCupFinal {
  year: number;
  date: string;
  dateEn: string;
  home: FinalTeam;
  away: FinalTeam;
  resultType: 'FT' | 'AET' | 'AP';
  winnerName: string;
  winnerNameEn: string;
}

@Component({
  selector: 'app-mondiali-history-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule],
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

  constructor(
    private readonly translate: TranslateService,
    @Optional() private readonly dialogRef?: MatDialogRef<MondialiHistoryWidgetComponent>
  ) {}

  close(): void {
    this.dialogRef?.close();
  }

  readonly years = [2026, 2022, 2018, 2014, 2010, 2006, 2002, 1998, 1994, 1990, 1986, 1982, 1978, 1974, 1970, 1966, 1962, 1958, 1954, 1950, 1938, 1934, 1930];

  selectedYear = 2022;

  private readonly finals: WorldCupFinal[] = [
    {
      year: 2022,
      date: '18 dic 2022', dateEn: 'Dec 18, 2022',
      home: { name: 'Argentina', nameEn: 'Argentina', score: 3, penalties: 4, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      away: { name: 'Francia',   nameEn: 'France',    score: 3, penalties: 2, logo: 'assets/logos/calcio/mondiali/francia.png' },
      resultType: 'AP',
      winnerName: 'Argentina', winnerNameEn: 'Argentina',
    },
    {
      year: 2018,
      date: '15 lug 2018', dateEn: 'Jul 15, 2018',
      home: { name: 'Francia',  nameEn: 'France',  score: 4, logo: 'assets/logos/calcio/mondiali/francia.png' },
      away: { name: 'Croazia',  nameEn: 'Croatia', score: 2, logo: 'assets/logos/calcio/mondiali/croazia.png' },
      resultType: 'FT',
      winnerName: 'Francia', winnerNameEn: 'France',
    },
    {
      year: 2014,
      date: '13 lug 2014', dateEn: 'Jul 13, 2014',
      home: { name: 'Germania',  nameEn: 'Germany',   score: 1, logo: 'assets/logos/calcio/mondiali/germania.png' },
      away: { name: 'Argentina', nameEn: 'Argentina', score: 0, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      resultType: 'AET',
      winnerName: 'Germania', winnerNameEn: 'Germany',
    },
    {
      year: 2010,
      date: '11 lug 2010', dateEn: 'Jul 11, 2010',
      home: { name: 'Spagna', nameEn: 'Spain',        score: 1, logo: 'assets/logos/calcio/mondiali/spagna.png' },
      away: { name: 'Olanda', nameEn: 'Netherlands',  score: 0, logo: 'assets/logos/calcio/mondiali/olanda.png' },
      resultType: 'AET',
      winnerName: 'Spagna', winnerNameEn: 'Spain',
    },
    {
      year: 2006,
      date: '9 lug 2006', dateEn: 'Jul 9, 2006',
      home: { name: 'Italia',  nameEn: 'Italy',  score: 1, penalties: 5, logo: 'assets/logos/calcio/mondiali/italia.png' },
      away: { name: 'Francia', nameEn: 'France', score: 1, penalties: 3, logo: 'assets/logos/calcio/mondiali/francia.png' },
      resultType: 'AP',
      winnerName: 'Italia', winnerNameEn: 'Italy',
    },
    {
      year: 2002,
      date: '30 giu 2002', dateEn: 'Jun 30, 2002',
      home: { name: 'Germania', nameEn: 'Germany', score: 0, logo: 'assets/logos/calcio/mondiali/germania.png' },
      away: { name: 'Brasile',  nameEn: 'Brazil',  score: 2, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      resultType: 'FT',
      winnerName: 'Brasile', winnerNameEn: 'Brazil',
    },
    {
      year: 1998,
      date: '12 lug 1998', dateEn: 'Jul 12, 1998',
      home: { name: 'Brasile', nameEn: 'Brazil', score: 0, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Francia', nameEn: 'France', score: 3, logo: 'assets/logos/calcio/mondiali/francia.png' },
      resultType: 'FT',
      winnerName: 'Francia', winnerNameEn: 'France',
    },
    {
      year: 1994,
      date: '17 lug 1994', dateEn: 'Jul 17, 1994',
      home: { name: 'Brasile', nameEn: 'Brazil', score: 0, penalties: 3, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Italia',  nameEn: 'Italy',  score: 0, penalties: 2, logo: 'assets/logos/calcio/mondiali/italia.png' },
      resultType: 'AP',
      winnerName: 'Brasile', winnerNameEn: 'Brazil',
    },
    {
      year: 1990,
      date: '8 lug 1990', dateEn: 'Jul 8, 1990',
      home: { name: 'Germania Ovest', nameEn: 'West Germany', score: 1, logo: 'assets/logos/calcio/mondiali/germania.png' },
      away: { name: 'Argentina',      nameEn: 'Argentina',    score: 0, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      resultType: 'FT',
      winnerName: 'Germania Ovest', winnerNameEn: 'West Germany',
    },
    {
      year: 1986,
      date: '29 giu 1986', dateEn: 'Jun 29, 1986',
      home: { name: 'Argentina',      nameEn: 'Argentina',    score: 3, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      away: { name: 'Germania Ovest', nameEn: 'West Germany', score: 2, logo: 'assets/logos/calcio/mondiali/germania.png' },
      resultType: 'FT',
      winnerName: 'Argentina', winnerNameEn: 'Argentina',
    },
    {
      year: 1982,
      date: '11 lug 1982', dateEn: 'Jul 11, 1982',
      home: { name: 'Italia',         nameEn: 'Italy',        score: 3, logo: 'assets/logos/calcio/mondiali/italia.png' },
      away: { name: 'Germania Ovest', nameEn: 'West Germany', score: 1, logo: 'assets/logos/calcio/mondiali/germania.png' },
      resultType: 'FT',
      winnerName: 'Italia', winnerNameEn: 'Italy',
    },
    {
      year: 1978,
      date: '25 giu 1978', dateEn: 'Jun 25, 1978',
      home: { name: 'Argentina', nameEn: 'Argentina',   score: 3, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      away: { name: 'Olanda',    nameEn: 'Netherlands', score: 1, logo: 'assets/logos/calcio/mondiali/olanda.png' },
      resultType: 'AET',
      winnerName: 'Argentina', winnerNameEn: 'Argentina',
    },
    {
      year: 1974,
      date: '7 lug 1974', dateEn: 'Jul 7, 1974',
      home: { name: 'Olanda',         nameEn: 'Netherlands',  score: 1, logo: 'assets/logos/calcio/mondiali/olanda.png' },
      away: { name: 'Germania Ovest', nameEn: 'West Germany', score: 2, logo: 'assets/logos/calcio/mondiali/germania.png' },
      resultType: 'FT',
      winnerName: 'Germania Ovest', winnerNameEn: 'West Germany',
    },
    {
      year: 1970,
      date: '21 giu 1970', dateEn: 'Jun 21, 1970',
      home: { name: 'Brasile', nameEn: 'Brazil', score: 4, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Italia',  nameEn: 'Italy',  score: 1, logo: 'assets/logos/calcio/mondiali/italia.png' },
      resultType: 'FT',
      winnerName: 'Brasile', winnerNameEn: 'Brazil',
    },
    {
      year: 1966,
      date: '30 lug 1966', dateEn: 'Jul 30, 1966',
      home: { name: 'Inghilterra',    nameEn: 'England',      score: 4, logo: 'assets/logos/calcio/mondiali/inghilterra.png' },
      away: { name: 'Germania Ovest', nameEn: 'West Germany', score: 2, logo: 'assets/logos/calcio/mondiali/germania.png' },
      resultType: 'AET',
      winnerName: 'Inghilterra', winnerNameEn: 'England',
    },
    {
      year: 1962,
      date: '17 giu 1962', dateEn: 'Jun 17, 1962',
      home: { name: 'Brasile',        nameEn: 'Brazil',         score: 3, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Cecoslovacchia', nameEn: 'Czechoslovakia', score: 1, logo: 'assets/logos/calcio/mondiali/slovacchia.png' },
      resultType: 'FT',
      winnerName: 'Brasile', winnerNameEn: 'Brazil',
    },    {
      year: 1958,
      date: '29 giu 1958', dateEn: 'Jun 29, 1958',
      home: { name: 'Brasile', nameEn: 'Brazil', score: 5, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      away: { name: 'Svezia',  nameEn: 'Sweden', score: 2, logo: 'assets/logos/calcio/mondiali/svezia.png' },
      resultType: 'FT',
      winnerName: 'Brasile', winnerNameEn: 'Brazil',
    },
    {
      year: 1954,
      date: '4 lug 1954', dateEn: 'Jul 4, 1954',
      home: { name: 'Germania Ovest', nameEn: 'West Germany', score: 3, logo: 'assets/logos/calcio/mondiali/germania.png' },
      away: { name: 'Ungheria',       nameEn: 'Hungary',      score: 2, logo: 'assets/logos/calcio/mondiali/ungheria.png' },
      resultType: 'FT',
      winnerName: 'Germania Ovest', winnerNameEn: 'West Germany',
    },
    {
      year: 1950,
      date: '16 lug 1950', dateEn: 'Jul 16, 1950',
      home: { name: 'Uruguay', nameEn: 'Uruguay', score: 2, logo: 'assets/logos/calcio/mondiali/uruguay.png' },
      away: { name: 'Brasile', nameEn: 'Brazil',  score: 1, logo: 'assets/logos/calcio/mondiali/brasile.png' },
      resultType: 'FT',
      winnerName: 'Uruguay', winnerNameEn: 'Uruguay',
    },
    {
      year: 1938,
      date: '19 giu 1938', dateEn: 'Jun 19, 1938',
      home: { name: 'Italia',   nameEn: 'Italy',   score: 4, logo: 'assets/logos/calcio/mondiali/italia.png' },
      away: { name: 'Ungheria', nameEn: 'Hungary', score: 2, logo: 'assets/logos/calcio/mondiali/ungheria.png' },
      resultType: 'FT',
      winnerName: 'Italia', winnerNameEn: 'Italy',
    },
    {
      year: 1934,
      date: '10 giu 1934', dateEn: 'Jun 10, 1934',
      home: { name: 'Italia',         nameEn: 'Italy',         score: 2, logo: 'assets/logos/calcio/mondiali/italia.png' },
      away: { name: 'Cecoslovacchia', nameEn: 'Czechoslovakia', score: 1, logo: 'assets/logos/calcio/mondiali/slovacchia.png' },
      resultType: 'AET',
      winnerName: 'Italia', winnerNameEn: 'Italy',
    },
    {
      year: 1930,
      date: '30 lug 1930', dateEn: 'Jul 30, 1930',
      home: { name: 'Uruguay',   nameEn: 'Uruguay',   score: 4, logo: 'assets/logos/calcio/mondiali/uruguay.png' },
      away: { name: 'Argentina', nameEn: 'Argentina', score: 2, logo: 'assets/logos/calcio/mondiali/argentina.png' },
      resultType: 'FT',
      winnerName: 'Uruguay', winnerNameEn: 'Uruguay',
    },  ];

  get selectedFinal(): WorldCupFinal | null {
    return this.finals.find(f => f.year === this.selectedYear) ?? null;
  }

  get isCurrentEdition(): boolean {
    return this.selectedYear === 2026;
  }

  private get isEn(): boolean {
    return this.translate.currentLang === 'en';
  }

  getTeamName(team: FinalTeam): string {
    return this.isEn ? team.nameEn : team.name;
  }

  getFinalDate(): string {
    const f = this.selectedFinal;
    if (!f) return '';
    return this.isEn ? f.dateEn : f.date;
  }

  getWinnerName(): string {
    const f = this.selectedFinal;
    if (!f) return '';
    return this.isEn ? f.winnerNameEn : f.winnerName;
  }

  get resultTypeLabel(): string {
    const f = this.selectedFinal;
    if (!f) return '';
    switch (f.resultType) {
      case 'AP': {
        const ph = f.home.penalties ?? 0;
        const pa = f.away.penalties ?? 0;
        return `${this.translate.instant('MONDIALI_HISTORY.RESULT_PSO')} (${ph} – ${pa})`;
      }
      case 'AET': return this.translate.instant('MONDIALI_HISTORY.RESULT_AET');
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
