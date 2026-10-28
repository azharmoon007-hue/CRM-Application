import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Lead, LeadStatus } from '../../core/models/crm.models';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Leads Pipeline</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Capture, score, and convert high-intent prospective buyers into contracted deals.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button (click)="toast.info('Leads Import', 'Upload leads from LinkedIn, Apollo, or CSV file.')" class="btn-secondary text-xs">
            <app-icon name="upload" [size]="14"></app-icon>
            Import
          </button>
          <button (click)="toast.success('Leads Exported', 'Leads pipeline downloaded as CSV.')" class="btn-secondary text-xs">
            <app-icon name="download" [size]="14"></app-icon>
            Export
          </button>
          <button (click)="openCreateModal()" class="btn-primary text-xs">
            <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
            Add Lead
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div class="crm-card p-3.5">
          <span class="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">NEW</span>
          <div class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ countStatus('NEW') }}</div>
        </div>
        <div class="crm-card p-3.5">
          <span class="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">CONTACTED</span>
          <div class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ countStatus('CONTACTED') }}</div>
        </div>
        <div class="crm-card p-3.5">
          <span class="text-[11px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">QUALIFIED</span>
          <div class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ countStatus('QUALIFIED') }}</div>
        </div>
        <div class="crm-card p-3.5">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">UNQUALIFIED</span>
          <div class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ countStatus('UNQUALIFIED') }}</div>
        </div>
        <div class="crm-card p-3.5">
          <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">CONVERTED</span>
          <div class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ countStatus('CONVERTED') }}</div>
        </div>
        <div class="crm-card p-3.5">
          <span class="text-[11px] font-bold text-rose-600 uppercase tracking-wider">LOST</span>
          <div class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ countStatus('LOST') }}</div>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="crm-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex flex-1 items-center gap-3">
          <div class="relative flex-1 max-w-sm">
            <app-icon name="search" [size]="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></app-icon>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search leads by name, company, email..."
              class="crm-input pl-9 text-xs"
            />
          </div>

          <select [(ngModel)]="statusFilter" class="crm-input w-40 text-xs">
            <option value="ALL">All Statuses</option>
            <option value="NEW">New (Blue)</option>
            <option value="CONTACTED">Contacted (Purple)</option>
            <option value="QUALIFIED">Qualified (Green)</option>
            <option value="UNQUALIFIED">Unqualified (Gray)</option>
            <option value="CONVERTED">Converted (Emerald)</option>
            <option value="LOST">Lost (Red)</option>
          </select>

          <select [(ngModel)]="sourceFilter" class="crm-input w-36 text-xs hidden sm:block">
            <option value="ALL">All Sources</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Advertisement">Advertisement</option>
          </select>
        </div>

        <!-- Bulk Action Controls -->
        <div class="flex items-center gap-2">
          <button (click)="toast.info('Bulk Assignment', 'Assigned 5 selected leads to Marcus Vance.')" class="btn-secondary text-xs">
            Bulk Assign
          </button>
        </div>
      </div>

      <!-- Leads Table -->
      <div class="crm-table-container">
        <table class="crm-table">
          <thead>
            <tr>
              <th class="w-10">
                <input type="checkbox" class="rounded text-blue-600 focus:ring-blue-500" />
              </th>
              <th>Lead Name</th>
              <th>Company</th>
              <th>Score</th>
              <th>Contact Info</th>
              <th>Source</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Est. Value</th>
              <th>Assigned To</th>
              <th>Closing Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (lead of filteredLeads(); track lead.id) {
              <tr class="cursor-pointer group" (click)="openLeadDetail(lead)">
                <td (click)="$event.stopPropagation()">
                  <input type="checkbox" class="rounded text-blue-600 focus:ring-blue-500" />
                </td>
                <td>
                  <div class="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {{ lead.name }}
                  </div>
                  <span class="text-[11px] text-slate-400">{{ lead.title || 'Executive Decision Maker' }}</span>
                </td>
                <td class="font-medium text-slate-700 dark:text-slate-300">
                  {{ lead.company }}
                </td>
                <td>
                  <div class="flex items-center gap-1.5">
                    <span
                      class="text-xs font-black px-1.5 py-0.5 rounded"
                      [class.bg-emerald-100]="lead.score >= 80"
                      [class.text-emerald-700]="lead.score >= 80"
                      [class.dark:bg-emerald-950/60]="lead.score >= 80"
                      [class.dark:text-emerald-300]="lead.score >= 80"
                      [class.bg-amber-100]="lead.score >= 50 && lead.score < 80"
                      [class.text-amber-700]="lead.score >= 50 && lead.score < 80"
                      [class.bg-slate-100]="lead.score < 50"
                      [class.text-slate-600]="lead.score < 50"
                    >
                      {{ lead.score }}
                    </span>
                  </div>
                </td>
                <td class="text-xs">
                  <span class="text-slate-600 dark:text-slate-300 block truncate">{{ lead.email }}</span>
                  <span class="text-slate-400 font-mono text-[11px]">{{ lead.phone }}</span>
                </td>
                <td>
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ lead.source }}</span>
                </td>
                <td>
                  <!-- Specified Color Badges:
                       NEW: Blue, CONTACTED: Purple, QUALIFIED: Green, UNQUALIFIED: Gray, CONVERTED: Emerald, LOST: Red -->
                  <span
                    class="badge text-[11px]"
                    [ngClass]="{
                      'badge-blue': lead.status === 'NEW',
                      'badge-purple': lead.status === 'CONTACTED',
                      'badge-green': lead.status === 'QUALIFIED',
                      'badge-gray': lead.status === 'UNQUALIFIED',
                      'badge-emerald': lead.status === 'CONVERTED',
                      'badge-red': lead.status === 'LOST'
                    }"
                  >
                    <span class="badge-dot"></span>
                    {{ lead.status }}
                  </span>
                </td>
                <td>
                  <span
                    class="text-[11px] font-semibold"
                    [class.text-rose-600]="lead.priority === 'Urgent'"
                    [class.text-amber-600]="lead.priority === 'High'"
                    [class.text-blue-600]="lead.priority === 'Medium'"
                    [class.text-slate-400]="lead.priority === 'Low'"
                  >
                    {{ lead.priority }}
                  </span>
                </td>
                <td class="font-mono font-bold text-slate-900 dark:text-white">
                  \${{ lead.estimatedValue | number }}
                </td>
                <td>
                  <div class="flex items-center gap-1.5">
                    <img [src]="lead.assignedAvatar" class="w-5 h-5 rounded-full object-cover" />
                    <span class="text-xs text-slate-700 dark:text-slate-300">{{ lead.assignedTo }}</span>
                  </div>
                </td>
                <td class="text-slate-400 font-mono text-xs">
                  {{ lead.expectedClosingDate }}
                </td>
                <td class="text-right" (click)="$event.stopPropagation()">
                  <button
                    (click)="startConversion(lead)"
                    class="btn-primary text-xs py-1 px-2.5 font-semibold"
                    title="Convert to Deal & Customer"
                  >
                    Convert
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Lead Detail Modal -->
    @if (selectedLead()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="selectedLead.set(null)">
        <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <div class="flex items-center gap-3">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ selectedLead()!.name }}</h3>
                <span class="badge text-xs" [ngClass]="{
                  'badge-blue': selectedLead()!.status === 'NEW',
                  'badge-purple': selectedLead()!.status === 'CONTACTED',
                  'badge-green': selectedLead()!.status === 'QUALIFIED',
                  'badge-gray': selectedLead()!.status === 'UNQUALIFIED',
                  'badge-emerald': selectedLead()!.status === 'CONVERTED',
                  'badge-red': selectedLead()!.status === 'LOST'
                }">
                  <span class="badge-dot"></span>
                  {{ selectedLead()!.status }}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {{ selectedLead()!.title }} at <strong class="text-slate-800 dark:text-slate-200">{{ selectedLead()!.company }}</strong>
              </p>
            </div>
            <button (click)="selectedLead.set(null)" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Key Scores & Metrics -->
            <div class="grid grid-cols-3 gap-4">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Lead Score</span>
                <div class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{{ selectedLead()!.score }} / 100</div>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Estimated Pipeline Value</span>
                <div class="text-xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">\${{ selectedLead()!.estimatedValue | number }}</div>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Acquisition Source</span>
                <div class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5">{{ selectedLead()!.source }}</div>
              </div>
            </div>

            <!-- Contact & Company details -->
            <div class="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span class="text-slate-400 block mb-1">Email:</span>
                <span class="font-medium text-slate-900 dark:text-white">{{ selectedLead()!.email }}</span>
              </div>
              <div>
                <span class="text-slate-400 block mb-1">Phone:</span>
                <span class="font-medium text-slate-900 dark:text-white font-mono">{{ selectedLead()!.phone }}</span>
              </div>
              <div>
                <span class="text-slate-400 block mb-1">Industry:</span>
                <span class="font-medium text-slate-900 dark:text-white">{{ selectedLead()!.industry || 'Technology' }}</span>
              </div>
              <div>
                <span class="text-slate-400 block mb-1">Target Close Date:</span>
                <span class="font-medium text-slate-900 dark:text-white font-mono">{{ selectedLead()!.expectedClosingDate }}</span>
              </div>
            </div>

            <!-- Notes Section -->
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Discovery Notes</span>
              <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{{ selectedLead()!.notes }}</p>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <button (click)="changeLeadStatus(selectedLead()!, 'QUALIFIED')" class="btn-secondary text-xs">
                Qualify
              </button>
              <button (click)="changeLeadStatus(selectedLead()!, 'LOST')" class="btn-secondary text-xs text-rose-600 hover:bg-rose-50">
                Mark Lost
              </button>
            </div>
            <button (click)="startConversion(selectedLead()!)" class="btn-primary text-xs">
              Open Conversion Wizard →
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Multi-Step Lead Conversion Wizard Modal -->
    @if (convertingLead()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="convertingLead.set(null)">
        <div class="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
          <!-- Wizard Header with Step Progress -->
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Convert Lead: {{ convertingLead()!.name }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Transform qualified lead into a permanent Customer, Contact, and Opportunity</p>

            <div class="flex items-center justify-between mt-6">
              <div class="flex items-center gap-2 text-xs font-semibold" [class.text-blue-600]="wizardStep() >= 1" [class.text-slate-400]="wizardStep() < 1">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs" [ngClass]="wizardStep() >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'">1</span>
                <span>Customer Account</span>
              </div>
              <div class="h-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mx-3"></div>
              <div class="flex items-center gap-2 text-xs font-semibold" [class.text-blue-600]="wizardStep() >= 2" [class.text-slate-400]="wizardStep() < 2">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs" [ngClass]="wizardStep() >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'">2</span>
                <span>Primary Contact</span>
              </div>
              <div class="h-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mx-3"></div>
              <div class="flex items-center gap-2 text-xs font-semibold" [class.text-blue-600]="wizardStep() >= 3" [class.text-slate-400]="wizardStep() < 3">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs" [ngClass]="wizardStep() >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'">3</span>
                <span>Deal Creation</span>
              </div>
            </div>
          </div>

          <!-- Wizard Body -->
          <div class="p-6">
            @if (wizardStep() === 1) {
              <div class="space-y-4">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Create Enterprise Account</h4>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                  <input type="text" [(ngModel)]="conversionForm.companyName" class="crm-input" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                    <input type="text" [(ngModel)]="conversionForm.industry" class="crm-input" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Owner</label>
                    <input type="text" [(ngModel)]="conversionForm.owner" class="crm-input" />
                  </div>
                </div>
              </div>
            }

            @if (wizardStep() === 2) {
              <div class="space-y-4">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Confirm Contact Record</h4>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Name</label>
                  <input type="text" [(ngModel)]="conversionForm.contactName" class="crm-input" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input type="email" [(ngModel)]="conversionForm.email" class="crm-input" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                    <input type="text" [(ngModel)]="conversionForm.phone" class="crm-input" />
                  </div>
                </div>
              </div>
            }

            @if (wizardStep() === 3) {
              <div class="space-y-4">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Configure Initial Deal</h4>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deal Title</label>
                  <input type="text" [(ngModel)]="conversionForm.dealName" class="crm-input" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deal Value (\$$)</label>
                    <input type="number" [(ngModel)]="conversionForm.dealValue" class="crm-input" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pipeline Stage</label>
                    <input type="text" value="Proposal (60% probability)" disabled class="crm-input bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Wizard Footer Controls -->
          <div class="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
            <button
              (click)="wizardStep.set(wizardStep() - 1)"
              [disabled]="wizardStep() === 1"
              class="btn-secondary text-xs"
            >
              Previous
            </button>

            @if (wizardStep() < 3) {
              <button (click)="wizardStep.set(wizardStep() + 1)" class="btn-primary text-xs">
                Continue to Step {{ wizardStep() + 1 }} →
              </button>
            } @else {
              <button (click)="completeConversion()" class="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700">
                Confirm & Convert Lead
              </button>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class LeadsComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  searchQuery = signal('');
  statusFilter = signal('ALL');
  sourceFilter = signal('ALL');

  selectedLead = signal<Lead | null>(null);
  convertingLead = signal<Lead | null>(null);
  wizardStep = signal(1);

  conversionForm = {
    companyName: '',
    industry: 'Technology',
    owner: 'Alex Mercer',
    contactName: '',
    email: '',
    phone: '',
    dealName: '',
    dealValue: 50000
  };

  readonly filteredLeads = computed(() => {
    let list = this.crmData.leads();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();
    const src = this.sourceFilter();

    if (q) {
      list = list.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }

    if (st !== 'ALL') {
      list = list.filter(l => l.status === st);
    }

    if (src !== 'ALL') {
      list = list.filter(l => l.source === src);
    }

    return list;
  });

  countStatus(status: LeadStatus): number {
    return this.crmData.leads().filter(l => l.status === status).length;
  }

  openLeadDetail(lead: Lead): void {
    this.selectedLead.set(lead);
  }

  changeLeadStatus(lead: Lead, status: LeadStatus): void {
    this.crmData.updateLeadStatus(lead.id, status);
    this.toast.success('Status Updated', `${lead.name} marked as ${status}`);
    this.selectedLead.set(null);
  }

  openCreateModal(): void {
    this.toast.info('Quick Create', 'Use the top "+ Create" button or shortcut ⌘K.');
  }

  startConversion(lead: Lead): void {
    this.selectedLead.set(null);
    this.convertingLead.set(lead);
    this.wizardStep.set(1);
    this.conversionForm = {
      companyName: lead.company,
      industry: lead.industry || 'Technology & Cloud',
      owner: lead.assignedTo,
      contactName: lead.name,
      email: lead.email,
      phone: lead.phone,
      dealName: `${lead.company} Enterprise SaaS Contract`,
      dealValue: lead.estimatedValue || 65000
    };
  }

  completeConversion(): void {
    const lead = this.convertingLead();
    if (!lead) return;

    this.crmData.convertLeadToDeal(lead.id, this.conversionForm.dealName, this.conversionForm.dealValue);
    this.toast.success('Lead Converted!', `${lead.name} successfully converted to Customer and Deal #${this.conversionForm.dealName}`);
    this.convertingLead.set(null);
  }
}
