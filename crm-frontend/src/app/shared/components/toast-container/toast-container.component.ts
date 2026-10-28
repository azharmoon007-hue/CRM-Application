import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white dark:bg-slate-900 transition-all duration-200 animate-scale-in"
          [ngClass]="{
            'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-slate-900': toast.type === 'success',
            'border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-slate-900': toast.type === 'error',
            'border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-slate-900': toast.type === 'warning',
            'border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-slate-900': toast.type === 'info'
          }"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            [ngClass]="{
              'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400': toast.type === 'success',
              'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400': toast.type === 'error',
              'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400': toast.type === 'warning',
              'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400': toast.type === 'info'
            }"
          >
            @if (toast.type === 'success') {
              <app-icon name="check" [size]="16" strokeWidth="2.5"></app-icon>
            } @else if (toast.type === 'error') {
              <app-icon name="x" [size]="16" strokeWidth="2.5"></app-icon>
            } @else if (toast.type === 'warning') {
              <app-icon name="alert-circle" [size]="16" strokeWidth="2.5"></app-icon>
            } @else {
              <app-icon name="help" [size]="16" strokeWidth="2.5"></app-icon>
            }
          </div>

          <div class="flex-1 min-w-0 pt-0.5">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ toast.title }}</h4>
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{{ toast.message }}</p>
          </div>

          <button
            (click)="toastService.remove(toast.id)"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          >
            <app-icon name="x" [size]="14"></app-icon>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
