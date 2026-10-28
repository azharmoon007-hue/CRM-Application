import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmDataService } from '../../../core/services/crm-data.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-quick-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="close()">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <app-icon name="plus" [size]="18"></app-icon>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Quick Create</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Add a new record to your CRM pipeline</p>
              </div>
            </div>
            <button (click)="close()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <!-- Type Selector Tabs -->
          <div class="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-800/20">
            <button
              (click)="activeTab = 'lead'"
              class="py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5"
              [class.border-blue-600]="activeTab === 'lead'"
              [class.text-blue-600]="activeTab === 'lead'"
              [class.dark:text-blue-400]="activeTab === 'lead'"
              [class.border-transparent]="activeTab !== 'lead'"
              [class.text-slate-500]="activeTab !== 'lead'"
            >
              <app-icon name="target" [size]="14"></app-icon>
              Lead
            </button>
            <button
              (click)="activeTab = 'deal'"
              class="py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5"
              [class.border-blue-600]="activeTab === 'deal'"
              [class.text-blue-600]="activeTab === 'deal'"
              [class.dark:text-blue-400]="activeTab === 'deal'"
              [class.border-transparent]="activeTab !== 'deal'"
              [class.text-slate-500]="activeTab !== 'deal'"
            >
              <app-icon name="briefcase" [size]="14"></app-icon>
              Deal
            </button>
            <button
              (click)="activeTab = 'customer'"
              class="py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5"
              [class.border-blue-600]="activeTab === 'customer'"
              [class.text-blue-600]="activeTab === 'customer'"
              [class.dark:text-blue-400]="activeTab === 'customer'"
              [class.border-transparent]="activeTab !== 'customer'"
              [class.text-slate-500]="activeTab !== 'customer'"
            >
              <app-icon name="users" [size]="14"></app-icon>
              Customer
            </button>
            <button
              (click)="activeTab = 'task'"
              class="py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5"
              [class.border-blue-600]="activeTab === 'task'"
              [class.text-blue-600]="activeTab === 'task'"
              [class.dark:text-blue-400]="activeTab === 'task'"
              [class.border-transparent]="activeTab !== 'task'"
              [class.text-slate-500]="activeTab !== 'task'"
            >
              <app-icon name="check-square" [size]="14"></app-icon>
              Task
            </button>
          </div>

          <!-- Form Body -->
          <div class="p-6">
            @if (activeTab === 'lead') {
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Lead Name</label>
                    <input type="text" [(ngModel)]="leadForm.name" placeholder="e.g. Liam Gallagher" class="crm-input" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company</label>
                    <input type="text" [(ngModel)]="leadForm.company" placeholder="e.g. Horizon Labs" class="crm-input" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                    <input type="email" [(ngModel)]="leadForm.email" placeholder="liam@horizonlabs.com" class="crm-input" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Est. Value (\$$)</label>
                    <input type="number" [(ngModel)]="leadForm.estimatedValue" placeholder="50000" class="crm-input" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Lead Source</label>
                    <select [(ngModel)]="leadForm.source" class="crm-input">
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Partner">Partner</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                    <select [(ngModel)]="leadForm.priority" class="crm-input">
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            }

            @if (activeTab === 'deal') {
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Opportunity Title</label>
                  <input type="text" [(ngModel)]="dealForm.name" placeholder="e.g. Global 500-Seat Expansion" class="crm-input" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Customer Name</label>
                    <input type="text" [(ngModel)]="dealForm.customerName" placeholder="e.g. Apex Health Systems" class="crm-input" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Deal Value (\$$)</label>
                    <input type="number" [(ngModel)]="dealForm.value" placeholder="85000" class="crm-input" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Initial Stage</label>
                    <select [(ngModel)]="dealForm.stage" class="crm-input">
                      <option value="Lead">Lead</option>
                      <option value="Qualification">Qualification</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Negotiation">Negotiation</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Close Date</label>
                    <input type="date" [(ngModel)]="dealForm.expectedCloseDate" class="crm-input" />
                  </div>
                </div>
              </div>
            }

            @if (activeTab === 'customer') {
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Customer Name</label>
                    <input type="text" [(ngModel)]="custForm.name" placeholder="Acme Global Inc" class="crm-input" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company Legal Name</label>
                    <input type="text" [(ngModel)]="custForm.company" placeholder="Acme Global Holdings" class="crm-input" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contact Email</label>
                    <input type="email" [(ngModel)]="custForm.email" placeholder="contact@acme.com" class="crm-input" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Industry</label>
                    <select [(ngModel)]="custForm.industry" class="crm-input">
                      <option value="Technology & Cloud">Technology & Cloud</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                      <option value="Logistics & Supply">Logistics & Supply</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  </div>
                </div>
              </div>
            }

            @if (activeTab === 'task') {
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Task Description</label>
                  <input type="text" [(ngModel)]="taskForm.title" placeholder="e.g. Schedule architecture sync with CIO" class="crm-input" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Due Date</label>
                    <input type="text" [(ngModel)]="taskForm.dueDate" placeholder="Tomorrow, 2:00 PM" class="crm-input" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                    <select [(ngModel)]="taskForm.priority" class="crm-input">
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
            <button (click)="close()" class="btn-secondary text-xs">Cancel</button>
            <button (click)="submit()" class="btn-primary text-xs">Create {{ activeTab | uppercase }}</button>
          </div>
        </div>
      </div>
    }
  `
})
export class QuickCreateModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  private crmData = inject(CrmDataService);
  private toast = inject(ToastService);

  activeTab: 'lead' | 'deal' | 'customer' | 'task' = 'lead';

  leadForm = {
    name: '',
    company: '',
    email: '',
    estimatedValue: 45000,
    source: 'Website' as const,
    priority: 'High' as const
  };

  dealForm = {
    name: '',
    customerName: 'CloudScale Dynamics',
    value: 75000,
    stage: 'Qualification' as const,
    expectedCloseDate: '2024-12-15'
  };

  custForm = {
    name: '',
    company: '',
    email: '',
    industry: 'Technology & Cloud'
  };

  taskForm = {
    title: '',
    dueDate: 'Today, 5:00 PM',
    priority: 'High' as const
  };

  close(): void {
    this.closeEvent.emit();
  }

  submit(): void {
    if (this.activeTab === 'lead') {
      if (!this.leadForm.name || !this.leadForm.company) {
        this.toast.error('Validation Error', 'Please specify lead name and company');
        return;
      }
      this.crmData.addLead({
        name: this.leadForm.name,
        company: this.leadForm.company,
        email: this.leadForm.email || `${this.leadForm.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: '+1 (555) 019-2834',
        source: this.leadForm.source,
        status: 'NEW',
        priority: this.leadForm.priority,
        estimatedValue: this.leadForm.estimatedValue,
        score: 85,
        assignedTo: 'Alex Mercer',
        expectedClosingDate: '2024-12-31'
      });
      this.toast.success('Lead Created', `${this.leadForm.name} added to pipeline`);
    } else if (this.activeTab === 'deal') {
      if (!this.dealForm.name) {
        this.toast.error('Validation Error', 'Please specify deal name');
        return;
      }
      this.crmData.addDeal({
        name: this.dealForm.name,
        customerId: 'cust-1',
        customerName: this.dealForm.customerName,
        value: this.dealForm.value,
        pipeline: 'Enterprise SaaS',
        stage: this.dealForm.stage,
        probability: 50,
        assignedTo: 'Alex Mercer',
        expectedCloseDate: this.dealForm.expectedCloseDate,
        status: 'OPEN',
        priority: 'High'
      });
      this.toast.success('Deal Created', `${this.dealForm.name} added to pipeline`);
    } else if (this.activeTab === 'customer') {
      if (!this.custForm.name) {
        this.toast.error('Validation Error', 'Please specify customer name');
        return;
      }
      this.crmData.addCustomer({
        name: this.custForm.name,
        company: this.custForm.company || this.custForm.name,
        email: this.custForm.email || 'info@company.com',
        phone: '+1 (555) 441-9012',
        industry: this.custForm.industry,
        status: 'ACTIVE',
        assignedTo: 'Alex Mercer',
        annualRevenue: 250000,
        totalDeals: 1,
        website: 'https://example.com',
        address: 'San Francisco, CA'
      });
      this.toast.success('Customer Created', `${this.custForm.name} created successfully`);
    } else if (this.activeTab === 'task') {
      if (!this.taskForm.title) {
        this.toast.error('Validation Error', 'Please specify task title');
        return;
      }
      this.crmData.addTask({
        title: this.taskForm.title,
        assignedTo: 'Alex Mercer',
        dueDate: this.taskForm.dueDate,
        priority: this.taskForm.priority,
        status: 'Todo'
      });
      this.toast.success('Task Created', 'New task added to your backlog');
    }

    this.close();
  }
}
