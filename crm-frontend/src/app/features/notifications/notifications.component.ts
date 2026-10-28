import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NotificationItem } from '../../core/models/crm.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Notification Center</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit alerts, deal milestone triggers, lead score alerts, and team mentions.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button (click)="crmData.markAllNotificationsRead(); toast.success('Marked as Read', 'All notifications cleared.')" class="btn-secondary text-xs">
            <app-icon name="check" [size]="14"></app-icon>
            Mark All Read
          </button>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        <button
          (click)="categoryFilter.set('ALL')"
          class="px-3 py-1.5 rounded-lg transition-colors"
          [class.bg-blue-600]="categoryFilter() === 'ALL'"
          [class.text-white]="categoryFilter() === 'ALL'"
          [class.bg-slate-100]="categoryFilter() !== 'ALL'"
          [class.dark:bg-slate-800]="categoryFilter() !== 'ALL'"
          [class.text-slate-600]="categoryFilter() !== 'ALL'"
        >
          All ({{ crmData.notifications().length }})
        </button>
        <button
          (click)="categoryFilter.set('DEAL')"
          class="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          [class.bg-blue-600]="categoryFilter() === 'DEAL'"
          [class.text-white]="categoryFilter() === 'DEAL'"
          [class.bg-slate-100]="categoryFilter() !== 'DEAL'"
          [class.dark:bg-slate-800]="categoryFilter() !== 'DEAL'"
          [class.text-slate-600]="categoryFilter() !== 'DEAL'"
        >
          <app-icon name="briefcase" [size]="13"></app-icon>
          Deals
        </button>
        <button
          (click)="categoryFilter.set('LEAD')"
          class="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          [class.bg-blue-600]="categoryFilter() === 'LEAD'"
          [class.text-white]="categoryFilter() === 'LEAD'"
          [class.bg-slate-100]="categoryFilter() !== 'LEAD'"
          [class.dark:bg-slate-800]="categoryFilter() !== 'LEAD'"
          [class.text-slate-600]="categoryFilter() !== 'LEAD'"
        >
          <app-icon name="target" [size]="13"></app-icon>
          Leads
        </button>
        <button
          (click)="categoryFilter.set('TASK')"
          class="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          [class.bg-blue-600]="categoryFilter() === 'TASK'"
          [class.text-white]="categoryFilter() === 'TASK'"
          [class.bg-slate-100]="categoryFilter() !== 'TASK'"
          [class.dark:bg-slate-800]="categoryFilter() !== 'TASK'"
          [class.text-slate-600]="categoryFilter() !== 'TASK'"
        >
          <app-icon name="check-square" [size]="13"></app-icon>
          Tasks
        </button>
        <button
          (click)="categoryFilter.set('MENTION')"
          class="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          [class.bg-blue-600]="categoryFilter() === 'MENTION'"
          [class.text-white]="categoryFilter() === 'MENTION'"
          [class.bg-slate-100]="categoryFilter() !== 'MENTION'"
          [class.dark:bg-slate-800]="categoryFilter() !== 'MENTION'"
          [class.text-slate-600]="categoryFilter() !== 'MENTION'"
        >
          <app-icon name="user" [size]="13"></app-icon>
          Mentions
        </button>
        <button
          (click)="categoryFilter.set('SYSTEM')"
          class="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          [class.bg-blue-600]="categoryFilter() === 'SYSTEM'"
          [class.text-white]="categoryFilter() === 'SYSTEM'"
          [class.bg-slate-100]="categoryFilter() !== 'SYSTEM'"
          [class.dark:bg-slate-800]="categoryFilter() !== 'SYSTEM'"
          [class.text-slate-600]="categoryFilter() !== 'SYSTEM'"
        >
          <app-icon name="settings" [size]="13"></app-icon>
          System
        </button>
      </div>

      <!-- Notifications Feed -->
      <div class="crm-card divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        @for (item of filteredNotifications(); track item.id) {
          <div
            [routerLink]="item.link"
            class="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
            [class.bg-blue-50/20]="!item.isRead"
            [class.dark:bg-blue-950/15]="!item.isRead"
          >
            <!-- Type Icon -->
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              [ngClass]="{
                'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400': item.type === 'DEAL',
                'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400': item.type === 'LEAD',
                'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400': item.type === 'TASK',
                'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400': item.type === 'MENTION',
                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300': item.type === 'SYSTEM'
              }"
            >
              <app-icon
                [name]="item.type === 'DEAL' ? 'briefcase' : item.type === 'LEAD' ? 'target' : item.type === 'TASK' ? 'check-square' : item.type === 'MENTION' ? 'user' : 'settings'"
                [size]="18"
              ></app-icon>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {{ item.title }}
                </h4>
                <span class="text-[11px] text-slate-400 font-mono">{{ item.time }}</span>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{{ item.message }}</p>
            </div>

            <!-- Read Dot Indicator -->
            @if (!item.isRead) {
              <span class="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2"></span>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class NotificationsComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  categoryFilter = signal<string>('ALL');

  readonly filteredNotifications = computed(() => {
    const cat = this.categoryFilter();
    if (cat === 'ALL') return this.crmData.notifications();
    return this.crmData.notifications().filter(n => n.type === cat);
  });
}
