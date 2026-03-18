import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Notification } from '../../../core/models/interfaces.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Sottoscrivi alle notifiche
    this.subscriptions.push(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications.slice(0, 5); // Mostra solo le prime 5
      })
    );

    // Sottoscrivi al conteggio non lette
    this.subscriptions.push(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );

    // Avvia polling se utente autenticato
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.notificationService.startPolling(user.id);
    }
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.notificationService.stopPolling();
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }

    if (notification.type === 'JOIN_REQUEST_RICEVUTA' && notification.legaId) {
      this.router.navigate(['/admin'], { fragment: 'richieste' });
      return;
    }
    if ((notification.type === 'JOIN_REQUEST_APPROVATA' || notification.type === 'JOIN_REQUEST_RIFIUTATA') && notification.legaId) {
      this.router.navigate(['/lega', notification.legaId]);
      return;
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'JOIN_REQUEST_RICEVUTA':
        return 'how_to_reg';
      case 'JOIN_REQUEST_APPROVATA':
        return 'check_circle';
      case 'JOIN_REQUEST_RIFIUTATA':
        return 'cancel';
      case 'MATCH_STARTING':
        return 'sports_soccer';
      case 'MATCH_REMINDER':
        return 'alarm';
      case 'LEAGUE_UPDATE':
        return 'update';
      case 'INFO':
        return 'info';
      default:
        return 'notifications';
    }
  }

  getTimeAgo(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return this.translate.instant('NOTIFICATIONS.TIME_NOW');
    if (diffMins < 60) return this.translate.instant('NOTIFICATIONS.TIME_MINUTES', { value: diffMins });

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return this.translate.instant('NOTIFICATIONS.TIME_HOURS', { value: diffHours });

    const diffDays = Math.floor(diffHours / 24);
    return this.translate.instant('NOTIFICATIONS.TIME_DAYS', { value: diffDays });
  }
}

