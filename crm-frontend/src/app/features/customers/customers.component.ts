import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Customer, CustomerStatus } from '../../core/models/crm.models';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Customers</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your account relationships, contracts, and enterprise customer profiles.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button (click)="importCustomers()" class="btn-secondary text-xs">
            <app-icon name="upload" [size]="14"></app-icon>
            Import
          </button>
          <button (click)="exportCustomers()" class="btn-secondary text-xs">
            <app-icon name="download" [size]="14"></app-icon>
            Export
          </button>
          <button (click)="showAddModal.set(true)" class="btn-primary text-xs">
            <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
            Add Customer
          </button>
        </div>
      </div>

      <!-- Top KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="crm-card p-4">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Total Customers</span>
          <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">12,480</div>
          <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
            <app-icon name="arrow-up-right" [size]="12"></app-icon> +12.5% this quarter
          </span>
        </div>
        <div class="crm-card p-4">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Active Customers</span>
          <div class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">11,850</div>
          <span class="text-[11px] text-slate-400 mt-1 block">94.9% retention rate</span>
        </div>
        <div class="crm-card p-4">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Prospects</span>
          <div class="text-2xl font-black text-amber-500 mt-1">480</div>
          <span class="text-[11px] text-slate-400 mt-1 block">In evaluation cycle</span>
        </div>
        <div class="crm-card p-4">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Churned Customers</span>
          <div class="text-2xl font-black text-rose-500 mt-1">150</div>
          <span class="text-[11px] text-slate-400 mt-1 block">1.2% annualized churn</span>
        </div>
      </div>

      <!-- Search & Filter Toolbar -->
      <div class="crm-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex flex-1 items-center gap-3">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-sm">
            <app-icon name="search" [size]="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></app-icon>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search by company, code, or email..."
              class="crm-input pl-9 text-xs"
            />
          </div>

          <!-- Status Filter -->
          <select [(ngModel)]="statusFilter" class="crm-input w-36 text-xs">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PROSPECT">Prospect</option>
            <option value="CHURNED">Churned</option>
          </select>

          <!-- Industry Filter -->
          <select [(ngModel)]="industryFilter" class="crm-input w-44 text-xs hidden lg:block">
            <option value="ALL">All Industries</option>
            <option value="Technology & Cloud">Technology & Cloud</option>
            <option value="Healthcare & Pharma">Healthcare & Pharma</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Logistics & Supply">Logistics & Supply</option>
            <option value="Clean Energy">Clean Energy</option>
          </select>
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-400">
          <span>Showing <strong>{{ filteredCustomers().length }}</strong> of {{ crmData.customers().length }} accounts</span>
        </div>
      </div>

      <!-- Customer Table -->
      <div class="crm-table-container">
        <table class="crm-table">
          <thead>
            <tr>
              <th class="w-10">
                <input type="checkbox" class="rounded text-blue-600 focus:ring-blue-500" />
              </th>
              <th>Customer</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Industry</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (cust of filteredCustomers(); track cust.id) {
              <tr class="cursor-pointer group" (click)="openDetail(cust)">
                <td (click)="$event.stopPropagation()">
                  <input type="checkbox" class="rounded text-blue-600 focus:ring-blue-500" />
                </td>
                <td>
                  <div class="flex items-center gap-3">
                    <img [src]="cust.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=64'" class="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    <div>
                      <div class="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {{ cust.name }}
                      </div>
                      <span class="text-[11px] font-mono text-slate-400">{{ cust.code }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-slate-600 dark:text-slate-300 font-medium">
                  {{ cust.company }}
                </td>
                <td class="text-slate-500 dark:text-slate-400 text-xs">
                  {{ cust.email }}
                </td>
                <td class="text-slate-500 dark:text-slate-400 font-mono text-xs">
                  {{ cust.phone }}
                </td>
                <td>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                    {{ cust.industry }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge text-[11px]"
                    [ngClass]="{
                      'badge-green': cust.status === 'ACTIVE',
                      'badge-amber': cust.status === 'PROSPECT',
                      'badge-red': cust.status === 'CHURNED',
                      'badge-gray': cust.status === 'INACTIVE'
                    }"
                  >
                    <span class="badge-dot"></span>
                    {{ cust.status }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-1.5">
                    <img [src]="cust.assignedAvatar" class="w-5 h-5 rounded-full object-cover" />
                    <span class="text-xs text-slate-700 dark:text-slate-300">{{ cust.assignedTo }}</span>
                  </div>
                </td>
                <td class="text-slate-400 font-mono text-xs">
                  {{ cust.createdDate }}
                </td>
                <td class="text-right" (click)="$event.stopPropagation()">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      (click)="openDetail(cust)"
                      class="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="View Details"
                    >
                      <app-icon name="chevron-right" [size]="16"></app-icon>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
        <span>Showing 1 to {{ filteredCustomers().length }} of 12,480 accounts</span>
        <div class="flex items-center gap-1.5">
          <button class="btn-secondary text-xs py-1 px-2.5" disabled>Previous</button>
          <button class="btn-primary text-xs py-1 px-2.5">1</button>
          <button class="btn-secondary text-xs py-1 px-2.5">2</button>
          <button class="btn-secondary text-xs py-1 px-2.5">3</button>
          <button class="btn-secondary text-xs py-1 px-2.5">Next</button>
        </div>
      </div>
    </div>

    <!-- Customer Details Drawer / Modal -->
    @if (selectedCustomer()) {
      <div class="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="selectedCustomer.set(null)">
        <div
          class="w-full max-w-3xl h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in"
          (click)="$event.stopPropagation()"
        >
          <!-- Drawer Header with Profile Details -->
          <div class="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <img [src]="selectedCustomer()!.logoUrl" class="w-14 h-14 rounded-xl object-cover border shadow-sm" />
                <div>
                  <div class="flex items-center gap-2.5">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ selectedCustomer()!.name }}</h2>
                    <span class="badge badge-green text-xs">
                      <span class="badge-dot"></span>
                      {{ selectedCustomer()!.status }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span class="font-mono">{{ selectedCustomer()!.code }}</span>
                    <span>•</span>
                    <span>{{ selectedCustomer()!.industry }}</span>
                    <span>•</span>
                    <a [href]="selectedCustomer()!.website" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">Website ↗</a>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button (click)="toast.success('Customer Updated', 'Profile changes saved.')" class="btn-secondary text-xs py-1.5 px-3">
                  <app-icon name="edit" [size]="14"></app-icon>
                  Edit
                </button>
                <button (click)="selectedCustomer.set(null)" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
                  <app-icon name="x" [size]="18"></app-icon>
                </button>
              </div>
            </div>

            <!-- Tab Navigation (9 Tabs) -->
            <div class="flex overflow-x-auto gap-4 mt-6 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold scrollbar-none">
              @for (tab of detailTabs; track tab) {
                <button
                  (click)="activeDetailTab.set(tab)"
                  class="pb-2.5 border-b-2 transition-all whitespace-nowrap"
                  [class.border-blue-600]="activeDetailTab() === tab"
                  [class.text-blue-600]="activeDetailTab() === tab"
                  [class.dark:text-blue-400]="activeDetailTab() === tab"
                  [class.border-transparent]="activeDetailTab() !== tab"
                  [class.text-slate-400]="activeDetailTab() !== tab"
                >
                  {{ tab }}
                </button>
              }
            </div>
          </div>

          <!-- Drawer Content by Tab -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            @if (activeDetailTab() === 'Overview') {
              <!-- Highlights Grid -->
              <div class="grid grid-cols-3 gap-4">
                <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span class="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Annual Revenue</span>
                  <div class="text-lg font-bold text-slate-900 dark:text-white mt-1 font-mono">\${{ selectedCustomer()!.annualRevenue | number }}</div>
                </div>
                <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span class="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Active Deals</span>
                  <div class="text-lg font-bold text-slate-900 dark:text-white mt-1">{{ selectedCustomer()!.totalDeals }} contracts</div>
                </div>
                <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span class="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Account Executive</span>
                  <div class="text-xs font-bold text-slate-900 dark:text-white mt-1.5 flex items-center gap-1.5">
                    <img [src]="selectedCustomer()!.assignedAvatar" class="w-4 h-4 rounded-full" />
                    {{ selectedCustomer()!.assignedTo }}
                  </div>
                </div>
              </div>

              <!-- Company Information -->
              <div class="space-y-3">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Company Information</h4>
                <div class="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span class="text-slate-400 block mb-1">Billing Email:</span>
                    <span class="font-medium text-slate-900 dark:text-white">{{ selectedCustomer()!.email }}</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block mb-1">Direct Phone:</span>
                    <span class="font-medium text-slate-900 dark:text-white font-mono">{{ selectedCustomer()!.phone }}</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block mb-1">Headquarters:</span>
                    <span class="font-medium text-slate-900 dark:text-white">{{ selectedCustomer()!.address }}</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block mb-1">Customer Since:</span>
                    <span class="font-medium text-slate-900 dark:text-white font-mono">{{ selectedCustomer()!.createdDate }}</span>
                  </div>
                </div>
              </div>

              <!-- Associated Deals -->
              <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Associated Deals</h4>
                @for (deal of crmData.deals(); track deal.id) {
                  @if (deal.customerName === selectedCustomer()!.name || deal.customerId === selectedCustomer()!.id) {
                    <div class="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/30">
                      <div>
                        <span class="text-xs font-bold text-slate-900 dark:text-white">{{ deal.name }}</span>
                        <span class="text-[11px] text-slate-400 block mt-0.5">Stage: {{ deal.stage }} ({{ deal.probability }}% probability)</span>
                      </div>
                      <span class="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">\${{ deal.value | number }}</span>
                    </div>
                  }
                }
              </div>

              <!-- Activity Timeline -->
              <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Customer Interactions</h4>
                @for (act of crmData.activities(); track act.id) {
                  @if (act.customerName === selectedCustomer()!.name) {
                    <div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                      <div class="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0 text-xs">
                        <app-icon name="calendar" [size]="12"></app-icon>
                      </div>
                      <div class="text-xs">
                        <p class="font-bold text-slate-900 dark:text-white">{{ act.title }}</p>
                        <p class="text-slate-500 mt-0.5">{{ act.description }}</p>
                        <span class="text-[10px] text-slate-400 mt-1 block">{{ act.date }} • by {{ act.assignedTo }}</span>
                      </div>
                    </div>
                  }
                }
              </div>
            } @else {
              <!-- Generic Tab Preview -->
              <div class="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <app-icon name="file-text" [size]="32" class="text-slate-400 mx-auto mb-2"></app-icon>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ activeDetailTab() }} Records</h4>
                <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  All synced {{ activeDetailTab().toLowerCase() }} history for {{ selectedCustomer()!.name }} are recorded in accordance with enterprise data retention rules.
                </p>
                <button class="btn-primary text-xs mt-4">Add {{ activeDetailTab() }} Entry</button>
              </div>
            }
          </div>
        </div>
      </div>
    }

    <!-- Add Customer Modal -->
    @if (showAddModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="showAddModal.set(false)">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in" (click)="$event.stopPropagation()">
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Add New Enterprise Customer</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
              <input type="text" [(ngModel)]="newCustomerName" placeholder="e.g. Helix BioTechnologies" class="crm-input" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Billing Email</label>
                <input type="email" [(ngModel)]="newCustomerEmail" placeholder="billing@helixbio.com" class="crm-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                <select [(ngModel)]="newCustomerIndustry" class="crm-input">
                  <option value="Technology & Cloud">Technology & Cloud</option>
                  <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Logistics & Supply">Logistics & Supply</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button (click)="showAddModal.set(false)" class="btn-secondary text-xs">Cancel</button>
            <button (click)="saveNewCustomer()" class="btn-primary text-xs">Save Customer</button>
          </div>
        </div>
      </div>
    }
  `
})
export class CustomersComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  searchQuery = signal('');
  statusFilter = signal('ALL');
  industryFilter = signal('ALL');

  selectedCustomer = signal<Customer | null>(null);
  activeDetailTab = signal('Overview');
  showAddModal = signal(false);

  newCustomerName = '';
  newCustomerEmail = '';
  newCustomerIndustry = 'Technology & Cloud';

  readonly detailTabs = [
    'Overview',
    'Contacts',
    'Deals',
    'Activities',
    'Tasks',
    'Notes',
    'Emails',
    'Files',
    'History'
  ];

  readonly filteredCustomers = computed(() => {
    let list = this.crmData.customers();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();
    const ind = this.industryFilter();

    if (q) {
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q)
      );
    }

    if (st !== 'ALL') {
      list = list.filter(c => c.status === st);
    }

    if (ind !== 'ALL') {
      list = list.filter(c => c.industry === ind);
    }

    return list;
  });

  openDetail(cust: Customer): void {
    this.selectedCustomer.set(cust);
    this.activeDetailTab.set('Overview');
  }

  saveNewCustomer(): void {
    if (!this.newCustomerName) {
      this.toast.error('Validation Error', 'Company name is required');
      return;
    }

    this.crmData.addCustomer({
      name: this.newCustomerName,
      company: `${this.newCustomerName} Corp`,
      email: this.newCustomerEmail || 'contact@example.com',
      phone: '+1 (555) 019-9021',
      industry: this.newCustomerIndustry,
      status: 'ACTIVE',
      assignedTo: 'Alex Mercer',
      annualRevenue: 300000,
      totalDeals: 1,
      website: 'https://example.com',
      address: 'San Francisco, CA'
    });

    this.toast.success('Customer Added', `${this.newCustomerName} added to accounts database.`);
    this.showAddModal.set(false);
    this.newCustomerName = '';
    this.newCustomerEmail = '';
  }

  importCustomers(): void {
    this.toast.info('Customer Import', 'CSV / Excel template ready for drag-and-drop upload.');
  }

  exportCustomers(): void {
    this.toast.success('Export Ready', 'Exported 12,480 customer records to Excel spreadsheet.');
  }
}
