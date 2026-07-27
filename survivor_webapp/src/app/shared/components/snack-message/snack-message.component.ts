import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-snack-message',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="snack-message">
      <mat-icon class="snack-message-icon">error_outline</mat-icon>
      <span class="snack-message-text">{{ data }}</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: var(--font-family, 'Poppins', sans-serif);
      }

      .snack-message {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        white-space: pre-wrap;
        text-align: left;
        word-break: break-word;
      }

      .snack-message-icon {
        flex-shrink: 0;
        color: var(--error-light, #EF5350);
        font-size: 20px;
        width: 20px;
        height: 20px;
        margin-top: 1px;
      }

      .snack-message-text {
        font-size: 14px;
        line-height: 1.5;
      }
    `
  ]
})
export class SnackMessageComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}
