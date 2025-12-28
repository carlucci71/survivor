import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-lega-join',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './lega-join.component.html',
  styleUrl: './lega-join.component.scss'
})
export class LegaJoinComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
