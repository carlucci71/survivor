import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-message',
  standalone: true,
  template: `
    <div class="snack-message" [innerText]="data"></div>
  `,
  styles: [
    `
      .snack-message {
        white-space: pre-wrap;
        text-align: left;
        word-break: break-word;
      }
    `
  ]
})
export class SnackMessageComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}
