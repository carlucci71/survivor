import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'app-theme';
  private subject = new BehaviorSubject<string>('light');

  theme$ = this.subject.asObservable();

  constructor() {
    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      this.applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    }

    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
      });
  }

  toggleTheme() {
    const newT = this.subject.value === 'light' ? 'dark' : 'light';
    this.applyTheme(newT);
  }

  private applyTheme(theme: string) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    this.subject.next(theme);
    localStorage.setItem(this.storageKey, theme);
  }
}