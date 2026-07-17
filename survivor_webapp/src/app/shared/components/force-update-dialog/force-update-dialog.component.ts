import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface ForceUpdateDialogData {
  storeUrl: string | null;
  dismissible?: boolean;
}

@Component({
  selector: 'app-force-update-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './force-update-dialog.component.html',
  styleUrls: ['./force-update-dialog.component.scss']
})
export class ForceUpdateDialogComponent {
  readonly data = inject<ForceUpdateDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ForceUpdateDialogComponent>);

  openStore(): void {
    if (!this.data.storeUrl) return;
    window.open(this.data.storeUrl, '_system');
  }

  close(): void {
    this.dialogRef.close();
  }
}
