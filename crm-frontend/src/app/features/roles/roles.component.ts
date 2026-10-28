import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">Roles & Permissions Matrix</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Granular role-based access control (RBAC) policies across CRM data modules.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button (click)="savePermissions()" class="btn-primary text-xs">
            Save Permissions Policy
          </button>
        </div>
      </div>

      <!-- Role Selector Strip -->
      <div class="crm-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <span class="text-slate-400 mr-2 text-[11px] font-bold uppercase">Configuring Role:</span>
          @for (role of availableRoles; track role) {
            <button
              (click)="selectedRole.set(role)"
              class="px-3 py-1.5 rounded-lg transition-all"
              [class.bg-blue-600]="selectedRole() === role"
              [class.text-white]="selectedRole() === role"
              [class.bg-slate-100]="selectedRole() !== role"
              [class.dark:bg-slate-800]="selectedRole() !== role"
              [class.text-slate-700]="selectedRole() !== role"
              [class.dark:text-slate-300]="selectedRole() !== role"
            >
              {{ role }}
            </button>
          }
        </div>

        <div class="text-xs text-slate-400 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Applied to 18 active directory members</span>
        </div>
      </div>

      <!-- Permissions Matrix Table -->
      <div class="crm-table-container">
        <table class="crm-table">
          <thead>
            <tr>
              <th class="w-64">CRM Module / Domain</th>
              <th class="text-center w-28">View</th>
              <th class="text-center w-28">Create</th>
              <th class="text-center w-28">Update</th>
              <th class="text-center w-28">Delete</th>
              <th class="text-center w-28">Export</th>
            </tr>
          </thead>
          <tbody>
            @for (row of crmData.permissionsMatrix(); track row.module) {
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td>
                  <span class="font-bold text-slate-900 dark:text-white block text-sm">{{ row.module }}</span>
                  <span class="text-[11px] text-slate-400">Policies for {{ row.module.toLowerCase() }} dataset</span>
                </td>

                <!-- View Toggle -->
                <td class="text-center">
                  <input
                    type="checkbox"
                    [checked]="row.view"
                    (change)="crmData.togglePermission(row.module, 'view')"
                    class="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </td>

                <!-- Create Toggle -->
                <td class="text-center">
                  <input
                    type="checkbox"
                    [checked]="row.create"
                    (change)="crmData.togglePermission(row.module, 'create')"
                    class="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </td>

                <!-- Update Toggle -->
                <td class="text-center">
                  <input
                    type="checkbox"
                    [checked]="row.update"
                    (change)="crmData.togglePermission(row.module, 'update')"
                    class="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </td>

                <!-- Delete Toggle -->
                <td class="text-center">
                  <input
                    type="checkbox"
                    [checked]="row.delete"
                    (change)="crmData.togglePermission(row.module, 'delete')"
                    class="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                  />
                </td>

                <!-- Export Toggle -->
                <td class="text-center">
                  <input
                    type="checkbox"
                    [checked]="row.export"
                    (change)="crmData.togglePermission(row.module, 'export')"
                    class="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Matrix Footnote / Info -->
      <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start gap-3">
        <app-icon name="shield-check" [size]="20" class="text-blue-600 shrink-0 mt-0.5"></app-icon>
        <div class="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p class="font-bold text-slate-900 dark:text-white">Security Compliance Note</p>
          <p>
            Changes to the permission matrix are audited with immutable timestamping and logged in the SOC 2 compliance trail.
            Deleting customer records requires explicit Two-Factor Authentication approval for non-admin roles.
          </p>
        </div>
      </div>
    </div>
  `
})
export class RolesComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  readonly availableRoles = [
    'Super Administrator',
    'Sales Manager',
    'Sales Representative',
    'Support Agent',
    'Marketing Team',
    'Executive'
  ];

  selectedRole = signal('Super Administrator');

  savePermissions(): void {
    this.toast.success(
      'Permissions Policy Saved',
      `RBAC matrix for "${this.selectedRole()}" applied across all active instances.`
    );
  }
}
