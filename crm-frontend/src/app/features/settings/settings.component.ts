import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-page-heading text-slate-900 dark:text-white">System Settings</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Personalize your workspace, security authenticators, API credentials, and notifications.
          </p>
        </div>

        <button (click)="saveSettings()" class="btn-primary text-xs">
          Save Preferences
        </button>
      </div>

      <!-- Settings Layout: Left Nav + Right Pane -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Settings Nav Tabs -->
        <div class="md:col-span-1 space-y-1">
          @for (tab of tabs; track tab.id) {
            <button
              (click)="activeTab.set(tab.id)"
              class="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left"
              [class.bg-blue-600]="activeTab() === tab.id"
              [class.text-white]="activeTab() === tab.id"
              [class.text-slate-600]="activeTab() !== tab.id"
              [class.dark:text-slate-400]="activeTab() !== tab.id"
              [class.hover:bg-slate-100]="activeTab() !== tab.id"
              [class.dark:hover:bg-slate-800]="activeTab() !== tab.id"
            >
              <app-icon [name]="tab.icon" [size]="15"></app-icon>
              <span>{{ tab.label }}</span>
            </button>
          }
        </div>

        <!-- Settings Content Pane -->
        <div class="md:col-span-3 crm-card p-6 space-y-6">
          <!-- 1. MY PROFILE -->
          @if (activeTab() === 'profile') {
            <div class="space-y-6">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Profile Information</h3>
                <p class="text-xs text-slate-400 mt-0.5">Update your enterprise avatar, job designation, and contact details</p>
              </div>

              <!-- Avatar Uploader -->
              <div class="flex items-center gap-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border">
                <img [src]="authService.currentUser().avatar" class="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/20" />
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <button (click)="toast.info('Avatar Upload', 'File browser ready for 512x512 PNG/JPEG upload.')" class="btn-secondary text-xs py-1.5 px-3">
                      Change Photo
                    </button>
                    <button class="text-xs text-rose-600 hover:underline">Remove</button>
                  </div>
                  <span class="text-[11px] text-slate-400 block">Recommended size: 400x400px. JPG, PNG or WebP.</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input type="text" [value]="authService.currentUser().name" class="crm-input" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Official Title</label>
                  <input type="text" [value]="authService.currentUser().designation" class="crm-input" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <input type="email" [value]="authService.currentUser().email" class="crm-input" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Direct Phone</label>
                  <input type="text" [value]="authService.currentUser().phone" class="crm-input font-mono" />
                </div>
              </div>
            </div>
          }

          <!-- 2. APPEARANCE & THEME -->
          @if (activeTab() === 'appearance') {
            <div class="space-y-6">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Interface Appearance</h3>
                <p class="text-xs text-slate-400 mt-0.5">Customize visual modes, contrast ratio, and brand styling</p>
              </div>

              <!-- Theme Toggle Cards -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Light Theme Option -->
                <div
                  (click)="themeService.setTheme(false)"
                  class="p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between"
                  [class.border-blue-600]="!themeService.isDark()"
                  [class.bg-blue-50/20]="!themeService.isDark()"
                  [class.border-slate-200]="themeService.isDark()"
                >
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <app-icon name="sun" [size]="16" class="text-amber-500"></app-icon>
                      Light Mode
                    </span>
                    @if (!themeService.isDark()) {
                      <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    }
                  </div>
                  <div class="h-16 rounded-lg bg-slate-100 border p-2 flex gap-1">
                    <div class="w-4 h-full bg-[#111827] rounded"></div>
                    <div class="flex-1 bg-white rounded border"></div>
                  </div>
                </div>

                <!-- Dark Theme Option -->
                <div
                  (click)="themeService.setTheme(true)"
                  class="p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between"
                  [class.border-blue-600]="themeService.isDark()"
                  [class.bg-blue-950/20]="themeService.isDark()"
                  [class.border-slate-200]="!themeService.isDark()"
                >
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <app-icon name="moon" [size]="16" class="text-indigo-400"></app-icon>
                      Dark Mode (Enterprise Slate)
                    </span>
                    @if (themeService.isDark()) {
                      <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    }
                  </div>
                  <div class="h-16 rounded-lg bg-[#0b1120] border border-slate-700 p-2 flex gap-1">
                    <div class="w-4 h-full bg-[#0f172a] rounded"></div>
                    <div class="flex-1 bg-[#111c2e] rounded border border-slate-700"></div>
                  </div>
                </div>
              </div>

              <!-- Density & Palette Preview -->
              <div class="space-y-3 pt-4 border-t">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">Primary Accent Palette</span>
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 rounded-lg bg-[#2563EB] ring-2 ring-blue-500/50 cursor-pointer" title="#2563EB Nexus Blue"></span>
                  <span class="w-8 h-8 rounded-lg bg-[#6366F1] cursor-pointer" title="#6366F1 Indigo"></span>
                  <span class="w-8 h-8 rounded-lg bg-[#10B981] cursor-pointer" title="#10B981 Emerald"></span>
                  <span class="w-8 h-8 rounded-lg bg-[#8B5CF6] cursor-pointer" title="#8B5CF6 Violet"></span>
                </div>
              </div>
            </div>
          }

          <!-- 3. SECURITY & SSO -->
          @if (activeTab() === 'security') {
            <div class="space-y-6">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Security & Authentication</h3>
                <p class="text-xs text-slate-400 mt-0.5">Single Sign-On (SAML 2.0 / Okta), Multi-Factor Auth, and Active Sessions</p>
              </div>

              <div class="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-slate-900 dark:text-white block">Enterprise SAML 2.0 / Okta SSO</span>
                  <span class="text-[11px] text-slate-400">Enforce company-wide identity provider login.</span>
                </div>
                <span class="badge badge-green text-xs">Enabled & Active</span>
              </div>

              <div class="space-y-3">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Change Password</h4>
                <div class="space-y-3 max-w-md">
                  <input type="password" placeholder="Current Password" class="crm-input" />
                  <input type="password" placeholder="New Password (min 12 chars)" class="crm-input" />
                  <button (click)="toast.success('Password Updated', 'Your master credential has been changed.')" class="btn-secondary text-xs">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- 4. NOTIFICATIONS PREFERENCES -->
          @if (activeTab() === 'notifications') {
            <div class="space-y-6">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Notification Rules</h3>
                <p class="text-xs text-slate-400 mt-0.5">Configure in-app toasts, mobile push alerts, and digest delivery</p>
              </div>

              <div class="space-y-3 text-xs">
                <div class="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <span class="font-bold text-slate-900 dark:text-white block">Deal Stage Advanced Alerts</span>
                    <span class="text-slate-400">Instant notification whenever opportunity reaches Proposal or Won.</span>
                  </div>
                  <input type="checkbox" checked class="rounded text-blue-600 cursor-pointer" />
                </div>

                <div class="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <span class="font-bold text-slate-900 dark:text-white block">Lead Score Exceeds 85</span>
                    <span class="text-slate-400">High priority inbound buyer alerts.</span>
                  </div>
                  <input type="checkbox" checked class="rounded text-blue-600 cursor-pointer" />
                </div>

                <div class="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <span class="font-bold text-slate-900 dark:text-white block">Daily Morning Performance Digest</span>
                    <span class="text-slate-400">Executive email report sent at 8:00 AM local time.</span>
                  </div>
                  <input type="checkbox" checked class="rounded text-blue-600 cursor-pointer" />
                </div>
              </div>
            </div>
          }

          <!-- 5. PREFERENCES & SYSTEM CONFIG -->
          @if (activeTab() === 'preferences') {
            <div class="space-y-6">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Regional & System Configuration</h3>
                <p class="text-xs text-slate-400 mt-0.5">Currency symbols, fiscal year offsets, and date formatting</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Primary Currency</label>
                  <select class="crm-input">
                    <option value="USD">USD ($) - United States Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date Display Format</label>
                  <select class="crm-input">
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (UK / International)</option>
                  </select>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  readonly toast = inject(ToastService);

  activeTab = signal('profile');

  readonly tabs = [
    { id: 'profile', label: 'My Profile', icon: 'user' },
    { id: 'appearance', label: 'Appearance & Theme', icon: 'moon' },
    { id: 'security', label: 'Security & SSO', icon: 'shield-check' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'preferences', label: 'Preferences & Config', icon: 'settings' }
  ];

  saveSettings(): void {
    this.toast.success('Settings Saved', 'Workspace preferences successfully updated.');
  }
}
