import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  private counter = 0;
  private minDelay = 150; // ms to avoid flicker
  private showTimeout: any = null;

  get loading$(): Observable<boolean> {
    return this._loading.asObservable();
  }

  show(immediate: boolean = false): void {
    this.counter++;
    console.debug('[LoadingService] show() called, counter ->', this.counter, 'immediate=', immediate);
    if (this.counter === 1) {
      if (immediate) {
        this._setLoading(true);
      } else {
        // wait a minimum delay before showing to avoid flicker
        this.clearTimeout();
        this.showTimeout = setTimeout(() => this._setLoading(true), this.minDelay);
      }
    }
  }

  hide(): void {
    if (this.counter > 0) {
      this.counter--;
      console.debug('[LoadingService] hide() called, counter ->', this.counter);
    }
    if (this.counter === 0) {
      this.clearTimeout();
      this._setLoading(false);
    }
  }

  /**
   * Force reset of the loading state and internal counter.
   * Use cautiously for unrecoverable error paths where loading might be left active.
   */
  reset(): void {
    console.debug('[LoadingService] reset() called, previous counter ->', this.counter);
    this.counter = 0;
    this.clearTimeout();
    this._setLoading(false);
  }

  private _setLoading(value: boolean) {
    this._loading.next(value);
  }

  private clearTimeout() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }
}

