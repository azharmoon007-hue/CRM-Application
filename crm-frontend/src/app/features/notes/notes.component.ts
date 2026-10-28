import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NoteItem } from '../../core/models/crm.models';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Workspace Notes</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Internal meeting debriefs, negotiation insights, competitive intel, and account memos.
          </p>
        </div>

        <button (click)="showNewNoteModal.set(true)" class="btn-primary text-xs">
          <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
          Create Note
        </button>
      </div>

      <!-- Search & Tag Filters -->
      <div class="crm-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="relative flex-1 max-w-sm">
          <app-icon name="search" [size]="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search notes content, title, tags, or accounts..."
            class="crm-input pl-9 text-xs"
          />
        </div>

        <div class="flex items-center gap-2">
          <button
            (click)="selectedTag.set('ALL')"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
            [class.bg-blue-600]="selectedTag() === 'ALL'"
            [class.text-white]="selectedTag() === 'ALL'"
            [class.bg-slate-100]="selectedTag() !== 'ALL'"
            [class.dark:bg-slate-800]="selectedTag() !== 'ALL'"
            [class.text-slate-600]="selectedTag() !== 'ALL'"
          >
            All Notes
          </button>
          @for (tag of allTags; track tag) {
            <button
              (click)="selectedTag.set(tag)"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
              [class.bg-blue-600]="selectedTag() === tag"
              [class.text-white]="selectedTag() === tag"
              [class.bg-slate-100]="selectedTag() !== tag"
              [class.dark:bg-slate-800]="selectedTag() !== tag"
              [class.text-slate-600]="selectedTag() !== tag"
            >
              #{{ tag }}
            </button>
          }
        </div>
      </div>

      <!-- Notes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        @for (note of filteredNotes(); track note.id) {
          <div
            class="crm-card p-5 flex flex-col justify-between hover:border-blue-400 transition-all shadow-xs relative group"
            [class.border-blue-300]="note.isPinned"
            [class.dark:border-blue-800]="note.isPinned"
          >
            <!-- Pin Badge / Header -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {{ note.relatedType }}: {{ note.relatedTo }}
                </span>
                @if (note.isPinned) {
                  <span class="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <app-icon name="star" [size]="12"></app-icon>
                    Pinned
                  </span>
                }
              </div>

              <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                {{ note.title }}
              </h3>

              <p class="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed whitespace-pre-line line-clamp-4">
                {{ note.content }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 mt-4">
                @for (t of note.tags; track t) {
                  <span class="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    #{{ t }}
                  </span>
                }
              </div>
            </div>

            <!-- Footer: Author & Timestamp -->
            <div class="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-slate-400">
              <span class="font-medium text-slate-600 dark:text-slate-400">By {{ note.createdBy }}</span>
              <span>{{ note.updatedDate }}</span>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Create Note Modal -->
    @if (showNewNoteModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="showNewNoteModal.set(false)">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in" (click)="$event.stopPropagation()">
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Add Account Note</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input type="text" [(ngModel)]="newNoteTitle" placeholder="e.g. Q4 Executive briefing takeaways" class="crm-input" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Related Entity</label>
                <input type="text" [(ngModel)]="newNoteRelated" placeholder="CloudScale Dynamics" class="crm-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Entity Type</label>
                <select [(ngModel)]="newNoteType" class="crm-input">
                  <option value="Customer">Customer</option>
                  <option value="Lead">Lead</option>
                  <option value="Deal">Deal</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes Content (Rich Format)</label>
              <textarea [(ngModel)]="newNoteBody" rows="4" placeholder="Detail action points, terms discussed, pricing feedback..." class="crm-input"></textarea>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" [(ngModel)]="newNotePinned" id="pinCheck" class="rounded text-blue-600 cursor-pointer" />
              <label for="pinCheck" class="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">Pin to top of account feed</label>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button (click)="showNewNoteModal.set(false)" class="btn-secondary text-xs">Cancel</button>
            <button (click)="saveNote()" class="btn-primary text-xs">Save Note</button>
          </div>
        </div>
      </div>
    }
  `
})
export class NotesComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  searchQuery = signal('');
  selectedTag = signal('ALL');
  showNewNoteModal = signal(false);

  newNoteTitle = '';
  newNoteRelated = 'Apex Health Systems';
  newNoteType: 'Customer' | 'Lead' | 'Deal' = 'Customer';
  newNoteBody = '';
  newNotePinned = false;

  readonly allTags = ['Enterprise', 'Healthcare', 'Legal', 'Contract', 'SSO', 'Migration'];

  readonly filteredNotes = computed(() => {
    let list = this.crmData.notes();
    const q = this.searchQuery().toLowerCase().trim();
    const t = this.selectedTag();

    if (q) {
      list = list.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.relatedTo.toLowerCase().includes(q)
      );
    }

    if (t !== 'ALL') {
      list = list.filter(n => n.tags.includes(t));
    }

    return list;
  });

  saveNote(): void {
    if (!this.newNoteTitle || !this.newNoteBody) {
      this.toast.error('Validation Error', 'Title and note content are required');
      return;
    }

    this.crmData.addNote({
      title: this.newNoteTitle,
      content: this.newNoteBody,
      relatedTo: this.newNoteRelated,
      relatedType: this.newNoteType,
      createdBy: 'Alex Mercer',
      isPinned: this.newNotePinned,
      tags: ['Enterprise', 'Updated']
    });

    this.toast.success('Note Created', `${this.newNoteTitle} added to workspace.`);
    this.showNewNoteModal.set(false);
    this.newNoteTitle = '';
    this.newNoteBody = '';
  }
}
