import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CrmDataService } from '../../core/services/crm-data.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { UserProfile, RoleType } from '../../core/models/crm.models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">User Administration</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage organization members, seat allocations, SSO directory status, and designations.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <a routerLink="/roles" class="btn-secondary text-xs">
            <app-icon name="shield-check" [size]="14"></app-icon>
            Roles & Permissions
          </a>
          <button (click)="showNewUserModal.set(true)" class="btn-primary text-xs">
            <app-icon name="plus" [size]="14" strokeWidth="2.5"></app-icon>
            Invite User
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
            placeholder="Search by name, email, department, or role..."
            class="crm-input pl-9 text-xs"
          />
        </div>
        <div class="text-xs text-slate-400">
          Showing <strong>{{ filteredUsers().length }}</strong> licensed enterprise seats
        </div>
      </div>

      <!-- Users Table -->
      <div class="crm-table-container">
        <table class="crm-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Assigned Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of filteredUsers(); track user.id) {
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td>
                  <div class="flex items-center gap-3">
                    <img [src]="user.avatar" class="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20" />
                    <div>
                      <span class="font-bold text-slate-900 dark:text-white block">{{ user.name }}</span>
                      <span class="text-[11px] text-slate-400 font-mono">ID: {{ user.id }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-xs text-slate-600 dark:text-slate-300">{{ user.email }}</td>
                <td class="text-xs text-slate-600 dark:text-slate-300">{{ user.department }}</td>
                <td class="text-xs font-medium text-slate-800 dark:text-slate-200">{{ user.designation }}</td>
                <td>
                  <span
                    class="badge text-[11px]"
                    [ngClass]="{
                      'badge-blue': user.role === 'SUPER_ADMIN',
                      'badge-purple': user.role === 'SALES_MANAGER',
                      'badge-green': user.role === 'SALES_REP',
                      'badge-amber': user.role === 'SUPPORT_AGENT'
                    }"
                  >
                    <span class="badge-dot"></span>
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-green text-xs">
                    <span class="badge-dot"></span>
                    {{ user.status }}
                  </span>
                </td>
                <td class="text-xs text-slate-400 font-mono">{{ user.lastLogin }}</td>
                <td class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      (click)="toggleUserStatus(user)"
                      class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      (click)="deactivateUser(user)"
                      class="text-xs text-slate-400 hover:text-rose-600 transition-colors"
                      title="Deactivate Account"
                    >
                      <app-icon name="trash" [size]="14"></app-icon>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invite User Modal -->
    @if (showNewUserModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" (click)="showNewUserModal.set(false)">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in" (click)="$event.stopPropagation()">
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Invite Organization Member</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input type="text" [(ngModel)]="newName" placeholder="e.g. Jordan Mitchell" class="crm-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
                <input type="email" [(ngModel)]="newEmail" placeholder="jordan@nexuscrm.io" class="crm-input" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <input type="text" [(ngModel)]="newDept" placeholder="Enterprise Sales" class="crm-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Assignment</label>
                <select [(ngModel)]="newRole" class="crm-input">
                  <option value="SUPER_ADMIN">Super Administrator</option>
                  <option value="SALES_MANAGER">Sales Manager</option>
                  <option value="SALES_REP">Sales Representative</option>
                  <option value="SUPPORT_AGENT">Support Agent</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button (click)="showNewUserModal.set(false)" class="btn-secondary text-xs">Cancel</button>
            <button (click)="saveUser()" class="btn-primary text-xs">Send Invitation</button>
          </div>
        </div>
      </div>
    }
  `
})
export class UsersComponent {
  readonly crmData = inject(CrmDataService);
  readonly toast = inject(ToastService);

  searchQuery = signal('');
  showNewUserModal = signal(false);

  newName = '';
  newEmail = '';
  newDept = 'Enterprise Sales';
  newRole: RoleType = 'SALES_REP';

  readonly filteredUsers = computed(() => {
    let list = this.crmData.users();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }
    return list;
  });

  toggleUserStatus(user: UserProfile): void {
    this.toast.info('User Profile', `Viewing permissions for ${user.name}`);
  }

  deactivateUser(user: UserProfile): void {
    this.toast.warning('Account Action', `${user.name}'s session has been suspended.`);
  }

  saveUser(): void {
    if (!this.newName || !this.newEmail) {
      this.toast.error('Validation Error', 'Name and corporate email are required');
      return;
    }
    this.toast.success('Invitation Dispatched', `SSO invitation emailed to ${this.newEmail}.`);
    this.showNewUserModal.set(false);
    this.newName = '';
    this.newEmail = '';
  }
}
