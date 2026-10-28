import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Contact } from '../../core/models/crm.models';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Contacts Directory</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key enterprise stakeholders, technical decision-makers, and business sponsors.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button (click)="toast.success('Export Ready', 'Exported contacts to vCard / CSV format.')" class="btn-secondary text-xs">
            <app-icon name="download" [size]="14"></app-icon>
            Export
          </button>
          <button (click)="showNewContactModal.set(true)" class="btn-primary text-xs">
            <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
            Add Contact
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="crm-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="relative flex-1 max-w-sm">
          <app-icon name="search" [size]="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search contacts by name, title, or company..."
            class="crm-input pl-9 text-xs"
          />
        </div>
        <div class="text-xs text-slate-400">
          Showing <strong>{{ filteredContacts().length }}</strong> stakeholders
        </div>
      </div>

      <!-- Contacts Grid Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        @for (contact of filteredContacts(); track contact.id) {
          <div
            (click)="selectedContact.set(contact)"
            class="crm-card crm-card-interactive p-5 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div class="flex items-start justify-between">
                <img
                  [src]="contact.avatar"
                  [alt]="contact.name"
                  class="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500/60 transition-all"
                />
                <span class="badge text-[11px]" [class.badge-green]="contact.status === 'Active'" [class.badge-blue]="contact.status === 'Lead'">
                  <span class="badge-dot"></span>
                  {{ contact.status }}
                </span>
              </div>

              <div class="mt-3">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {{ contact.name }}
                </h3>
                <p class="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5 truncate">{{ contact.jobTitle }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{{ contact.company }}</p>
              </div>

              <div class="space-y-1.5 mt-4 pt-3 border-t text-xs text-slate-600 dark:text-slate-400">
                <div class="flex items-center gap-2 truncate">
                  <app-icon name="mail" [size]="13" class="text-slate-400 shrink-0"></app-icon>
                  <span class="truncate">{{ contact.email }}</span>
                </div>
                <div class="flex items-center gap-2 font-mono">
                  <app-icon name="phone" [size]="13" class="text-slate-400 shrink-0"></app-icon>
                  <span>{{ contact.phone }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-slate-400">
              <span>{{ contact.dealsCount }} deals linked</span>
              <span>Last spoke {{ contact.lastContacted }}</span>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Contact Profile Modal -->
    @if (selectedContact()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="selectedContact.set(null)">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <img [src]="selectedContact()!.avatar" class="w-14 h-14 rounded-full object-cover ring-4 ring-blue-500/20" />
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ selectedContact()!.name }}</h3>
                <p class="text-xs text-blue-600 dark:text-blue-400 font-semibold">{{ selectedContact()!.jobTitle }}</p>
                <p class="text-xs text-slate-400">{{ selectedContact()!.company }} • {{ selectedContact()!.department }}</p>
              </div>
            </div>
            <button (click)="selectedContact.set(null)" class="text-slate-400 hover:text-slate-600 p-1 rounded-md">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <div class="space-y-3 my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border text-xs">
            <div class="flex justify-between">
              <span class="text-slate-400">Direct Email:</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ selectedContact()!.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Phone:</span>
              <span class="font-mono font-bold text-slate-900 dark:text-white">{{ selectedContact()!.phone }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Status:</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ selectedContact()!.status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Active Deals:</span>
              <span class="font-bold text-blue-600 dark:text-blue-400">{{ selectedContact()!.dealsCount }} Associated Opportunities</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <button (click)="toast.info('Draft Email', 'Opening CRM mail composer...'); selectedContact.set(null)" class="btn-primary text-xs">
              <app-icon name="mail" [size]="14"></app-icon>
              Send Email
            </button>
            <button (click)="selectedContact.set(null)" class="btn-secondary text-xs">Close</button>
          </div>
        </div>
      </div>
    }

    <!-- Add Contact Modal -->
    @if (showNewContactModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="showNewContactModal.set(false)">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in" (click)="$event.stopPropagation()">
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Add Key Stakeholder</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input type="text" [(ngModel)]="newName" placeholder="e.g. Thomas Sterling" class="crm-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company</label>
                <input type="text" [(ngModel)]="newCompany" placeholder="Apex Health Systems" class="crm-input" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                <input type="text" [(ngModel)]="newTitle" placeholder="VP of Security" class="crm-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" [(ngModel)]="newEmail" placeholder="t.sterling@apexhealth.org" class="crm-input" />
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button (click)="showNewContactModal.set(false)" class="btn-secondary text-xs">Cancel</button>
            <button (click)="saveContact()" class="btn-primary text-xs">Save Contact</button>
          </div>
        </div>
      </div>
    }
  `
})
export class ContactsComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  searchQuery = signal('');
  selectedContact = signal<Contact | null>(null);
  showNewContactModal = signal(false);

  newName = '';
  newCompany = 'Apex Health Systems';
  newTitle = 'VP of Procurement';
  newEmail = '';

  readonly filteredContacts = computed(() => {
    let list = this.crmData.contacts();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.jobTitle.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    return list;
  });

  saveContact(): void {
    if (!this.newName) {
      this.toast.error('Validation Error', 'Contact name is required');
      return;
    }
    this.toast.success('Contact Added', `${this.newName} saved to stakeholder directory.`);
    this.showNewContactModal.set(false);
    this.newName = '';
  }
}
