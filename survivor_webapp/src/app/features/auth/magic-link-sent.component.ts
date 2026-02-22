import { Component } from '@angular/core';

@Component({
  selector: 'app-magic-link-sent',
  standalone: true,
  imports: [],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-container">
          <h1 class="app-title">SURVIVOR</h1>
          <p class="app-subtitle">WIN OR GO HOME</p>
        </div>
        <div class="card-header">
          <h2>Link inviato</h2>
          <p class="subtitle">Controlla la tua mail per completare l'accesso.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class MagicLinkSentComponent {}
