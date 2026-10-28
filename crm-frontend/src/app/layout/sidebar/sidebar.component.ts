import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthService } from '../../core/auth/auth.service';
import { CrmDataService } from '../../core/services/crm-data.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number | string;
  badgeColor?: string;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <aside
      class="h-screen bg-[#111827] dark:bg-[#0f172a] text-slate-300 flex flex-col border-r border-[#1f2937] dark:border-[#1e293b] select-none transition-all duration-300 ease-in-out z-30 shrink-0"
      [class.w-[250px]]="!isCollapsed"
      [class.w-[72px]]="isCollapsed"
    >
      <!-- Logo Section -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-[#1f2937] dark:border-[#1e293b]">
        <div class="flex items-center gap-3 overflow-hidden cursor-pointer" routerLink="/dashboard">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <app-icon name="sparkles" [size]="20" strokeWidth="2.5"></app-icon>
          </div>
          @if (!isCollapsed) {
            <div class="flex flex-col truncate">
              <span class="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Nexus <span class="text-blue-400 font-semibold text-xs tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800/60">CRM</span>
              </span>
              <span class="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Enterprise SaaS</span>
            </div>
          }
        </div>

        <button
          (click)="toggleCollapse.emit()"
          class="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors shrink-0"
          [title]="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        >
          <app-icon [name]="isCollapsed ? 'chevron-right' : 'chevron-left'" [size]="18"></app-icon>
        </button>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        @for (section of navSections; track section.title) {
          <div>
            @if (!isCollapsed) {
              <div class="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {{ section.title }}
              </div>
            } @else {
              <div class="h-px bg-slate-800 my-2 mx-2"></div>
            }

            <div class="space-y-0.5">
              @for (item of section.items; track item.route) {
                <a
                  [routerLink]="item.route"
                  routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-600/30 active-nav"
                  [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                  class="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all duration-150 relative"
                  [title]="isCollapsed ? item.label : ''"
                >
                  <app-icon
                    [name]="item.icon"
                    [size]="18"
                    class="shrink-0 transition-transform group-hover:scale-105"
                  ></app-icon>

                  @if (!isCollapsed) {
                    <span class="truncate flex-1">{{ item.label }}</span>

                    @if (item.badge) {
                      <span
                        class="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                        [ngClass]="item.badgeColor || 'bg-slate-800 text-slate-300'"
                      >
                        {{ item.badge }}
                      </span>
                    }
                  }

                  <!-- Floating Tooltip when collapsed -->
                  @if (isCollapsed) {
                    <div class="fixed left-[76px] hidden group-hover:flex items-center px-2.5 py-1 rounded bg-slate-900 text-white text-xs whitespace-nowrap shadow-xl border border-slate-700 z-50 pointer-events-none">
                      {{ item.label }}
                    </div>
                  }
                </a>
              }
            </div>
          </div>
        }
      </div>

      <!-- User Profile / Current Session Footer -->
      <div class="p-3 border-t border-[#1f2937] dark:border-[#1e293b] bg-slate-950/40">
        <div class="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer" routerLink="/settings">
          <img
            [src]="authService.currentUser().avatar"
            [alt]="authService.currentUser().name"
            class="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
          />
          @if (!isCollapsed) {
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-xs font-semibold text-white truncate">{{ authService.currentUser().name }}</span>
              <span class="text-[11px] text-slate-400 truncate">{{ authService.currentUser().designation }}</span>
            </div>
            <div class="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0"></div>
          }
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .active-nav app-icon {
      color: #ffffff !important;
    }
  `]
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  readonly authService = inject(AuthService);
  readonly crmData = inject(CrmDataService);

  readonly navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' }
      ]
    },
    {
      title: 'SALES',
      items: [
        { label: 'Customers', route: '/customers', icon: 'users', badge: 12480 },
        { label: 'Contacts', route: '/contacts', icon: 'contacts' },
        { label: 'Leads', route: '/leads', icon: 'target', badge: 'New', badgeColor: 'bg-blue-900/60 text-blue-300' },
        { label: 'Deals', route: '/deals', icon: 'briefcase' },
        { label: 'Sales Pipeline', route: '/pipeline', icon: 'pipeline' }
      ]
    },
    {
      title: 'WORK MANAGEMENT',
      items: [
        { label: 'Activities', route: '/activities', icon: 'calendar' },
        { label: 'Tasks', route: '/tasks', icon: 'check-square', badge: 5, badgeColor: 'bg-amber-900/60 text-amber-300' },
        { label: 'Notes', route: '/notes', icon: 'file-text' },
        { label: 'Email', route: '/email', icon: 'mail', badge: 1, badgeColor: 'bg-rose-900/60 text-rose-300' }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { label: 'Reports', route: '/reports', icon: 'pie-chart' },
        { label: 'Sales Analytics', route: '/reports', icon: 'bar-chart' }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Users', route: '/users', icon: 'user' },
        { label: 'Roles & Permissions', route: '/roles', icon: 'shield-check' },
        { label: 'Audit Logs', route: '/audit', icon: 'history' },
        { label: 'Settings', route: '/settings', icon: 'settings' }
      ]
    }
  ];
}
