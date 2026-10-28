import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/auth/auth.service';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { RoleType } from '../../core/models/crm.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <header class="h-16 bg-white dark:bg-[#111c2e] border-b border-slate-200 dark:border-[#263449] px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <!-- Left: Mobile Menu Toggle & Dynamic Breadcrumb -->
      <div class="flex items-center gap-4">
        <button
          (click)="toggleMobileSidebar.emit()"
          class="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <app-icon name="dashboard" [size]="20"></app-icon>
        </button>

        <nav class="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span class="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer" routerLink="/dashboard">Nexus</span>
          <app-icon name="chevron-right" [size]="12"></app-icon>
          <span class="text-slate-900 dark:text-white font-semibold capitalize">{{ currentSection() }}</span>
          @if (currentPage()) {
            <app-icon name="chevron-right" [size]="12"></app-icon>
            <span class="text-blue-600 dark:text-blue-400 font-semibold capitalize">{{ currentPage() }}</span>
          }
        </nav>
      </div>

      <!-- Center / Search Input -->
      <div class="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          (click)="openSearch.emit()"
          class="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-400 transition-colors"
        >
          <div class="flex items-center gap-2">
            <app-icon name="search" [size]="15" class="text-slate-400"></app-icon>
            <span>Search records, leads, pipeline...</span>
          </div>
          <div class="flex items-center gap-1 font-mono text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-xs">
            <span>⌘K</span>
          </div>
        </button>
      </div>

      <!-- Right: Action Buttons & User Menu -->
      <div class="flex items-center gap-3">
        <!-- Live Backend API Status Badge -->
        <div
          class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all"
          [class.bg-emerald-50]="crmData.isBackendConnected()"
          [class.dark:bg-emerald-950/40]="crmData.isBackendConnected()"
          [class.border-emerald-200]="crmData.isBackendConnected()"
          [class.dark:border-emerald-800/50]="crmData.isBackendConnected()"
          [class.text-emerald-700]="crmData.isBackendConnected()"
          [class.dark:text-emerald-300]="crmData.isBackendConnected()"
          [class.bg-slate-100]="!crmData.isBackendConnected()"
          [class.dark:bg-slate-800]="!crmData.isBackendConnected()"
          [class.border-slate-200]="!crmData.isBackendConnected()"
          [class.dark:border-slate-700]="!crmData.isBackendConnected()"
          [class.text-slate-500]="!crmData.isBackendConnected()"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            [class.bg-emerald-500]="crmData.isBackendConnected()"
            [class.animate-pulse]="crmData.isBackendConnected()"
            [class.bg-slate-400]="!crmData.isBackendConnected()"
          ></span>
          <span>{{ crmData.isBackendConnected() ? 'Backend API: Connected' : 'API Syncing' }}</span>
        </div>

        <!-- Quick Create Button -->
        <button
          (click)="openQuickCreate.emit()"
          class="btn-primary text-xs py-1.5 px-3 rounded-lg shadow-sm font-semibold flex items-center gap-1.5"
        >
          <app-icon name="plus" [size]="15" strokeWidth="2.5"></app-icon>
          <span class="hidden sm:inline">Create</span>
        </button>

        <div class="h-5 w-px bg-slate-200 dark:bg-slate-700/80 mx-1"></div>

        <!-- Notifications Bell -->
        <div class="relative">
          <button
            (click)="showNotifications.set(!showNotifications()); showProfile.set(false)"
            class="relative text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <app-icon name="bell" [size]="18"></app-icon>
            @if (crmData.unreadNotificationsCount() > 0) {
              <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
            }
          </button>

          <!-- Notification Dropdown Panel -->
          @if (showNotifications()) {
            <div
              class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-scale-in"
              (click)="$event.stopPropagation()"
            >
              <div class="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    {{ crmData.unreadNotificationsCount() }} new
                  </span>
                </div>
                <button
                  (click)="crmData.markAllNotificationsRead()"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                @for (item of crmData.notifications(); track item.id) {
                  <div
                    class="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-3 cursor-pointer"
                    [class.bg-blue-50/30]="!item.isRead"
                    [class.dark:bg-blue-950/20]="!item.isRead"
                    [routerLink]="item.link"
                    (click)="showNotifications.set(false)"
                  >
                    <div
                      class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      [ngClass]="{
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400': item.type === 'DEAL',
                        'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400': item.type === 'LEAD',
                        'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400': item.type === 'TASK',
                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400': item.type === 'MENTION',
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300': item.type === 'SYSTEM'
                      }"
                    >
                      <app-icon
                        [name]="item.type === 'DEAL' ? 'briefcase' : item.type === 'LEAD' ? 'target' : item.type === 'TASK' ? 'check-square' : item.type === 'MENTION' ? 'user' : 'settings'"
                        [size]="14"
                      ></app-icon>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">{{ item.title }}</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{{ item.message }}</p>
                      <span class="text-[10px] text-slate-400 mt-1 block">{{ item.time }}</span>
                    </div>
                  </div>
                }
              </div>

              <div class="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
                <a routerLink="/notifications" (click)="showNotifications.set(false)" class="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  View Notification Center →
                </a>
              </div>
            </div>
          }
        </div>

        <!-- Theme Toggle (Sun / Moon) -->
        <button
          (click)="themeService.toggleTheme()"
          class="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <app-icon [name]="themeService.isDark() ? 'sun' : 'moon'" [size]="18"></app-icon>
        </button>

        <!-- Help / Support icon -->
        <button
          (click)="toast.info('Nexus Help Center', 'Documentation and 24/7 Enterprise Support are online.')"
          class="hidden sm:inline-flex text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Help & Documentation"
        >
          <app-icon name="help" [size]="18"></app-icon>
        </button>

        <div class="h-5 w-px bg-slate-200 dark:bg-slate-700/80 mx-1"></div>

        <!-- User Profile Dropdown -->
        <div class="relative">
          <button
            (click)="showProfile.set(!showProfile()); showNotifications.set(false)"
            class="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              [src]="authService.currentUser().avatar"
              [alt]="authService.currentUser().name"
              class="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div class="hidden xl:flex flex-col text-left">
              <span class="text-xs font-semibold text-slate-800 dark:text-white leading-tight">{{ authService.currentUser().name }}</span>
              <span class="text-[10px] text-slate-400">{{ authService.currentUser().role }}</span>
            </div>
            <app-icon name="chevron-down" [size]="14" class="text-slate-400"></app-icon>
          </button>

          <!-- User Menu Dropdown -->
          @if (showProfile()) {
            <div
              class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 p-2 animate-scale-in"
              (click)="$event.stopPropagation()"
            >
              <div class="p-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p class="text-xs font-bold text-slate-900 dark:text-white">{{ authService.currentUser().name }}</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">{{ authService.currentUser().email }}</p>
                <div class="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {{ authService.currentUser().role }}
                </div>
              </div>

              <!-- Switch Role Demo helper -->
              <div class="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg my-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Switch Role (Preview)</span>
                <div class="grid grid-cols-2 gap-1 text-[11px]">
                  <button
                    (click)="setRole('SUPER_ADMIN')"
                    class="p-1 rounded text-left hover:bg-white dark:hover:bg-slate-700 font-medium"
                    [class.text-blue-600]="authService.currentRole() === 'SUPER_ADMIN'"
                  >
                    Super Admin
                  </button>
                  <button
                    (click)="setRole('SALES_MANAGER')"
                    class="p-1 rounded text-left hover:bg-white dark:hover:bg-slate-700 font-medium"
                    [class.text-blue-600]="authService.currentRole() === 'SALES_MANAGER'"
                  >
                    Sales Manager
                  </button>
                  <button
                    (click)="setRole('SALES_REP')"
                    class="p-1 rounded text-left hover:bg-white dark:hover:bg-slate-700 font-medium"
                    [class.text-blue-600]="authService.currentRole() === 'SALES_REP'"
                  >
                    Sales Rep
                  </button>
                  <button
                    (click)="setRole('SUPPORT_AGENT')"
                    class="p-1 rounded text-left hover:bg-white dark:hover:bg-slate-700 font-medium"
                    [class.text-blue-600]="authService.currentRole() === 'SUPPORT_AGENT'"
                  >
                    Support Agent
                  </button>
                </div>
              </div>

              <div class="space-y-0.5 pt-1">
                <a
                  routerLink="/settings"
                  (click)="showProfile.set(false)"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <app-icon name="settings" [size]="14"></app-icon>
                  Account Settings
                </a>
                <a
                  routerLink="/audit"
                  (click)="showProfile.set(false)"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <app-icon name="history" [size]="14"></app-icon>
                  Audit Trail
                </a>
                <button
                  (click)="logout()"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <app-icon name="x" [size]="14"></app-icon>
                  Sign Out
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() toggleMobileSidebar = new EventEmitter<void>();
  @Output() openSearch = new EventEmitter<void>();
  @Output() openQuickCreate = new EventEmitter<void>();

  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);
  private router = inject(Router);

  showNotifications = signal(false);
  showProfile = signal(false);

  currentSection = signal('Overview');
  currentPage = signal('Dashboard');

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  private updateBreadcrumbs(): void {
    const url = this.router.url.split('?')[0];
    const parts = url.split('/').filter(Boolean);
    if (parts.length === 0 || parts[0] === 'dashboard') {
      this.currentSection.set('Overview');
      this.currentPage.set('Dashboard');
    } else {
      this.currentSection.set(parts[0]);
      this.currentPage.set(parts[1] || '');
    }
  }

  setRole(role: RoleType): void {
    this.authService.switchRole(role);
    this.toast.info('Role Switched', `Active view updated to ${role}`);
    this.showProfile.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.toast.info('Signed Out', 'You have been signed out of Nexus CRM.');
    this.showProfile.set(false);
    this.router.navigate(['/auth/login']);
  }
}
