import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { SospensioniService } from '../../core/services/sospensioni.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './sospensioni-dialog.component.html',
})
export class SospensioniDialogComponent {
  giornate: number[] = [];
  newGiornata: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SospensioniDialogComponent>,
    private sospensioniService: SospensioniService
  ) {
    // data should contain idLega
    if (data && data.giornate) {
      this.giornate = [...data.giornate];
    }
  }

  close() {
    this.dialogRef.close();
  }

  add() {
    if (this.newGiornata == null) return;
    const payload = { verso: 'ADD', idLega: this.data.idLega, giornata: this.newGiornata };
    this.sospensioniService.updateSospensioni(payload).subscribe({
      next: () => {
        if (!this.giornate.includes(this.newGiornata!)) this.giornate.push(this.newGiornata!);
        this.newGiornata = null;
      },
      error: (err) => {
        console.error('Errore add sospensione', err);
      },
    });
  }

  remove(g: number) {
    const payload = { verso: 'REMOVE', idLega: this.data.idLega, giornata: g };
    this.sospensioniService.updateSospensioni(payload).subscribe({
      next: () => {
        this.giornate = this.giornate.filter((x) => x !== g);
      },
      error: (err) => {
        console.error('Errore remove sospensione', err);
      },
    });
  }
}
