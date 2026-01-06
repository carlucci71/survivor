import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Lega } from '../../../core/models/interfaces.model';
import { UtilService } from '../../../core/services/util.service';

@Component({
  selector: 'app-lega-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './lega-card.component.html',
  styleUrls: ['./lega-card.component.scss'],
})
export class LegaCardComponent {
  @Input() lega!: Lega | null;
  @Output() action = new EventEmitter<Lega>();
  constructor(
    private utilService: UtilService
  ) {}

  onAction(): void {
    if (this.lega) {
      this.action.emit(this.lega);
    }
  }
  getGiocaIcon(idSport: string): string {
    return this.utilService.getGiocaIcon(idSport);
  }

}
