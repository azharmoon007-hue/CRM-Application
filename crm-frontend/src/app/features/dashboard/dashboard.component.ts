import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrmDataService } from '../../core/services/crm-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <!-- Dashboard Top Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-dashboard-title text-slate-900 dark:text-white flex items-center gap-2.5">
            Good morning, {{ authService.currentUser().name.split(' ')[0] }}
            <span class="inline-block animate-pulse">✨</span>
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your business today across global sales operations.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Date Range Selector -->
          <div class="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xs text-xs font-medium">
            <button
              (click)="selectedPeriod.set('30d')"
              class="px-3 py-1.5 rounded-md transition-all"
              [class.bg-blue-600]="selectedPeriod() === '30d'"
              [class.text-white]="selectedPeriod() === '30d'"
              [class.text-slate-600]="selectedPeriod() !== '30d'"
              [class.dark:text-slate-400]="selectedPeriod() !== '30d'"
            >
              Last 30 Days
            </button>
            <button
              (click)="selectedPeriod.set('quarter')"
              class="px-3 py-1.5 rounded-md transition-all"
              [class.bg-blue-600]="selectedPeriod() === 'quarter'"
              [class.text-white]="selectedPeriod() === 'quarter'"
              [class.text-slate-600]="selectedPeriod() !== 'quarter'"
              [class.dark:text-slate-400]="selectedPeriod() !== 'quarter'"
            >
              This Quarter
            </button>
            <button
              (click)="selectedPeriod.set('year')"
              class="px-3 py-1.5 rounded-md transition-all"
              [class.bg-blue-600]="selectedPeriod() === 'year'"
              [class.text-white]="selectedPeriod() === 'year'"
              [class.text-slate-600]="selectedPeriod() !== 'year'"
              [class.dark:text-slate-400]="selectedPeriod() !== 'year'"
            >
              FY 2024
            </button>
          </div>

          <!-- Export Button -->
          <button
            (click)="exportDashboard()"
            class="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            title="Export Dashboard Report"
          >
            <app-icon name="download" [size]="14"></app-icon>
            <span class="hidden sm:inline">Export</span>
          </button>

          <!-- Refresh Button -->
          <button
            (click)="refreshData()"
            class="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            [class.animate-spin]="isRefreshing()"
            title="Refresh KPIs"
          >
            <app-icon name="refresh" [size]="14"></app-icon>
          </button>
        </div>
      </div>

      <!-- KPI Metrics Grid (6 Premium Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        @for (kpi of crmData.kpis(); track kpi.id) {
          <div class="crm-card crm-card-interactive p-4 flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{{ kpi.title }}</span>
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center"
                [ngClass]="{
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': kpi.accent === 'blue',
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400': kpi.accent === 'purple',
                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400': kpi.accent === 'amber',
                  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400': kpi.accent === 'emerald',
                  'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400': kpi.accent === 'info',
                  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400': kpi.accent === 'indigo'
                }"
              >
                <app-icon
                  [name]="kpi.accent === 'blue' ? 'users' : kpi.accent === 'purple' ? 'target' : kpi.accent === 'amber' ? 'briefcase' : kpi.accent === 'emerald' ? 'sparkles' : kpi.accent === 'info' ? 'pipeline' : 'pie-chart'"
                  [size]="14"
                ></app-icon>
              </div>
            </div>

            <div class="mt-3">
              <div class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ kpi.value }}</div>
              <div class="flex items-center gap-1.5 mt-1.5">
                <span class="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  <app-icon name="arrow-up-right" [size]="11" strokeWidth="2.5"></app-icon>
                  {{ kpi.change }}
                </span>
                <span class="text-[10px] text-slate-400 truncate">{{ kpi.subtext }}</span>
              </div>
            </div>

            <!-- Mini Sparkline SVG -->
            <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <svg class="w-full h-7 overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path
                  [attr.d]="buildSparkline(kpi.sparkline)"
                  fill="none"
                  [attr.stroke]="kpi.accent === 'emerald' ? '#10B981' : kpi.accent === 'blue' ? '#2563EB' : kpi.accent === 'purple' ? '#8B5CF6' : '#F59E0B'"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        }
      </div>

      <!-- Charts Row 1: Revenue Overview & Lead Sources -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- A. Revenue Overview (Area Chart) -->
        <div class="lg:col-span-2 crm-card p-6 flex flex-col justify-between">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold">+18.7% YoY</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monthly recurring revenue compared with prior fiscal performance</p>
            </div>

            <div class="flex items-center gap-4 text-xs">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span class="font-medium text-slate-600 dark:text-slate-300">2024 Actuals</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span class="font-medium text-slate-400">2023 Previous</span>
              </div>
            </div>
          </div>

          <!-- Custom SVG Area & Comparison Chart -->
          <div class="h-64 w-full relative">
            <svg class="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563EB" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="#2563EB" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              <!-- Grid Horizontal Lines -->
              <line x1="0" y1="40" x2="600" y2="40" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-dasharray="3 3" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-dasharray="3 3" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-dasharray="3 3" />

              <!-- Previous Year Line -->
              <path
                d="M 10 145 L 60 135 L 115 125 L 170 118 L 225 110 L 280 102 L 335 95 L 390 90 L 445 85 L 500 78 L 555 70 L 590 55"
                fill="none"
                stroke="#94A3B8"
                stroke-width="2"
                stroke-dasharray="4 4"
              />

              <!-- Current Year Filled Area -->
              <path
                d="M 10 130 L 60 115 L 115 98 L 170 85 L 225 72 L 280 60 L 335 50 L 390 55 L 445 42 L 500 32 L 555 18 L 590 10 L 590 190 L 10 190 Z"
                fill="url(#revenueGrad)"
              />

              <!-- Current Year Solid Stroke -->
              <path
                d="M 10 130 L 60 115 L 115 98 L 170 85 L 225 72 L 280 60 L 335 50 L 390 55 L 445 42 L 500 32 L 555 18 L 590 10"
                fill="none"
                stroke="#2563EB"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <!-- Interactive Point Highlights -->
              <circle cx="500" cy="32" r="5" fill="#2563EB" stroke="#ffffff" stroke-width="2" />
            </svg>

            <!-- Month Labels -->
            <div class="flex justify-between text-[11px] font-medium text-slate-400 mt-2 px-1">
              @for (m of crmData.revenueChartData().months; track m) {
                <span>{{ m }}</span>
              }
            </div>
          </div>
        </div>

        <!-- B. Lead Sources (Donut Chart) -->
        <div class="crm-card p-6 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Lead Sources</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Top acquisition channels</p>
            </div>
            <button routerLink="/leads" class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">View Leads</button>
          </div>

          <!-- Donut Graphic Representation -->
          <div class="flex items-center justify-center my-2 relative">
            <svg class="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
              <!-- Circles representing segments -->
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#E2E8F0" stroke-width="12" class="dark:stroke-slate-800" />
              <!-- Website 42% -->
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#2563EB" stroke-width="12" stroke-dasharray="100 238" stroke-dashoffset="0" />
              <!-- Referral 24% -->
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10B981" stroke-width="12" stroke-dasharray="57 238" stroke-dashoffset="-100" />
              <!-- Social 16% -->
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8B5CF6" stroke-width="12" stroke-dasharray="38 238" stroke-dashoffset="-157" />
              <!-- Ads 12% -->
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" stroke-width="12" stroke-dasharray="28 238" stroke-dashoffset="-195" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-2xl font-black text-slate-900 dark:text-white">2,845</span>
              <span class="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Leads</span>
            </div>
          </div>

          <!-- Channel Breakdown List -->
          <div class="space-y-2 mt-4">
            @for (item of crmData.leadSources(); track item.source) {
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full" [style.backgroundColor]="item.color"></span>
                  <span class="font-medium text-slate-700 dark:text-slate-300">{{ item.source }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-slate-400 font-mono">{{ item.count }}</span>
                  <span class="font-bold text-slate-900 dark:text-white w-8 text-right">{{ item.percentage }}%</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Charts Row 2: Sales Pipeline & Sales Leaderboard -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- C. Sales Pipeline Funnel / Bar Chart -->
        <div class="lg:col-span-2 crm-card p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Sales Pipeline Funnel</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Value and volume across deal velocity stages</p>
            </div>
            <a routerLink="/pipeline" class="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <span>Open Kanban</span>
              <app-icon name="arrow-up-right" [size]="14"></app-icon>
            </a>
          </div>

          <div class="space-y-4">
            @for (stage of crmData.pipelineStages(); track stage.id) {
              <div>
                <div class="flex items-center justify-between text-xs mb-1.5">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-slate-800 dark:text-slate-200">{{ stage.name }}</span>
                    <span class="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">{{ stage.deals.length }} deals</span>
                  </div>
                  <span class="font-bold text-slate-900 dark:text-white font-mono">\${{ stage.totalValue | number }}</span>
                </div>
                <div class="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden flex">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    [style.width.%]="stage.totalValue ? (stage.totalValue / 350000) * 100 : 8"
                    [style.backgroundColor]="stage.color"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- D. Sales Performance Leaderboard -->
        <div class="crm-card p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Sales Performance</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Leaderboard & quota attainment</p>
            </div>
            <app-icon name="bar-chart" [size]="18" class="text-slate-400"></app-icon>
          </div>

          <div class="divide-y divide-slate-100 dark:divide-slate-800/60 space-y-3 pt-1">
            @for (rep of crmData.salesRepsPerformance(); track rep.name) {
              <div class="pt-3 first:pt-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <img [src]="rep.avatar" [alt]="rep.name" class="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20" />
                    <div>
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white">{{ rep.name }}</h4>
                      <p class="text-[11px] text-slate-400">{{ rep.role }} • {{ rep.dealsClosed }} deals</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-extrabold text-slate-900 dark:text-white font-mono">{{ rep.revenue }}</span>
                    <span
                      class="text-[11px] font-bold block"
                      [class.text-emerald-600]="rep.targetPercent >= 100"
                      [class.dark:text-emerald-400]="rep.targetPercent >= 100"
                      [class.text-amber-600]="rep.targetPercent < 100"
                    >
                      {{ rep.targetPercent }}% target
                    </span>
                  </div>
                </div>
                <!-- Mini Progress Bar -->
                <div class="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    [style.width.%]="rep.targetPercent > 100 ? 100 : rep.targetPercent"
                    [ngClass]="rep.targetPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-600'"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Dashboard Tables & Widgets Row: Recent Deals, Activities, Tasks Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Deals Table -->
        <div class="lg:col-span-2 crm-card p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Recent Deals & Opportunities</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">High priority accounts moving through the pipeline</p>
            </div>
            <a routerLink="/deals" class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1">
              <span>View All</span>
              <app-icon name="chevron-right" [size]="14"></app-icon>
            </a>
          </div>

          <div class="crm-table-container">
            <table class="crm-table">
              <thead>
                <tr>
                  <th>Deal Name</th>
                  <th>Customer</th>
                  <th>Owner</th>
                  <th>Value</th>
                  <th>Stage</th>
                  <th>Close Date</th>
                </tr>
              </thead>
              <tbody>
                @for (deal of crmData.deals().slice(0, 5); track deal.id) {
                  <tr>
                    <td class="font-medium text-slate-900 dark:text-white">
                      {{ deal.name }}
                    </td>
                    <td class="text-slate-600 dark:text-slate-300">
                      {{ deal.customerName }}
                    </td>
                    <td>
                      <div class="flex items-center gap-1.5">
                        <img [src]="deal.assignedAvatar" class="w-5 h-5 rounded-full object-cover" />
                        <span class="text-xs">{{ deal.assignedTo }}</span>
                      </div>
                    </td>
                    <td class="font-mono font-bold text-slate-900 dark:text-white">
                      \${{ deal.value | number }}
                    </td>
                    <td>
                      <span
                        class="badge text-[11px]"
                        [ngClass]="{
                          'badge-green': deal.stage === 'Closed Won',
                          'badge-red': deal.stage === 'Closed Lost',
                          'badge-blue': deal.stage === 'Proposal',
                          'badge-purple': deal.stage === 'Negotiation',
                          'badge-amber': deal.stage === 'Qualification',
                          'badge-gray': deal.stage === 'Lead'
                        }"
                      >
                        <span class="badge-dot"></span>
                        {{ deal.stage }}
                      </span>
                    </td>
                    <td class="text-slate-400 font-mono text-xs">
                      {{ deal.expectedCloseDate }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Activities & Tasks Feed -->
        <div class="crm-card p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Recent Activities</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live CRM activity stream</p>
              </div>
              <a routerLink="/activities" class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">View All</a>
            </div>

            <div class="space-y-4">
              @for (act of crmData.activities().slice(0, 4); track act.id) {
                <div class="flex items-start gap-3">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    [ngClass]="{
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': act.type === 'Meeting',
                      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400': act.type === 'Call',
                      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400': act.type === 'Email',
                      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400': act.type === 'Task' || act.type === 'Follow-up'
                    }"
                  >
                    <app-icon
                      [name]="act.type === 'Meeting' ? 'calendar' : act.type === 'Call' ? 'phone' : act.type === 'Email' ? 'mail' : 'check-square'"
                      [size]="15"
                    ></app-icon>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ act.title }}</p>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{{ act.description }}</p>
                    <div class="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>{{ act.customerName }}</span>
                      <span>•</span>
                      <span>{{ act.time }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Tasks Quick Check Widget -->
          <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top Pending Tasks</span>
              <a routerLink="/tasks" class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">Tasks →</a>
            </div>
            <div class="space-y-2">
              @for (task of crmData.tasks().slice(0, 2); track task.id) {
                <div class="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <input
                    type="checkbox"
                    [checked]="task.status === 'Completed'"
                    (change)="crmData.toggleTaskCompleted(task.id)"
                    class="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div class="flex-1 min-w-0">
                    <span class="text-xs font-medium text-slate-800 dark:text-slate-200 block truncate" [class.line-through]="task.status === 'Completed'">
                      {{ task.title }}
                    </span>
                    <span class="text-[10px] text-slate-400">{{ task.dueDate }}</span>
                  </div>
                  <span
                    class="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    [class.bg-rose-100]="task.priority === 'Urgent'"
                    [class.text-rose-600]="task.priority === 'Urgent'"
                    [class.bg-amber-100]="task.priority === 'High'"
                    [class.text-amber-600]="task.priority === 'High'"
                  >
                    {{ task.priority }}
                  </span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  readonly crmData = inject(CrmDataService);
  readonly authService = inject(AuthService);
  readonly toast = inject(ToastService);

  selectedPeriod = signal<'30d' | 'quarter' | 'year'>('30d');
  isRefreshing = signal(false);

  buildSparkline(points: number[]): string {
    if (!points || points.length === 0) return '';
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const stepX = 100 / (points.length - 1);

    return points
      .map((p, i) => {
        const x = i * stepX;
        const y = 22 - ((p - min) / range) * 20;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }

  exportDashboard(): void {
    this.toast.success('Report Exported', 'Nexus Executive Summary PDF has been generated and downloaded.');
  }

  refreshData(): void {
    this.isRefreshing.set(true);
    setTimeout(() => {
      this.isRefreshing.set(false);
      this.toast.info('Dashboard Synchronized', 'All CRM pipeline metrics refreshed to latest state.');
    }, 600);
  }
}
