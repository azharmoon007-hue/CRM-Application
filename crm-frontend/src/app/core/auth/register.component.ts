import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from '../services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="min-h-screen w-full flex items-center justify-center bg-[#0B1120] text-slate-100 p-6 font-sans">
      <div class="w-full max-w-lg bg-[#111C2E] border border-[#263449] rounded-2xl p-8 shadow-2xl space-y-6">
        <div class="text-center space-y-2">
          <div class="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 items-center justify-center text-white shadow-lg shadow-blue-500/30 mx-auto">
            <app-icon name="sparkles" [size]="24" strokeWidth="2.5"></app-icon>
          </div>
          <h2 class="text-2xl font-black text-white">Create Enterprise Organization</h2>
          <p class="text-xs text-slate-400">Deploy a dedicated Nexus CRM tenant for your team.</p>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
              <input type="text" [(ngModel)]="firstName" placeholder="Alex" class="crm-input bg-slate-900 border-slate-700 text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
              <input type="text" [(ngModel)]="lastName" placeholder="Mercer" class="crm-input bg-slate-900 border-slate-700 text-white" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
            <input type="email" [(ngModel)]="email" placeholder="alex@company.com" class="crm-input bg-slate-900 border-slate-700 text-white" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
            <input type="text" [(ngModel)]="company" placeholder="Acme Global Inc" class="crm-input bg-slate-900 border-slate-700 text-white" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Estimated Sales Seats</label>
            <select class="crm-input bg-slate-900 border-slate-700 text-white">
              <option value="10-50">10 – 50 Enterprise Seats</option>
              <option value="51-200">51 – 200 Enterprise Seats</option>
              <option value="200+">200+ Global Enterprise</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Account Password</label>
            <input type="password" [(ngModel)]="password" placeholder="••••••••••••" class="crm-input bg-slate-900 border-slate-700 text-white" />
          </div>

          <button (click)="submitRegister()" class="w-full btn-primary py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30">
            Launch Nexus CRM Tenant 🚀
          </button>
        </div>

        <div class="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already registered?
          <a routerLink="/auth/login" class="text-blue-400 hover:underline font-semibold ml-1">Sign In</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  firstName = 'Alex';
  lastName = 'Mercer';
  email = '';
  company = 'Acme Global';
  password = 'Password123!';

  submitRegister(): void {
    if (!this.firstName || !this.lastName || !this.email) {
      this.toast.error('Validation Error', 'First name, last name, and email are required');
      return;
    }

    this.auth.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: '+1 (555) 349-2810',
      password: this.password || 'Password123!'
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success('Organization Initialized', 'Welcome to Nexus CRM! Registered with backend.');
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error('Registration Failed', res.message);
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Registration failed with backend';
        this.toast.error('Error', msg);
      }
    });
  }
}

