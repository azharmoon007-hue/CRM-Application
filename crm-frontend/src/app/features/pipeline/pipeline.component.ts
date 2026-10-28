import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Deal, DealStage } from '../../core/models/crm.models';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12 flex flex-col h-[calc(100vh-6rem)]">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-page-heading text-slate-900 dark:text-white">Sales Pipeline Kanban</h1>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold">
              Enterprise SaaS Funnel
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Drag and drop deals across stages to advance negotiations and trigger automated CRM workflows.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <a routerLink="/deals" class="btn-secondary text-xs">
            <app-icon name="dashboard" [size]="14"></app-icon>
            Table View
          </a>
          <button (click)="toast.info('Add Deal', 'Use the top + Create button or shortcut ⌘K')" class="btn-primary text-xs">
            <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
            Add Deal
          </button>
        </div>
      </div>

      <!-- Drag & Drop Kanban Container -->
      <div
        cdkDropListGroup
        class="flex-1 overflow-x-auto overflow-y-hidden pb-4 flex gap-4 min-h-0 select-none"
      >
        @for (stage of crmData.pipelineStages(); track stage.id) {
          <div
            class="w-80 shrink-0 flex flex-col rounded-2xl bg-slate-100/70 dark:bg-[#111c2e] border border-slate-200/90 dark:border-[#263449] overflow-hidden shadow-xs"
          >
            <!-- Column Header -->
            <div class="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full shrink-0" [style.backgroundColor]="stage.color"></span>
                <span class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{{ stage.name }}</span>
                <span class="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                  {{ stage.deals.length }}
                </span>
              </div>
              <span class="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
                \${{ stage.totalValue | number }}
              </span>
            </div>

            <!-- Droppable Deals List -->
            <div
              cdkDropList
              [id]="stage.name"
              [cdkDropListData]="stage.deals"
              (cdkDropListDropped)="onDrop($event, stage.name)"
              class="flex-1 overflow-y-auto p-2.5 space-y-2.5"
            >
              @for (deal of stage.deals; track deal.id) {
                <div
                  cdkDrag
                  [cdkDragData]="deal"
                  (click)="selectedDeal.set(deal)"
                  class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-grab active:cursor-grabbing group"
                >
                  <!-- Card Header: Customer & Priority -->
                  <div class="flex items-center justify-between text-xs mb-1.5">
                    <span class="font-medium text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                      {{ deal.customerName }}
                    </span>
                    <span
                      class="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      [class.bg-rose-100]="deal.priority === 'Urgent'"
                      [class.text-rose-600]="deal.priority === 'Urgent'"
                      [class.bg-amber-100]="deal.priority === 'High'"
                      [class.text-amber-600]="deal.priority === 'High'"
                      [class.bg-blue-100]="deal.priority === 'Medium'"
                      [class.text-blue-600]="deal.priority === 'Medium'"
                      [class.bg-slate-100]="deal.priority === 'Low'"
                      [class.text-slate-600]="deal.priority === 'Low'"
                    >
                      {{ deal.priority }}
                    </span>
                  </div>

                  <!-- Deal Title -->
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {{ deal.name }}
                  </h4>

                  <!-- Amount & Probability -->
                  <div class="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span class="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                      \${{ deal.value | number }}
                    </span>
                    <span class="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      {{ deal.probability }}% prob
                    </span>
                  </div>

                  <!-- Footer: Rep Avatar & Close Date -->
                  <div class="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
                    <div class="flex items-center gap-1.5">
                      <img [src]="deal.assignedAvatar" class="w-5 h-5 rounded-full object-cover" />
                      <span class="truncate max-w-[90px]">{{ deal.assignedTo.split(' ')[0] }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <app-icon name="calendar" [size]="12"></app-icon>
                      <span class="font-mono">{{ deal.expectedCloseDate }}</span>
                    </div>
                  </div>
                </div>
              }

              @if (stage.deals.length === 0) {
                <div class="h-28 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs">
                  <span>Drop deal here</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Deal Quick Inspector Modal -->
    @if (selectedDeal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="selectedDeal.set(null)">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">{{ selectedDeal()!.customerName }}</span>
              <h3 class="text-base font-bold text-slate-900 dark:text-white mt-0.5">{{ selectedDeal()!.name }}</h3>
            </div>
            <button (click)="selectedDeal.set(null)" class="text-slate-400 hover:text-slate-600 p-1 rounded-md">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4 my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border text-xs">
            <div>
              <span class="text-slate-400 block mb-0.5">Value</span>
              <span class="font-mono text-base font-extrabold text-slate-900 dark:text-white">\${{ selectedDeal()!.value | number }}</span>
            </div>
            <div>
              <span class="text-slate-400 block mb-0.5">Stage</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ selectedDeal()!.stage }}</span>
            </div>
            <div>
              <span class="text-slate-400 block mb-0.5">Probability</span>
              <span class="font-bold text-blue-600 dark:text-blue-400">{{ selectedDeal()!.probability }}%</span>
            </div>
            <div>
              <span class="text-slate-400 block mb-0.5">Target Close</span>
              <span class="font-mono font-medium text-slate-700 dark:text-slate-300">{{ selectedDeal()!.expectedCloseDate }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <button
              (click)="toast.success('Deal Won!', 'Marked as Closed Won.'); crmData.updateDealStage(selectedDeal()!.id, 'Closed Won'); selectedDeal.set(null)"
              class="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700"
            >
              Mark Won 🏆
            </button>
            <button (click)="selectedDeal.set(null)" class="btn-secondary text-xs">
              Close
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class PipelineComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  selectedDeal = signal<Deal | null>(null);

  onDrop(event: CdkDragDrop<Deal[]>, targetStageName: DealStage): void {
    const deal = event.item.data as Deal;

    if (deal.stage !== targetStageName) {
      this.crmData.updateDealStage(deal.id, targetStageName);
      this.toast.success(
        'Deal Moved',
        `"${deal.name}" moved to ${targetStageName}`
      );
    }
  }
}
