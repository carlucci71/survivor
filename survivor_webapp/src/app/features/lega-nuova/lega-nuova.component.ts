import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-lega-nuova',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './lega-nuova.component.html',
  styleUrl: './lega-nuova.component.scss'
})
export class LegaNuovaComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
