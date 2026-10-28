import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CrmDataService } from '../../../core/services/crm-data.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="close()">
        <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
          <!-- Search Header -->
          <div class="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <app-icon name="search" [size]="20" class="text-slate-400"></app-icon>
            <input
              type="text"
              [(ngModel)]="query"
              placeholder="Search customers, deals, leads, tasks, or navigate (e.g. 'pipeline')..."
              class="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-medium"
              autofocus
            />
            <span class="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">ESC</span>
          </div>

          <!-- Quick Navigation / Search Results -->
          <div class="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
            <!-- Navigation Pages -->
            <div class="py-2">
              <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">Quick Navigation</div>
              @for (nav of filteredNav(); track nav.path) {
                <button
                  (click)="navigate(nav.path)"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                >
                  <div class="flex items-center gap-2.5">
                    <app-icon [name]="nav.icon" [size]="16" class="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"></app-icon>
                    <span class="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">{{ nav.title }}</span>
                  </div>
                  <span class="text-xs text-slate-400">{{ nav.category }}</span>
                </button>
              }
            </div>

            <!-- Customers Results -->
            @if (filteredCustomers().length > 0) {
              <div class="py-2">
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">Customers</div>
                @for (cust of filteredCustomers(); track cust.id) {
                  <button
                    (click)="navigate('/customers')"
                    class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div class="flex items-center gap-2.5">
                      <div class="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">
                        {{ cust.code.substring(5) }}
                      </div>
                      <div>
                        <span class="font-medium text-slate-900 dark:text-white">{{ cust.name }}</span>
                        <span class="text-xs text-slate-400 ml-2">({{ cust.industry }})</span>
                      </div>
                    </div>
                    <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{{ cust.status }}</span>
                  </button>
                }
              </div>
            }

            <!-- Deals Results -->
            @if (filteredDeals().length > 0) {
              <div class="py-2">
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">Deals & Opportunities</div>
                @for (deal of filteredDeals(); track deal.id) {
                  <button
                    (click)="navigate('/deals')"
                    class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div class="flex items-center gap-2.5">
                      <app-icon name="briefcase" [size]="16" class="text-amber-500"></app-icon>
                      <span class="font-medium text-slate-900 dark:text-white">{{ deal.name }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-xs text-slate-400">{{ deal.stage }}</span>
                      <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">\${{ deal.value | number }}</span>
                    </div>
                  </button>
                }
              </div>
            }

            <!-- Leads Results -->
            @if (filteredLeads().length > 0) {
              <div class="py-2">
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">Leads</div>
                @for (lead of filteredLeads(); track lead.id) {
                  <button
                    (click)="navigate('/leads')"
                    class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div class="flex items-center gap-2.5">
                      <app-icon name="target" [size]="16" class="text-purple-500"></app-icon>
                      <span class="font-medium text-slate-900 dark:text-white">{{ lead.name }}</span>
                      <span class="text-xs text-slate-400">at {{ lead.company }}</span>
                    </div>
                    <span class="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">Score {{ lead.score }}</span>
                  </button>
                }
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div class="flex items-center gap-4">
              <span>Navigation: <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">↑</kbd> <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">↓</kbd></span>
              <span>Select: <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">↵</kbd></span>
            </div>
            <span>Nexus Omnisearch</span>
          </div>
        </div>
      </div>
    }
  `
})
export class GlobalSearchComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  private router = inject(Router);
  private crmData = inject(CrmDataService);

  query = signal<string>('');

  readonly navigationRoutes = [
    { title: 'Executive Dashboard', path: '/dashboard', icon: 'dashboard', category: 'Overview' },
    { title: 'Customers Directory', path: '/customers', icon: 'users', category: 'Sales' },
    { title: 'Contacts & Directory', path: '/contacts', icon: 'contacts', category: 'Sales' },
    { title: 'Sales Leads Pipeline', path: '/leads', icon: 'target', category: 'Sales' },
    { title: 'Deals & Opportunities', path: '/deals', icon: 'briefcase', category: 'Sales' },
    { title: 'Interactive Kanban Pipeline', path: '/pipeline', icon: 'pipeline', category: 'Sales' },
    { title: 'Activities & Meetings', path: '/activities', icon: 'calendar', category: 'Work' },
    { title: 'Tasks & Follow-ups', path: '/tasks', icon: 'check-square', category: 'Work' },
    { title: 'Notes & Workspace', path: '/notes', icon: 'file-text', category: 'Work' },
    { title: 'Email Communications', path: '/email', icon: 'mail', category: 'Work' },
    { title: 'Reports & Analytics', path: '/reports', icon: 'bar-chart', category: 'Insights' },
    { title: 'User Management', path: '/users', icon: 'user-check', category: 'Admin' },
    { title: 'Roles & Permission Matrix', path: '/roles', icon: 'shield-check', category: 'Admin' },
    { title: 'Audit Trail & Logs', path: '/audit', icon: 'history', category: 'Admin' },
    { title: 'System Settings', path: '/settings', icon: 'settings', category: 'Admin' }
  ];

  readonly filteredNav = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.navigationRoutes.slice(0, 6);
    return this.navigationRoutes.filter(r => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  });

  readonly filteredCustomers = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return [];
    return this.crmData.customers().filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)).slice(0, 4);
  });

  readonly filteredDeals = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return [];
    return this.crmData.deals().filter(d => d.name.toLowerCase().includes(q) || d.customerName.toLowerCase().includes(q)).slice(0, 4);
  });

  readonly filteredLeads = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return [];
    return this.crmData.leads().filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)).slice(0, 4);
  });

  close(): void {
    this.closeEvent.emit();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.close();
  }
}
