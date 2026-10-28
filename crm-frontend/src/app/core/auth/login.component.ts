import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from '../services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { RoleType } from '../models/crm.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="min-h-screen w-full flex bg-[#0B1120] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <!-- Left Hero Showcase Column -->
      <div class="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0F172A] via-[#111C2E] to-[#0B1120] border-r border-[#263449] relative overflow-hidden">
        <!-- Ambient Glow -->
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Logo -->
        <div class="flex items-center gap-3 z-10">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <app-icon name="sparkles" [size]="22" strokeWidth="2.5"></app-icon>
          </div>
          <span class="text-xl font-extrabold tracking-tight text-white">Nexus CRM</span>
          <span class="text-xs px-2 py-0.5 rounded bg-blue-900/40 text-blue-400 font-mono border border-blue-800/60 font-semibold">ENTERPRISE</span>
        </div>

        <!-- Hero Content -->
        <div class="space-y-6 z-10 max-w-lg">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            SOC 2 Type II Certified & GDPR Ready
          </div>
          <h2 class="text-3xl font-extrabold text-white tracking-tight leading-tight">
            The next-generation revenue engine for high-growth enterprises.
          </h2>
          <p class="text-sm text-slate-400 leading-relaxed">
            Consolidate customer data, automate opportunity velocity, and unlock real-time predictive forecasting across your global sales force.
          </p>

          <!-- Testimonial Quote -->
          <div class="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
            <p class="text-xs text-slate-300 italic leading-relaxed">
              "Nexus CRM shortened our enterprise sales cycle by 35% and completely eliminated the friction of our previous legacy CRM."
            </p>
            <div class="flex items-center gap-3 pt-1">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128" class="w-8 h-8 rounded-full object-cover" />
              <div>
                <span class="text-xs font-bold text-white block">Elena Rostova</span>
                <span class="text-[11px] text-slate-400">Sales Director, EMEA</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-xs text-slate-500 z-10">
          © 2024 Nexus Technologies Inc. All rights reserved.
        </div>
      </div>

      <!-- Right Login Form Column -->
      <div class="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <div class="w-full max-w-md space-y-6">
          <div>
            <h2 class="text-2xl font-black text-white tracking-tight">Welcome back</h2>
            <p class="text-xs text-slate-400 mt-1">Sign in with your enterprise credentials or click a demo persona below.</p>
          </div>

          <!-- Quick Persona Fast-Login Buttons -->
          <div class="p-4 rounded-2xl bg-white/5 border border-[#263449] space-y-2.5">
            <span class="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">One-Click Demo Personas</span>
            <div class="grid grid-cols-2 gap-2">
              <button
                (click)="demoLogin('SUPER_ADMIN')"
                class="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-left transition-all border border-slate-700 hover:border-blue-500 group"
              >
                <span class="text-xs font-bold text-white block group-hover:text-white">Alex Mercer</span>
                <span class="text-[10px] text-slate-400 group-hover:text-blue-100">Super Administrator</span>
              </button>
              <button
                (click)="demoLogin('SALES_MANAGER')"
                class="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-left transition-all border border-slate-700 hover:border-blue-500 group"
              >
                <span class="text-xs font-bold text-white block group-hover:text-white">Elena Rostova</span>
                <span class="text-[10px] text-slate-400 group-hover:text-blue-100">Sales Director</span>
              </button>
              <button
                (click)="demoLogin('SALES_REP')"
                class="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-left transition-all border border-slate-700 hover:border-blue-500 group"
              >
                <span class="text-xs font-bold text-white block group-hover:text-white">Marcus Vance</span>
                <span class="text-[10px] text-slate-400 group-hover:text-blue-100">Senior AE</span>
              </button>
              <button
                (click)="demoLogin('SUPPORT_AGENT')"
                class="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-left transition-all border border-slate-700 hover:border-blue-500 group"
              >
                <span class="text-xs font-bold text-white block group-hover:text-white">Sarah Jenkins</span>
                <span class="text-[10px] text-slate-400 group-hover:text-blue-100">Support Lead</span>
              </button>
            </div>
          </div>

          <!-- Login Form -->
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                class="crm-input bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                placeholder="alex.mercer@nexuscrm.io"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-semibold text-slate-300">Password</label>
                <a routerLink="/auth/forgot" class="text-xs text-blue-400 hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                [(ngModel)]="password"
                class="crm-input bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                placeholder="••••••••••••"
              />
            </div>

            <button
              (click)="submitLogin()"
              class="w-full btn-primary py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30"
            >
              Sign In to Nexus CRM →
            </button>
          </div>

          <div class="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an enterprise seat?
            <a routerLink="/auth/register" class="text-blue-400 hover:underline font-semibold ml-1">Request Sandbox Access</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  email = 'admin@crm.local';
  password = 'Password123!';

  demoLogin(role: RoleType): void {
    this.auth.switchRole(role);
    this.toast.success('Authenticated', `Signed in as ${this.auth.currentUser().name} (${role})`);
    this.router.navigate(['/dashboard']);
  }

  submitLogin(): void {
    if (!this.email || !this.password) {
      this.toast.error('Validation Error', 'Please enter email and password');
      return;
    }

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success('Welcome Back', 'Authentication verified successfully with backend API.');
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error('Login Failed', res.message || 'Invalid credentials');
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Invalid credentials or account locked. You can also click any Demo Persona.';
        this.toast.error('Authentication Error', msg);
      }
    });
  }
}
