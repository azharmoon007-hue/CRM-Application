import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Reports & Business Intelligence</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit-ready revenue realization, sales rep quota achievement, cohort retention, and conversion analytics.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button (click)="exportPDF()" class="btn-secondary text-xs">
            <app-icon name="file-text" [size]="14"></app-icon>
            Export PDF
          </button>
          <button (click)="exportExcel()" class="btn-primary text-xs">
            <app-icon name="download" [size]="14"></app-icon>
            Export Excel
          </button>
        </div>
      </div>

      <!-- Report Category Selector -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto text-xs font-semibold scrollbar-none">
        @for (cat of categories; track cat) {
          <button
            (click)="selectedCategory.set(cat)"
            class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            [class.bg-blue-600]="selectedCategory() === cat"
            [class.text-white]="selectedCategory() === cat"
            [class.bg-slate-100]="selectedCategory() !== cat"
            [class.dark:bg-slate-800]="selectedCategory() !== cat"
            [class.text-slate-600]="selectedCategory() !== cat"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Summary Metrics Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="crm-card p-4">
          <span class="text-xs text-slate-400 font-medium">Net Realized Revenue</span>
          <div class="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">$1,894,500</div>
          <span class="text-[11px] text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
            <app-icon name="arrow-up-right" [size]="12"></app-icon> +18.7% vs FY23
          </span>
        </div>
        <div class="crm-card p-4">
          <span class="text-xs text-slate-400 font-medium">Avg Sales Velocity</span>
          <div class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">28.4 Days</div>
          <span class="text-[11px] text-emerald-600 font-semibold mt-1 block">-4.2 days faster</span>
        </div>
        <div class="crm-card p-4">
          <span class="text-xs text-slate-400 font-medium">Avg Deal Size</span>
          <div class="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-mono">$72,400</div>
          <span class="text-[11px] text-slate-400 mt-1 block">Enterprise tier</span>
        </div>
        <div class="crm-card p-4">
          <span class="text-xs text-slate-400 font-medium">Win/Loss Ratio</span>
          <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">3.4x</div>
          <span class="text-[11px] text-slate-400 mt-1 block">77.3% win rate</span>
        </div>
      </div>

      <!-- Charts Visualization -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Monthly Revenue Trend Bar Chart -->
        <div class="lg:col-span-2 crm-card p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Revenue Realization by Quarter</h3>
              <p class="text-xs text-slate-400 mt-0.5">Quarterly breakdown vs budget target</p>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-blue-600"></span> Actual</span>
              <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-slate-300 dark:bg-slate-700"></span> Target</span>
            </div>
          </div>

          <div class="h-60 flex items-end justify-between gap-4 pt-4 border-b border-slate-100 dark:border-slate-800">
            @for (q of quarterlyData; track q.label) {
              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div class="w-full flex items-end justify-center gap-2 h-44">
                  <!-- Actual Bar -->
                  <div class="w-8 rounded-t-lg bg-blue-600 transition-all hover:bg-blue-500 relative group cursor-pointer" [style.height.%]="q.actualPercent">
                    <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-1.5 py-0.5 rounded font-mono">
                      \${{ q.actual | number }}
                    </span>
                  </div>
                  <!-- Target Bar -->
                  <div class="w-8 rounded-t-lg bg-slate-200 dark:bg-slate-700 transition-all hover:bg-slate-300 relative group cursor-pointer" [style.height.%]="q.targetPercent">
                    <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-1.5 py-0.5 rounded font-mono">
                      \${{ q.target | number }}
                    </span>
                  </div>
                </div>
                <span class="text-xs font-bold text-slate-600 dark:text-slate-400 mt-2">{{ q.label }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Conversion Breakdown -->
        <div class="crm-card p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Pipeline Conversion Funnel</h3>
            <p class="text-xs text-slate-400 mt-0.5">Stage progression drop-off rates</p>
          </div>

          <div class="space-y-4 my-4">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span>Leads Captured</span>
                <span class="font-mono">2,845 (100%)</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div class="h-full bg-blue-600 w-full"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span>Technical Qualification</span>
                <span class="font-mono">1,820 (64%)</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div class="h-full bg-purple-600 w-[64%]"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span>Proposal Delivered</span>
                <span class="font-mono">1,140 (40%)</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div class="h-full bg-amber-500 w-[40%]"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span>Contract Signed (Won)</span>
                <span class="font-mono">705 (24.8%)</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div class="h-full bg-emerald-500 w-[24.8%]"></div>
              </div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
            <span>Overall Opportunity to Won Velocity is top 5% among enterprise B2B SaaS benchmarks.</span>
          </div>
        </div>
      </div>

      <!-- Detailed Analytics Data Table -->
      <div class="crm-table-container">
        <table class="crm-table">
          <thead>
            <tr>
              <th>Representative</th>
              <th>Department</th>
              <th>Deals Closed</th>
              <th>Quota Realization</th>
              <th>Revenue Won</th>
              <th>Avg Sales Cycle</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            @for (row of crmData.salesRepsPerformance(); track row.name) {
              <tr>
                <td>
                  <div class="flex items-center gap-2.5">
                    <img [src]="row.avatar" class="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <span class="font-bold text-slate-900 dark:text-white block">{{ row.name }}</span>
                      <span class="text-[11px] text-slate-400">{{ row.role }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-xs text-slate-600 dark:text-slate-300">Enterprise SaaS</td>
                <td class="font-bold font-mono">{{ row.dealsClosed }}</td>
                <td>
                  <span
                    class="font-bold text-xs"
                    [class.text-emerald-600]="row.targetPercent >= 100"
                    [class.text-amber-600]="row.targetPercent < 100"
                  >
                    {{ row.targetPercent }}% of {{ row.target }}
                  </span>
                </td>
                <td class="font-bold font-mono text-slate-900 dark:text-white">{{ row.revenue }}</td>
                <td class="text-xs text-slate-400 font-mono">24.1 Days</td>
                <td>
                  <span class="badge badge-green text-xs">
                    <span class="badge-dot"></span>
                    Target Achieved
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ReportsComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  readonly categories = [
    'Revenue Analytics',
    'Customer Cohorts',
    'Leads & Inbound',
    'Pipeline Velocity',
    'Sales Rep Quotas',
    'Lead Source Performance',
    'Activities & Outreach'
  ];

  selectedCategory = signal('Revenue Analytics');

  readonly quarterlyData = [
    { label: 'Q1 2024', actual: 440000, actualPercent: 70, target: 400000, targetPercent: 65 },
    { label: 'Q2 2024', actual: 495000, actualPercent: 80, target: 450000, targetPercent: 72 },
    { label: 'Q3 2024', actual: 560000, actualPercent: 90, target: 500000, targetPercent: 82 },
    { label: 'Q4 (Est.)', actual: 640000, actualPercent: 100, target: 550000, targetPercent: 88 }
  ];

  exportPDF(): void {
    this.toast.success('PDF Generated', 'Nexus Executive Analytics report exported (PDF format).');
  }

  exportExcel(): void {
    this.toast.success('Excel Generated', 'Complete financial and CRM dataset downloaded as XLSX.');
  }
}
