import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Activity, ActivityType } from '../../core/models/crm.models';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Activities & Engagements</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track customer meetings, discovery calls, outreach emails, and follow-up milestones.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- View Toggle: List / Calendar -->
          <div class="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xs text-xs font-semibold">
            <button
              (click)="currentView.set('list')"
              class="px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5"
              [class.bg-blue-600]="currentView() === 'list'"
              [class.text-white]="currentView() === 'list'"
              [class.text-slate-600]="currentView() !== 'list'"
              [class.dark:text-slate-400]="currentView() !== 'list'"
            >
              <app-icon name="dashboard" [size]="14"></app-icon>
              List View
            </button>
            <button
              (click)="currentView.set('calendar')"
              class="px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5"
              [class.bg-blue-600]="currentView() === 'calendar'"
              [class.text-white]="currentView() === 'calendar'"
              [class.text-slate-600]="currentView() !== 'calendar'"
              [class.dark:text-slate-400]="currentView() !== 'calendar'"
            >
              <app-icon name="calendar" [size]="14"></app-icon>
              Calendar View
            </button>
          </div>

          <button (click)="showNewActivityModal.set(true)" class="btn-primary text-xs">
            <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
            Log Activity
          </button>
        </div>
      </div>

      <!-- Quick Metrics by Activity Type -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div class="crm-card p-3 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center shrink-0">
            <app-icon name="calendar" [size]="16"></app-icon>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase">Meetings</span>
            <div class="text-base font-extrabold text-slate-900 dark:text-white">12 Scheduled</div>
          </div>
        </div>
        <div class="crm-card p-3 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 flex items-center justify-center shrink-0">
            <app-icon name="phone" [size]="16"></app-icon>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase">Calls</span>
            <div class="text-base font-extrabold text-slate-900 dark:text-white">28 Logged</div>
          </div>
        </div>
        <div class="crm-card p-3 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <app-icon name="mail" [size]="16"></app-icon>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase">Emails</span>
            <div class="text-base font-extrabold text-slate-900 dark:text-white">94 Sent</div>
          </div>
        </div>
        <div class="crm-card p-3 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 flex items-center justify-center shrink-0">
            <app-icon name="check-square" [size]="16"></app-icon>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase">Tasks</span>
            <div class="text-base font-extrabold text-slate-900 dark:text-white">16 Open</div>
          </div>
        </div>
        <div class="crm-card p-3 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400 flex items-center justify-center shrink-0">
            <app-icon name="file-text" [size]="16"></app-icon>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase">Notes</span>
            <div class="text-base font-extrabold text-slate-900 dark:text-white">32 Saved</div>
          </div>
        </div>
        <div class="crm-card p-3 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <app-icon name="target" [size]="16"></app-icon>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase">Follow-ups</span>
            <div class="text-base font-extrabold text-slate-900 dark:text-white">8 Pending</div>
          </div>
        </div>
      </div>

      <!-- LIST VIEW -->
      @if (currentView() === 'list') {
        <div class="crm-card p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Activity Timeline</h3>
            <span class="text-xs text-slate-400 font-medium">Sorted chronologically</span>
          </div>

          <div class="space-y-4">
            @for (act of crmData.activities(); track act.id) {
              <div class="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 transition-all">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  [ngClass]="{
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': act.type === 'Meeting',
                    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400': act.type === 'Call',
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400': act.type === 'Email',
                    'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400': act.type === 'Task' || act.type === 'Follow-up'
                  }"
                >
                  <app-icon
                    [name]="act.type === 'Meeting' ? 'calendar' : act.type === 'Call' ? 'phone' : act.type === 'Email' ? 'mail' : 'check-square'"
                    [size]="18"
                  ></app-icon>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ act.title }}</h4>
                    <span class="badge text-[11px]" [class.badge-green]="act.status === 'COMPLETED'" [class.badge-amber]="act.status === 'PENDING'">
                      <span class="badge-dot"></span>
                      {{ act.status }}
                    </span>
                  </div>

                  <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{{ act.description }}</p>

                  <div class="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <span class="font-medium text-slate-700 dark:text-slate-300">{{ act.customerName }}</span>
                    <span>•</span>
                    <span class="flex items-center gap-1">
                      <img [src]="act.assignedAvatar" class="w-4 h-4 rounded-full" />
                      {{ act.assignedTo }}
                    </span>
                    <span>•</span>
                    <span class="font-mono">{{ act.date }} at {{ act.time }}</span>
                    @if (act.duration) {
                      <span>•</span>
                      <span class="font-mono text-blue-600 dark:text-blue-400 font-semibold">{{ act.duration }}</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- CALENDAR VIEW (Month / Week / Day) -->
      @if (currentView() === 'calendar') {
        <div class="crm-card p-6 space-y-4">
          <!-- Calendar Sub-header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">November 2024</h3>
              <div class="flex items-center gap-1">
                <button class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><app-icon name="chevron-left" [size]="16"></app-icon></button>
                <button class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><app-icon name="chevron-right" [size]="16"></app-icon></button>
              </div>
            </div>

            <div class="flex items-center gap-2 text-xs">
              <button class="btn-secondary py-1 px-3">Today</button>
              <div class="inline-flex rounded-lg border p-0.5 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold">
                <button class="px-2.5 py-1 rounded bg-white dark:bg-slate-900 shadow-xs">Month</button>
                <button class="px-2.5 py-1 rounded text-slate-400">Week</button>
                <button class="px-2.5 py-1 rounded text-slate-400">Day</button>
              </div>
            </div>
          </div>

          <!-- Calendar Days Grid -->
          <div class="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border">
            <!-- Day Headers -->
            @for (day of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; track day) {
              <div class="bg-slate-50 dark:bg-slate-900 p-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                {{ day }}
              </div>
            }

            <!-- Day Cells -->
            @for (i of daysGrid; track i.day) {
              <div
                class="bg-white dark:bg-slate-900 min-h-[105px] p-2 flex flex-col justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                [class.bg-blue-50/20]="i.isToday"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold" [class.text-blue-600]="i.isToday" [class.text-slate-700]="!i.isToday" [class.dark:text-slate-300]="!i.isToday">
                    {{ i.day }}
                  </span>
                  @if (i.isToday) {
                    <span class="text-[9px] font-bold px-1 rounded bg-blue-600 text-white">TODAY</span>
                  }
                </div>

                <!-- Events inside cell -->
                <div class="space-y-1 my-1">
                  @for (ev of i.events; track ev.title) {
                    <div
                      class="text-[10px] p-1 rounded font-medium truncate"
                      [ngClass]="{
                        'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300': ev.type === 'Meeting',
                        'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300': ev.type === 'Call',
                        'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300': ev.type === 'Email'
                      }"
                    >
                      {{ ev.time }} • {{ ev.title }}
                    </div>
                  }
                </div>

                <div class="text-[10px] text-slate-400"></div>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- Log Activity Modal -->
    @if (showNewActivityModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="showNewActivityModal.set(false)">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in" (click)="$event.stopPropagation()">
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Log New Activity</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Activity Type</label>
                <select [(ngModel)]="newType" class="crm-input">
                  <option value="Meeting">Meeting</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Task">Task</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer / Account</label>
                <input type="text" [(ngModel)]="newCustomer" placeholder="CloudScale Dynamics" class="crm-input" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title / Summary</label>
              <input type="text" [(ngModel)]="newTitle" placeholder="e.g. Executive security architecture walkthrough" class="crm-input" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Description</label>
              <textarea [(ngModel)]="newDesc" rows="3" placeholder="Key outcomes, next steps, action items..." class="crm-input"></textarea>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button (click)="showNewActivityModal.set(false)" class="btn-secondary text-xs">Cancel</button>
            <button (click)="saveActivity()" class="btn-primary text-xs">Log Engagement</button>
          </div>
        </div>
      </div>
    }
  `
})
export class ActivitiesComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  currentView = signal<'list' | 'calendar'>('list');
  showNewActivityModal = signal(false);

  newType: ActivityType = 'Meeting';
  newCustomer = 'Apex Health Systems';
  newTitle = '';
  newDesc = '';

  readonly daysGrid = [
    { day: 27, isToday: false, events: [] },
    { day: 28, isToday: false, events: [] },
    { day: 29, isToday: false, events: [] },
    { day: 30, isToday: false, events: [{ time: '11:00 AM', title: 'BioGenix Demo', type: 'Meeting' }] },
    { day: 31, isToday: false, events: [] },
    { day: 1, isToday: false, events: [{ time: '02:00 PM', title: 'QBR CloudScale', type: 'Meeting' }] },
    { day: 2, isToday: false, events: [] },
    { day: 3, isToday: false, events: [] },
    { day: 4, isToday: false, events: [{ time: '10:00 AM', title: 'Salesforce Sync', type: 'Call' }] },
    { day: 5, isToday: false, events: [] },
    { day: 6, isToday: false, events: [{ time: '03:30 PM', title: 'Contract Legal', type: 'Call' }] },
    { day: 7, isToday: false, events: [] },
    { day: 8, isToday: false, events: [{ time: '09:00 AM', title: 'Vanguard Follow-up', type: 'Email' }] },
    { day: 9, isToday: false, events: [] },
    { day: 10, isToday: false, events: [] },
    { day: 11, isToday: true, events: [
      { time: '10:30 AM', title: 'Executive Review', type: 'Meeting' },
      { time: '02:00 PM', title: 'Apex Negotiation', type: 'Call' }
    ]},
    { day: 12, isToday: false, events: [{ time: '11:15 AM', title: 'Quantum Proposal', type: 'Email' }] },
    { day: 13, isToday: false, events: [] },
    { day: 14, isToday: false, events: [{ time: '04:00 PM', title: 'Security Pilot', type: 'Meeting' }] },
    { day: 15, isToday: false, events: [] },
    { day: 16, isToday: false, events: [] }
  ];

  saveActivity(): void {
    if (!this.newTitle) {
      this.toast.error('Validation Error', 'Activity summary is required');
      return;
    }
    this.crmData.addActivity({
      type: this.newType,
      title: this.newTitle,
      description: this.newDesc || 'Engagement recorded in Nexus CRM.',
      customerName: this.newCustomer,
      assignedTo: 'Alex Mercer',
      assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128',
      time: 'Just now',
      status: 'COMPLETED',
      duration: '30 mins'
    });
    this.toast.success('Activity Logged', `${this.newTitle} added to customer timeline.`);
    this.showNewActivityModal.set(false);
    this.newTitle = '';
    this.newDesc = '';
  }
}
