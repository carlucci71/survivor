import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GironeItem {
  label: string;
  teams: { sigla: string; nome: string }[];
}

@Component({
  selector: 'app-mondiali-groups-ticker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mondiali-groups-ticker.component.html',
  styleUrls: ['./mondiali-groups-ticker.component.scss']
})
export class MondialiGroupsTickerComponent {

  private readonly logoMap: Record<string, string> = {
    'MES': 'messico',
    'SAF': 'sudafrica',
    'COR': 'corea',
    'CEC': 'repubblica-ceca',
    'CAN': 'canada',
    'BOS': 'bosnia-erzegovina',
    'QAT': 'qatar',
    'SVI': 'svizzera',
    'BRA': 'brasile',
    'MAR': 'marocco',
    'HAI': 'haiti',
    'SCO': 'scozia',
    'USA': 'stati-uniti',
    'PAR': 'paraguay',
    'AUS': 'australia',
    'TUR': 'turchia',
    'GER': 'germania',
    'CUR': 'curacao',
    'CIV': 'costa-avorio',
    'ECU': 'ecuador',
    'OLA': 'olanda',
    'JAP': 'giappone',
    'SVE': 'svezia',
    'TUN': 'tunisia',
    'BEL': 'belgio',
    'EGI': 'egitto',
    'IRA': 'iran',
    'NZE': 'nuova-zelanda',
    'SPA': 'spagna',
    'CPV': 'capoverde',
    'SAU': 'arabia-saudita',
    'URU': 'uruguay',
    'FRA': 'francia',
    'SEN': 'senegal',
    'IRQ': 'iraq',
    'NOR': 'norvegia',
    'ARG': 'argentina',
    'ALG': 'algeria',
    'AUT': 'austria',
    'GIO': 'giordania',
    'POR': 'portogallo',
    'COD': 'congo',
    'UZB': 'uzbekistan',
    'COL': 'colombia',
    'ING': 'inghilterra',
    'CRO': 'croazia',
    'GHA': 'ghana',
    'PAN': 'panama',
  };

  readonly gironi: GironeItem[] = [
    { label: 'Gruppo A', teams: [{ sigla: 'MES', nome: 'Messico' }, { sigla: 'SAF', nome: 'Sudafrica' }, { sigla: 'COR', nome: 'Corea del Sud' }, { sigla: 'CEC', nome: 'Repubblica Ceca' }] },
    { label: 'Gruppo B', teams: [{ sigla: 'CAN', nome: 'Canada' }, { sigla: 'BOS', nome: 'Bosnia-Erzegovina' }, { sigla: 'QAT', nome: 'Qatar' }, { sigla: 'SVI', nome: 'Svizzera' }] },
    { label: 'Gruppo C', teams: [{ sigla: 'BRA', nome: 'Brasile' }, { sigla: 'MAR', nome: 'Marocco' }, { sigla: 'HAI', nome: 'Haiti' }, { sigla: 'SCO', nome: 'Scozia' }] },
    { label: 'Gruppo D', teams: [{ sigla: 'USA', nome: 'USA' }, { sigla: 'PAR', nome: 'Paraguay' }, { sigla: 'AUS', nome: 'Australia' }, { sigla: 'TUR', nome: 'Turchia' }] },
    { label: 'Gruppo E', teams: [{ sigla: 'GER', nome: 'Germania' }, { sigla: 'CUR', nome: 'Curaçao' }, { sigla: 'CIV', nome: "Costa d'Avorio" }, { sigla: 'ECU', nome: 'Ecuador' }] },
    { label: 'Gruppo F', teams: [{ sigla: 'OLA', nome: 'Olanda' }, { sigla: 'JAP', nome: 'Giappone' }, { sigla: 'SVE', nome: 'Svezia' }, { sigla: 'TUN', nome: 'Tunisia' }] },
    { label: 'Gruppo G', teams: [{ sigla: 'BEL', nome: 'Belgio' }, { sigla: 'EGI', nome: 'Egitto' }, { sigla: 'IRA', nome: 'Iran' }, { sigla: 'NZE', nome: 'Nuova Zelanda' }] },
    { label: 'Gruppo H', teams: [{ sigla: 'SPA', nome: 'Spagna' }, { sigla: 'CPV', nome: 'Capo Verde' }, { sigla: 'SAU', nome: 'Arabia Saudita' }, { sigla: 'URU', nome: 'Uruguay' }] },
    { label: 'Gruppo I', teams: [{ sigla: 'FRA', nome: 'Francia' }, { sigla: 'SEN', nome: 'Senegal' }, { sigla: 'IRQ', nome: 'Iraq' }, { sigla: 'NOR', nome: 'Norvegia' }] },
    { label: 'Gruppo J', teams: [{ sigla: 'ARG', nome: 'Argentina' }, { sigla: 'ALG', nome: 'Algeria' }, { sigla: 'AUT', nome: 'Austria' }, { sigla: 'GIO', nome: 'Giordania' }] },
    { label: 'Gruppo K', teams: [{ sigla: 'POR', nome: 'Portogallo' }, { sigla: 'COD', nome: 'Congo DR' }, { sigla: 'UZB', nome: 'Uzbekistan' }, { sigla: 'COL', nome: 'Colombia' }] },
    { label: 'Gruppo L', teams: [{ sigla: 'ING', nome: 'Inghilterra' }, { sigla: 'CRO', nome: 'Croazia' }, { sigla: 'GHA', nome: 'Ghana' }, { sigla: 'PAN', nome: 'Panama' }] },
  ];

  getLogo(sigla: string): string {
    const filename = this.logoMap[sigla];
    return filename ? `assets/logos/calcio/mondiali/${filename}.png` : '';
  }
}
