import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  readonly isDark = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('nexus_crm_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      this.isDark.set(initialDark);
      this.applyTheme(initialDark);
    }

    effect(() => {
      const dark = this.isDark();
      if (isPlatformBrowser(this.platformId)) {
        this.applyTheme(dark);
        localStorage.setItem('nexus_crm_theme', dark ? 'dark' : 'light');
      }
    });
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
  }

  setTheme(dark: boolean): void {
    this.isDark.set(dark);
  }

  private applyTheme(dark: boolean): void {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
