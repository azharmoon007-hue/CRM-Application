import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TaskItem } from '../../core/models/crm.models';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Task Management</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize sales deliverables, contracts, follow-ups, and customer success checklists.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- View Switcher: List / Kanban -->
          <div class="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xs text-xs font-semibold">
            <button
              (click)="taskView.set('list')"
              class="px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5"
              [class.bg-blue-600]="taskView() === 'list'"
              [class.text-white]="taskView() === 'list'"
              [class.text-slate-600]="taskView() !== 'list'"
              [class.dark:text-slate-400]="taskView() !== 'list'"
            >
              <app-icon name="dashboard" [size]="14"></app-icon>
              List View
            </button>
            <button
              (click)="taskView.set('kanban')"
              class="px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5"
              [class.bg-blue-600]="taskView() === 'kanban'"
              [class.text-white]="taskView() === 'kanban'"
              [class.text-slate-600]="taskView() !== 'kanban'"
              [class.dark:text-slate-400]="taskView() !== 'kanban'"
            >
              <app-icon name="pipeline" [size]="14"></app-icon>
              Kanban View
            </button>
          </div>

          <button (click)="showNewTaskModal.set(true)" class="btn-primary text-xs">
            <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
            Add Task
          </button>
        </div>
      </div>

      <!-- Quick Status Filters Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="crm-card p-4 cursor-pointer hover:border-blue-400 transition-colors" (click)="statusFilter.set('ALL')">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Total Backlog</span>
          <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">{{ crmData.tasks().length }}</div>
          <span class="text-[11px] text-slate-400 mt-1 block">All assigned items</span>
        </div>
        <div class="crm-card p-4 cursor-pointer hover:border-blue-400 transition-colors" (click)="statusFilter.set('Todo')">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">To Do</span>
          <div class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{{ countStatus('Todo') }}</div>
          <span class="text-[11px] text-blue-600/80 font-medium mt-1 block">Ready for action</span>
        </div>
        <div class="crm-card p-4 cursor-pointer hover:border-blue-400 transition-colors" (click)="statusFilter.set('In Progress')">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">In Progress</span>
          <div class="text-2xl font-black text-amber-500 mt-1">{{ countStatus('In Progress') }}</div>
          <span class="text-[11px] text-amber-600/80 font-medium mt-1 block">Underway</span>
        </div>
        <div class="crm-card p-4 cursor-pointer border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-slate-900" (click)="statusFilter.set('OVERDUE')">
          <span class="text-xs font-medium text-rose-600 dark:text-rose-400 font-bold">Overdue Alert</span>
          <div class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{{ overdueCount() }}</div>
          <span class="text-[11px] text-rose-500 font-semibold mt-1 block">Requires immediate follow-up</span>
        </div>
      </div>

      <!-- LIST VIEW -->
      @if (taskView() === 'list') {
        <div class="crm-card p-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
            <div class="flex items-center gap-3">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                placeholder="Search tasks..."
                class="crm-input w-64 text-xs"
              />
              <select [(ngModel)]="priorityFilter" class="crm-input w-36 text-xs">
                <option value="ALL">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <span class="text-xs text-slate-400">Active tasks list</span>
          </div>

          <div class="divide-y divide-slate-100 dark:divide-slate-800/60">
            @for (task of filteredTasks(); track task.id) {
              <div
                class="py-3.5 px-3 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors"
                [class.bg-rose-50/30]="task.isOverdue"
                [class.dark:bg-rose-950/20]="task.isOverdue"
              >
                <!-- Left: Checkbox + Title + Related -->
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    [checked]="task.status === 'Completed'"
                    (change)="crmData.toggleTaskCompleted(task.id)"
                    class="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div class="min-w-0">
                    <span
                      class="text-xs font-bold text-slate-900 dark:text-white block truncate"
                      [class.line-through]="task.status === 'Completed'"
                      [class.text-slate-400]="task.status === 'Completed'"
                    >
                      {{ task.title }}
                    </span>
                    <div class="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      @if (task.relatedCustomer) {
                        <span class="text-blue-600 dark:text-blue-400 font-medium">{{ task.relatedCustomer }}</span>
                        <span>•</span>
                      }
                      @if (task.relatedDeal) {
                        <span class="truncate max-w-xs">{{ task.relatedDeal }}</span>
                        <span>•</span>
                      }
                      <span>Assignee: {{ task.assignedTo }}</span>
                    </div>
                  </div>
                </div>

                <!-- Right: Priority + Due Date + Overdue indicator -->
                <div class="flex items-center gap-3 shrink-0">
                  <span
                    class="badge text-[11px]"
                    [ngClass]="{
                      'badge-red': task.priority === 'Urgent',
                      'badge-amber': task.priority === 'High',
                      'badge-blue': task.priority === 'Medium',
                      'badge-gray': task.priority === 'Low'
                    }"
                  >
                    <span class="badge-dot"></span>
                    {{ task.priority }}
                  </span>

                  <span
                    class="text-xs font-mono px-2 py-0.5 rounded"
                    [class.text-rose-600]="task.isOverdue"
                    [class.bg-rose-100]="task.isOverdue"
                    [class.dark:bg-rose-950/60]="task.isOverdue"
                    [class.text-slate-500]="!task.isOverdue"
                  >
                    @if (task.isOverdue) { ⚠️ Overdue: }
                    {{ task.dueDate }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- KANBAN VIEW (Todo, In Progress, Completed) -->
      @if (taskView() === 'kanban') {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Col 1: Todo -->
          <div class="crm-card p-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
            <div class="flex items-center justify-between pb-3 border-b mb-3">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">To Do ({{ countStatus('Todo') }})</span>
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            </div>
            <div class="space-y-3 flex-1 overflow-y-auto">
              @for (task of getByStatus('Todo'); track task.id) {
                <div class="crm-card p-3 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                  <div class="flex items-start justify-between">
                    <span class="text-xs font-bold text-slate-900 dark:text-white">{{ task.title }}</span>
                    <span class="text-[10px] font-bold px-1.5 py-0.2 rounded" [class.bg-rose-100]="task.priority === 'Urgent'" [class.text-rose-600]="task.priority === 'Urgent'">{{ task.priority }}</span>
                  </div>
                  <p class="text-[11px] text-slate-400">{{ task.relatedCustomer }}</p>
                  <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t">
                    <span>{{ task.dueDate }}</span>
                    <button (click)="crmData.toggleTaskCompleted(task.id)" class="text-blue-600 text-[10px] font-bold">Mark Done</button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Col 2: In Progress -->
          <div class="crm-card p-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
            <div class="flex items-center justify-between pb-3 border-b mb-3">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">In Progress ({{ countStatus('In Progress') }})</span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            </div>
            <div class="space-y-3 flex-1 overflow-y-auto">
              @for (task of getByStatus('In Progress'); track task.id) {
                <div class="crm-card p-3 bg-white dark:bg-slate-900 shadow-xs space-y-2" [class.border-rose-400]="task.isOverdue">
                  <div class="flex items-start justify-between">
                    <span class="text-xs font-bold text-slate-900 dark:text-white">{{ task.title }}</span>
                    <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700">{{ task.priority }}</span>
                  </div>
                  <p class="text-[11px] text-slate-400">{{ task.relatedCustomer }}</p>
                  <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t">
                    <span [class.text-rose-600]="task.isOverdue">{{ task.isOverdue ? '⚠️ Overdue' : task.dueDate }}</span>
                    <button (click)="crmData.toggleTaskCompleted(task.id)" class="text-blue-600 text-[10px] font-bold">Complete</button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Col 3: Completed -->
          <div class="crm-card p-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
            <div class="flex items-center justify-between pb-3 border-b mb-3">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Completed ({{ countStatus('Completed') }})</span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <div class="space-y-3 flex-1 overflow-y-auto">
              @for (task of getByStatus('Completed'); track task.id) {
                <div class="crm-card p-3 bg-white dark:bg-slate-900 shadow-xs space-y-2 opacity-75">
                  <span class="text-xs font-bold line-through text-slate-500">{{ task.title }}</span>
                  <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t">
                    <span>Resolved</span>
                    <button (click)="crmData.toggleTaskCompleted(task.id)" class="text-slate-500 text-[10px]">Reopen</button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Create Task Modal -->
    @if (showNewTaskModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="showNewTaskModal.set(false)">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in" (click)="$event.stopPropagation()">
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Add New Task</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
              <input type="text" [(ngModel)]="newTitle" placeholder="e.g. Deliver custom MSA schedule" class="crm-input" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Related Account</label>
                <input type="text" [(ngModel)]="newCustomer" placeholder="CloudScale Dynamics" class="crm-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                <input type="text" [(ngModel)]="newDueDate" placeholder="Tomorrow, 5:00 PM" class="crm-input" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select [(ngModel)]="newPriority" class="crm-input">
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button (click)="showNewTaskModal.set(false)" class="btn-secondary text-xs">Cancel</button>
            <button (click)="saveTask()" class="btn-primary text-xs">Create Task</button>
          </div>
        </div>
      </div>
    }
  `
})
export class TasksComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  taskView = signal<'list' | 'kanban'>('list');
  statusFilter = signal('ALL');
  priorityFilter = signal('ALL');
  searchQuery = signal('');
  showNewTaskModal = signal(false);

  newTitle = '';
  newCustomer = 'Apex Health Systems';
  newDueDate = 'Today, 6:00 PM';
  newPriority: 'Low' | 'Medium' | 'High' | 'Urgent' = 'High';

  readonly filteredTasks = computed(() => {
    let list = this.crmData.tasks();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();
    const pr = this.priorityFilter();

    if (q) {
      list = list.filter(t => t.title.toLowerCase().includes(q) || (t.relatedCustomer && t.relatedCustomer.toLowerCase().includes(q)));
    }

    if (st === 'OVERDUE') {
      list = list.filter(t => t.isOverdue);
    } else if (st !== 'ALL') {
      list = list.filter(t => t.status === st);
    }

    if (pr !== 'ALL') {
      list = list.filter(t => t.priority === pr);
    }

    return list;
  });

  countStatus(status: TaskItem['status']): number {
    return this.crmData.tasks().filter(t => t.status === status).length;
  }

  overdueCount = computed(() => this.crmData.tasks().filter(t => t.isOverdue).length);

  getByStatus(status: TaskItem['status']): TaskItem[] {
    return this.crmData.tasks().filter(t => t.status === status);
  }

  saveTask(): void {
    if (!this.newTitle) {
      this.toast.error('Validation Error', 'Task title is required');
      return;
    }

    this.crmData.addTask({
      title: this.newTitle,
      assignedTo: 'Alex Mercer',
      dueDate: this.newDueDate,
      priority: this.newPriority,
      status: 'Todo',
      relatedCustomer: this.newCustomer,
      isOverdue: false
    });

    this.toast.success('Task Added', `${this.newTitle} added to task board.`);
    this.showNewTaskModal.set(false);
    this.newTitle = '';
  }
}
