import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { EmailMessage, EmailTemplate } from '../../core/models/crm.models';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="h-[calc(100vh-6.5rem)] flex flex-col animate-fade-in pb-4">
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 shrink-0">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Customer Communications</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Two-way email sync, enterprise email templates, and automated deliverability tracking.
          </p>
        </div>

        <button (click)="openCompose()" class="btn-primary text-xs">
          <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
          Compose Email
        </button>
      </div>

      <!-- Gmail/Superhuman-style Split Client Layout -->
      <div class="flex-1 flex rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs min-h-0">
        <!-- Left Panel: Folders & Templates Navigation -->
        <div class="w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 p-3 flex flex-col justify-between shrink-0">
          <div class="space-y-1">
            <button
              (click)="selectedFolder.set('inbox')"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              [class.bg-blue-600]="selectedFolder() === 'inbox'"
              [class.text-white]="selectedFolder() === 'inbox'"
              [class.text-slate-600]="selectedFolder() !== 'inbox'"
              [class.dark:text-slate-400]="selectedFolder() !== 'inbox'"
            >
              <div class="flex items-center gap-2.5">
                <app-icon name="mail" [size]="15"></app-icon>
                <span>Inbox</span>
              </div>
              <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full" [class.bg-blue-800]="selectedFolder() === 'inbox'" [class.bg-slate-200]="selectedFolder() !== 'inbox'">
                {{ unreadCount() }}
              </span>
            </button>

            <button
              (click)="selectedFolder.set('sent')"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              [class.bg-blue-600]="selectedFolder() === 'sent'"
              [class.text-white]="selectedFolder() === 'sent'"
              [class.text-slate-600]="selectedFolder() !== 'sent'"
              [class.dark:text-slate-400]="selectedFolder() !== 'sent'"
            >
              <div class="flex items-center gap-2.5">
                <app-icon name="arrow-up-right" [size]="15"></app-icon>
                <span>Sent</span>
              </div>
            </button>

            <button
              (click)="selectedFolder.set('drafts')"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              [class.bg-blue-600]="selectedFolder() === 'drafts'"
              [class.text-white]="selectedFolder() === 'drafts'"
              [class.text-slate-600]="selectedFolder() !== 'drafts'"
              [class.dark:text-slate-400]="selectedFolder() !== 'drafts'"
            >
              <div class="flex items-center gap-2.5">
                <app-icon name="file-text" [size]="15"></app-icon>
                <span>Drafts</span>
              </div>
              <span class="text-[10px] text-slate-400 font-mono">1</span>
            </button>

            <button
              (click)="selectedFolder.set('templates')"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              [class.bg-blue-600]="selectedFolder() === 'templates'"
              [class.text-white]="selectedFolder() === 'templates'"
              [class.text-slate-600]="selectedFolder() !== 'templates'"
              [class.dark:text-slate-400]="selectedFolder() !== 'templates'"
            >
              <div class="flex items-center gap-2.5">
                <app-icon name="sparkles" [size]="15"></app-icon>
                <span>Templates</span>
              </div>
              <span class="text-[10px] text-slate-400 font-mono">{{ crmData.emailTemplates().length }}</span>
            </button>
          </div>

          <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300">
            <span class="font-bold block mb-1">⚡ Instant Sync</span>
            <span>Connected to Google Workspace & Microsoft 365 Exchange.</span>
          </div>
        </div>

        <!-- Middle Column: Email List or Templates List -->
        @if (selectedFolder() !== 'templates') {
          <div class="w-80 md:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 min-h-0">
            <!-- Search bar in inbox -->
            <div class="p-3 border-b border-slate-200 dark:border-slate-800">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                placeholder="Search emails..."
                class="crm-input text-xs py-1.5"
              />
            </div>

            <!-- Email Items List -->
            <div class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              @for (msg of filteredEmails(); track msg.id) {
                <div
                  (click)="activeEmail.set(msg); msg.isRead = true"
                  class="p-3.5 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  [class.bg-blue-50/40]="activeEmail()?.id === msg.id"
                  [class.dark:bg-blue-950/20]="activeEmail()?.id === msg.id"
                  [class.font-semibold]="!msg.isRead"
                >
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="text-slate-900 dark:text-white truncate max-w-[170px]" [class.font-bold]="!msg.isRead">
                      {{ msg.senderName }}
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono">{{ msg.time }}</span>
                  </div>

                  <h4 class="text-xs text-slate-800 dark:text-slate-200 truncate leading-snug">
                    {{ msg.subject }}
                  </h4>

                  <p class="text-[11px] text-slate-400 line-clamp-1 mt-1 font-normal">
                    {{ msg.preview }}
                  </p>

                  <div class="flex items-center gap-2 mt-2">
                    @if (msg.tag) {
                      <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {{ msg.tag }}
                      </span>
                    }
                    @if (msg.hasAttachment) {
                      <span class="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                        📎 PDF
                      </span>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Right Column: Email Reader Thread Pane -->
          <div class="flex-1 flex flex-col overflow-y-auto p-6 min-h-0 bg-white dark:bg-slate-900">
            @if (activeEmail()) {
              <div class="space-y-6">
                <!-- Thread Header -->
                <div class="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 class="text-base font-bold text-slate-900 dark:text-white">{{ activeEmail()!.subject }}</h2>
                    <div class="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>From: <strong class="text-slate-700 dark:text-slate-300">{{ activeEmail()!.senderName }}</strong> ({{ activeEmail()!.senderEmail }})</span>
                      <span>•</span>
                      <span>{{ activeEmail()!.date }}, {{ activeEmail()!.time }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button (click)="reply()" class="btn-secondary text-xs py-1.5 px-3">
                      Reply
                    </button>
                    <button class="text-slate-400 hover:text-slate-600 p-1">
                      <app-icon name="more-vertical" [size]="16"></app-icon>
                    </button>
                  </div>
                </div>

                <!-- Message Body -->
                <div class="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {{ activeEmail()!.body }}
                </div>

                @if (activeEmail()!.hasAttachment) {
                  <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between max-w-sm">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-xs font-bold">
                        PDF
                      </div>
                      <div class="text-xs">
                        <span class="font-bold text-slate-900 dark:text-white block">Contract_Schedules_v2.pdf</span>
                        <span class="text-slate-400">1.8 MB • Verified Clean</span>
                      </div>
                    </div>
                    <button (click)="toast.info('Download', 'Downloading Contract_Schedules_v2.pdf')" class="text-blue-600 dark:text-blue-400 p-1 hover:underline text-xs font-semibold">
                      Download
                    </button>
                  </div>
                }
              </div>
            } @else {
              <div class="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
                <app-icon name="mail" [size]="40" class="text-slate-300 mb-2"></app-icon>
                <span>Select an email thread from the inbox to read.</span>
              </div>
            }
          </div>
        } @else {
          <!-- Templates Directory View -->
          <div class="flex-1 p-6 overflow-y-auto space-y-4">
            <div class="flex items-center justify-between mb-2">
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Enterprise Email Templates</h3>
                <p class="text-xs text-slate-400">Pre-approved sales & executive outreach sequences</p>
              </div>
              <button (click)="toast.info('Template Creator', 'Create new sales playbook template')" class="btn-primary text-xs">
                New Template
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (tmpl of crmData.emailTemplates(); track tmpl.id) {
                <div class="crm-card p-4 flex flex-col justify-between hover:border-blue-400 transition-all">
                  <div>
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 uppercase">
                      {{ tmpl.category }}
                    </span>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white mt-2">{{ tmpl.title }}</h4>
                    <p class="text-[11px] text-slate-400 line-clamp-3 mt-1.5 leading-relaxed">{{ tmpl.preview }}</p>
                  </div>
                  <div class="mt-4 pt-3 border-t flex items-center justify-between">
                    <button (click)="useTemplate(tmpl)" class="btn-primary text-xs py-1 px-2.5">
                      Use in Compose
                    </button>
                    <button class="text-xs text-slate-400 hover:text-slate-600">Preview</button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Compose Email Modal -->
    @if (showComposeModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="showComposeModal.set(false)">
        <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <app-icon name="mail" [size]="16" class="text-blue-600"></app-icon>
              New Message
            </h3>
            <button (click)="showComposeModal.set(false)" class="text-slate-400 hover:text-slate-600 p-1 rounded-md">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <div class="p-6 space-y-3">
            <div class="flex items-center border-b pb-2 text-xs">
              <span class="w-16 text-slate-400 font-semibold">To:</span>
              <input type="email" [(ngModel)]="composeTo" placeholder="recipient@company.com" class="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white" />
            </div>
            <div class="flex items-center border-b pb-2 text-xs">
              <span class="w-16 text-slate-400 font-semibold">Subject:</span>
              <input type="text" [(ngModel)]="composeSubject" placeholder="Proposal & Architecture Overview" class="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white font-medium" />
            </div>

            <!-- Toolbar -->
            <div class="flex items-center gap-1.5 py-1 text-slate-400 border-b text-xs">
              <button class="p-1 rounded hover:bg-slate-100 font-bold">B</button>
              <button class="p-1 rounded hover:bg-slate-100 italic">I</button>
              <button class="p-1 rounded hover:bg-slate-100 underline">U</button>
              <span class="h-3 w-px bg-slate-200 mx-1"></span>
              <button class="p-1 rounded hover:bg-slate-100 text-xs">🔗 Link</button>
              <button class="p-1 rounded hover:bg-slate-100 text-xs">📎 Attach</button>
            </div>

            <!-- Body Textarea -->
            <textarea
              [(ngModel)]="composeBody"
              rows="8"
              placeholder="Write your email here..."
              class="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-200 leading-relaxed resize-none"
            ></textarea>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
            <button (click)="toast.info('Template Inserted', 'Inserted Enterprise Demo Follow-up template'); useTemplate(crmData.emailTemplates()[0])" class="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Insert Template ⚡
            </button>

            <div class="flex items-center gap-2">
              <button (click)="showComposeModal.set(false)" class="btn-secondary text-xs">Discard</button>
              <button (click)="sendEmail()" class="btn-primary text-xs">Send Email 🚀</button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class EmailComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  selectedFolder = signal<'inbox' | 'sent' | 'drafts' | 'templates'>('inbox');
  searchQuery = signal('');
  activeEmail = signal<EmailMessage | null>(null);
  showComposeModal = signal(false);

  composeTo = 'billing@cloudscale.io';
  composeSubject = '';
  composeBody = '';

  constructor() {
    // Set initial active email
    const first = this.crmData.emails()[0];
    if (first) this.activeEmail.set(first);
  }

  readonly filteredEmails = computed(() => {
    let list = this.crmData.emails().filter(e => e.folder === this.selectedFolder());
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(e => e.subject.toLowerCase().includes(q) || e.senderName.toLowerCase().includes(q) || e.body.toLowerCase().includes(q));
    }
    return list;
  });

  unreadCount = computed(() => this.crmData.emails().filter(e => e.folder === 'inbox' && !e.isRead).length);

  openCompose(): void {
    this.composeSubject = '';
    this.composeBody = '';
    this.showComposeModal.set(true);
  }

  reply(): void {
    const cur = this.activeEmail();
    if (cur) {
      this.composeTo = cur.senderEmail;
      this.composeSubject = `Re: ${cur.subject}`;
      this.composeBody = `\n\n--- On ${cur.date}, ${cur.senderName} wrote:\n${cur.body}`;
      this.showComposeModal.set(true);
    }
  }

  useTemplate(tmpl: EmailTemplate): void {
    this.composeSubject = tmpl.subject;
    this.composeBody = tmpl.body;
    this.showComposeModal.set(true);
  }

  sendEmail(): void {
    if (!this.composeTo || !this.composeSubject) {
      this.toast.error('Validation Error', 'Recipient email and subject are required');
      return;
    }

    this.crmData.sendEmail({
      recipientEmail: this.composeTo,
      senderName: 'Alex Mercer',
      senderEmail: 'alex.mercer@nexuscrm.io',
      subject: this.composeSubject,
      preview: this.composeBody.substring(0, 100),
      body: this.composeBody,
      isStarred: false,
      tag: 'Customer'
    });

    this.toast.success('Email Sent', `Message sent to ${this.composeTo}`);
    this.showComposeModal.set(false);
  }
}
