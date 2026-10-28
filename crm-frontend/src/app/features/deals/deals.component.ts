import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Deal, DealStage } from '../../core/models/crm.models';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Deals & Opportunities</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Forecast pipeline revenue, manage contract stages, and close enterprise deals.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <a routerLink="/pipeline" class="btn-secondary text-xs">
            <app-icon name="pipeline" [size]="14"></app-icon>
            Kanban View
          </a>
          <button (click)="openCreateDeal()" class="btn-primary text-xs">
            <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
            Add Deal
          </button>
        </div>
      </div>

      <!-- Pipeline Summary Metrics Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="crm-card p-4">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Total Open Deals</span>
          <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">{{ totalOpenDeals() }}</div>
          <span class="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 block">Active in pipeline</span>
        </div>
        <div class="crm-card p-4">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Total Pipeline Value</span>
          <div class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">\${{ totalPipelineValue() | number }}</div>
          <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
            <app-icon name="arrow-up-right" [size]="12"></app-icon> +11.3% vs target
          </span>
        </div>
        <div class="crm-card p-4">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Weighted Forecast</span>
          <div class="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-mono">\${{ weightedPipelineValue() | number }}</div>
          <span class="text-[11px] text-slate-400 mt-1 block">Probability adjusted</span>
        </div>
        <div class="crm-card p-4">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Closed Won (MTD)</span>
          <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">\${{ wonPipelineValue() | number }}</div>
          <span class="text-[11px] text-slate-400 mt-1 block">100% committed</span>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="crm-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex flex-1 items-center gap-3">
          <div class="relative flex-1 max-w-sm">
            <app-icon name="search" [size]="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></app-icon>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search deals by title or customer..."
              class="crm-input pl-9 text-xs"
            />
          </div>

          <select [(ngModel)]="stageFilter" class="crm-input w-40 text-xs">
            <option value="ALL">All Stages</option>
            <option value="Lead">Lead</option>
            <option value="Qualification">Qualification</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>

        <div class="text-xs text-slate-400">
          <span>Showing <strong>{{ filteredDeals().length }}</strong> deals</span>
        </div>
      </div>

      <!-- Deals Data Table -->
      <div class="crm-table-container">
        <table class="crm-table">
          <thead>
            <tr>
              <th>Deal Name</th>
              <th>Customer</th>
              <th>Deal Value</th>
              <th>Pipeline</th>
              <th>Stage</th>
              <th>Probability</th>
              <th>Assigned Rep</th>
              <th>Close Date</th>
              <th>Status</th>
              <th class="text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody>
            @for (deal of filteredDeals(); track deal.id) {
              <tr class="cursor-pointer group" (click)="selectedDeal.set(deal)">
                <td>
                  <div class="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {{ deal.name }}
                  </div>
                  <span class="text-[11px] font-mono text-slate-400">ID: {{ deal.id }}</span>
                </td>
                <td class="font-medium text-slate-700 dark:text-slate-300">
                  {{ deal.customerName }}
                </td>
                <td class="font-mono font-bold text-slate-900 dark:text-white">
                  \${{ deal.value | number }}
                </td>
                <td class="text-xs text-slate-500">
                  {{ deal.pipeline }}
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
                <td>
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div class="h-full rounded-full bg-blue-600" [style.width.%]="deal.probability"></div>
                    </div>
                    <span class="font-mono text-xs font-semibold">{{ deal.probability }}%</span>
                  </div>
                </td>
                <td>
                  <div class="flex items-center gap-1.5">
                    <img [src]="deal.assignedAvatar" class="w-5 h-5 rounded-full object-cover" />
                    <span class="text-xs">{{ deal.assignedTo }}</span>
                  </div>
                </td>
                <td class="text-slate-400 font-mono text-xs">
                  {{ deal.expectedCloseDate }}
                </td>
                <td>
                  <span
                    class="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    [class.bg-emerald-100]="deal.status === 'WON'"
                    [class.text-emerald-700]="deal.status === 'WON'"
                    [class.bg-rose-100]="deal.status === 'LOST'"
                    [class.text-rose-700]="deal.status === 'LOST'"
                    [class.bg-blue-100]="deal.status === 'OPEN'"
                    [class.text-blue-700]="deal.status === 'OPEN'"
                  >
                    {{ deal.status }}
                  </span>
                </td>
                <td class="text-right" (click)="$event.stopPropagation()">
                  <div class="flex items-center justify-end gap-1.5">
                    @if (deal.status === 'OPEN') {
                      <button
                        (click)="markWon(deal)"
                        class="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        title="Mark Won"
                      >
                        <app-icon name="check" [size]="16" strokeWidth="2.5"></app-icon>
                      </button>
                      <button
                        (click)="markLost(deal)"
                        class="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Mark Lost"
                      >
                        <app-icon name="x" [size]="16" strokeWidth="2.5"></app-icon>
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Deal Details Modal -->
    @if (selectedDeal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="selectedDeal.set(null)">
        <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ selectedDeal()!.name }}</h3>
                <span class="badge text-xs" [ngClass]="{
                  'badge-green': selectedDeal()!.stage === 'Closed Won',
                  'badge-red': selectedDeal()!.stage === 'Closed Lost',
                  'badge-blue': selectedDeal()!.stage === 'Proposal',
                  'badge-purple': selectedDeal()!.stage === 'Negotiation',
                  'badge-amber': selectedDeal()!.stage === 'Qualification',
                  'badge-gray': selectedDeal()!.stage === 'Lead'
                }">
                  <span class="badge-dot"></span>
                  {{ selectedDeal()!.stage }}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customer: <strong class="text-slate-800 dark:text-slate-200">{{ selectedDeal()!.customerName }}</strong>
              </p>
            </div>
            <button (click)="selectedDeal.set(null)" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Deal Metrics Banner -->
            <div class="grid grid-cols-3 gap-4">
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Contract Value</span>
                <div class="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">\${{ selectedDeal()!.value | number }}</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Probability</span>
                <div class="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">{{ selectedDeal()!.probability }}%</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Weighted Forecast</span>
                <div class="text-xl font-black text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                  \${{ (selectedDeal()!.value * selectedDeal()!.probability) / 100 | number }}
                </div>
              </div>
            </div>

            <!-- Stage Progression Selector -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Advance Stage</label>
              <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                @for (st of ['Lead', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']; track st) {
                  <button
                    (click)="changeStage(selectedDeal()!, $any(st))"
                    class="py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all"
                    [class.bg-blue-600]="selectedDeal()!.stage === st"
                    [class.text-white]="selectedDeal()!.stage === st"
                    [class.border-blue-600]="selectedDeal()!.stage === st"
                    [class.bg-white]="selectedDeal()!.stage !== st"
                    [class.dark:bg-slate-800]="selectedDeal()!.stage !== st"
                    [class.text-slate-600]="selectedDeal()!.stage !== st"
                    [class.dark:text-slate-300]="selectedDeal()!.stage !== st"
                  >
                    {{ st }}
                  </button>
                }
              </div>
            </div>

            <!-- Details List -->
            <div class="grid grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <span class="text-slate-400 block mb-1">Pipeline:</span>
                <span class="font-medium text-slate-900 dark:text-white">{{ selectedDeal()!.pipeline }}</span>
              </div>
              <div>
                <span class="text-slate-400 block mb-1">Assigned Representative:</span>
                <span class="font-medium text-slate-900 dark:text-white">{{ selectedDeal()!.assignedTo }}</span>
              </div>
              <div>
                <span class="text-slate-400 block mb-1">Target Close Date:</span>
                <span class="font-medium text-slate-900 dark:text-white font-mono">{{ selectedDeal()!.expectedCloseDate }}</span>
              </div>
              <div>
                <span class="text-slate-400 block mb-1">Created Date:</span>
                <span class="font-medium text-slate-900 dark:text-white font-mono">{{ selectedDeal()!.createdDate }}</span>
              </div>
            </div>

            <!-- Notes -->
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border text-xs">
              <span class="font-bold text-slate-500 uppercase tracking-wider block mb-1">Internal Deal Notes</span>
              <p class="text-slate-700 dark:text-slate-300 leading-relaxed">{{ selectedDeal()!.notes || 'Custom contract terms currently being drafted by sales enablement.' }}</p>
            </div>
          </div>

          <!-- Footer Actions: Edit Deal, Change Stage, Mark Won, Mark Lost -->
          <div class="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <button (click)="markWon(selectedDeal()!)" class="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700">
                Mark Won 🏆
              </button>
              <button (click)="markLost(selectedDeal()!)" class="btn-secondary text-xs text-rose-600 hover:bg-rose-50">
                Mark Lost
              </button>
            </div>
            <button (click)="toast.success('Deal Saved', 'Opportunity attributes updated.'); selectedDeal.set(null)" class="btn-secondary text-xs">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class DealsComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  searchQuery = signal('');
  stageFilter = signal('ALL');
  selectedDeal = signal<Deal | null>(null);

  readonly filteredDeals = computed(() => {
    let list = this.crmData.deals();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.stageFilter();

    if (q) {
      list = list.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.customerName.toLowerCase().includes(q)
      );
    }

    if (st !== 'ALL') {
      list = list.filter(d => d.stage === st);
    }

    return list;
  });

  totalOpenDeals = computed(() => this.crmData.deals().filter(d => d.status === 'OPEN').length);
  totalPipelineValue = computed(() => this.crmData.deals().reduce((sum, d) => sum + d.value, 0));
  weightedPipelineValue = computed(() =>
    this.crmData.deals().reduce((sum, d) => sum + (d.value * d.probability) / 100, 0)
  );
  wonPipelineValue = computed(() =>
    this.crmData.deals().filter(d => d.status === 'WON').reduce((sum, d) => sum + d.value, 0)
  );

  changeStage(deal: Deal, newStage: DealStage): void {
    this.crmData.updateDealStage(deal.id, newStage);
    this.toast.success('Stage Updated', `${deal.name} advanced to ${newStage}`);
    const updated = this.crmData.deals().find(d => d.id === deal.id);
    if (updated) this.selectedDeal.set(updated);
  }

  markWon(deal: Deal): void {
    this.changeStage(deal, 'Closed Won');
    this.selectedDeal.set(null);
  }

  markLost(deal: Deal): void {
    this.changeStage(deal, 'Closed Lost');
    this.selectedDeal.set(null);
  }

  openCreateDeal(): void {
    this.toast.info('Quick Create', 'Use the top "+ Create" button to rapidly add opportunities.');
  }
}
