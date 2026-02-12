import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, Subscription, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/push`;

  // Subject per gestire le notifiche
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  // Subject per conteggio non lette
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  // Polling subscription
  private pollingSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Recupera le notifiche per l'utente autenticato
   * @param userId - ID dell'utente
   * @param activeOnly - true = solo notifiche attive (non lette e non scadute)
   */
  getNotifications(userId: number, activeOnly: boolean = true): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}`, {
      params: {
        userId: userId.toString(),
        active: activeOnly.toString()
      }
    }).pipe(
      tap(notifications => {
        this.notificationsSubject.next(notifications);
        const unreadCount = notifications.filter(n => !n.read).length;
        this.unreadCountSubject.next(unreadCount);
      }),
      catchError(error => {
        console.error('Errore nel caricamento delle notifiche:', error);
        // Restituisce array vuoto per non bloccare il polling
        return of([]);
      })
    );
  }

  /**
   * Marca una notifica come letta
   * @param notificationId - ID della notifica
   */
  markAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(() => {
        // Aggiorna lo stato locale
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        this.notificationsSubject.next(updatedNotifications);

        // Aggiorna conteggio non lette
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        this.unreadCountSubject.next(unreadCount);
      }),
      catchError(error => {
        console.error('Errore nella marcatura come letta:', error);
        throw error;
      })
    );
  }

  /**
   * Avvia il polling automatico delle notifiche ogni 90 secondi
   * @param userId - ID dell'utente autenticato
   */
  startPolling(userId: number): void {
    // Ferma il polling precedente se esiste
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }

    // Carica subito le notifiche
    this.getNotifications(userId, true).subscribe();

    // Poi ripeti ogni 90 secondi (ottimizzato per performance)
    this.pollingSubscription = interval(90000) // 90 secondi
      .pipe(
        switchMap(() => this.getNotifications(userId, true))
      )
      .subscribe();
  }

  /**
   * Ferma il polling
   */
  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  /**
   * Ottiene il numero corrente di notifiche non lette
   */
  getUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  /**
   * Ottiene l'elenco corrente di notifiche
   */
  getCurrentNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }
}

