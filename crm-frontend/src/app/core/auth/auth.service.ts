import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { UserProfile, RoleType } from '../models/crm.models';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly tokenKey = 'nexus_access_token';
  private readonly refreshKey = 'nexus_refresh_token';
  private readonly userKey = 'nexus_crm_user';

  private readonly initialUser: UserProfile = {
    id: 'usr-101',
    name: 'Alex Mercer',
    email: 'alex.mercer@nexuscrm.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    initials: 'AM',
    role: 'SUPER_ADMIN',
    department: 'Executive Leadership',
    designation: 'Chief Revenue Officer',
    status: 'ACTIVE',
    lastLogin: 'Today, 09:42 AM',
    phone: '+1 (555) 349-2810'
  };

  readonly currentUser = signal<UserProfile>(this.loadSavedUser());
  readonly isAuthenticated = signal<boolean>(!!this.getAccessToken());

  readonly availableUsers: UserProfile[] = [
    {
      id: 'usr-101',
      name: 'Alex Mercer',
      email: 'alex.mercer@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      initials: 'AM',
      role: 'SUPER_ADMIN',
      department: 'Executive Leadership',
      designation: 'Chief Revenue Officer',
      status: 'ACTIVE',
      lastLogin: 'Just now',
      phone: '+1 (555) 349-2810'
    },
    {
      id: 'usr-102',
      name: 'Elena Rostova',
      email: 'elena.r@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
      initials: 'ER',
      role: 'SALES_MANAGER',
      department: 'Enterprise Sales',
      designation: 'Sales Director (EMEA)',
      status: 'ACTIVE',
      lastLogin: '1 hour ago',
      phone: '+44 20 7946 0912'
    },
    {
      id: 'usr-103',
      name: 'Marcus Vance',
      email: 'marcus.v@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      initials: 'MV',
      role: 'SALES_REP',
      department: 'Mid-Market Sales',
      designation: 'Senior Account Executive',
      status: 'ACTIVE',
      lastLogin: '3 hours ago',
      phone: '+1 (555) 882-9014'
    },
    {
      id: 'usr-104',
      name: 'Sarah Jenkins',
      email: 'sarah.j@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      initials: 'SJ',
      role: 'SUPPORT_AGENT',
      department: 'Customer Success',
      designation: 'Tier-3 Support Lead',
      status: 'ACTIVE',
      lastLogin: 'Yesterday',
      phone: '+1 (555) 743-1122'
    }
  ];

  readonly currentRole = computed(() => this.currentUser().role);

  getAccessToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.refreshKey);
  }

  private setTokens(access: string, refresh?: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, access);
      if (refresh) localStorage.setItem(this.refreshKey, refresh);
    }
    this.isAuthenticated.set(true);
  }

  private clearTokens(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshKey);
      localStorage.removeItem(this.userKey);
    }
    this.isAuthenticated.set(false);
  }

  private loadSavedUser(): UserProfile {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.userKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return this.initialUser;
  }

  private saveUser(user: UserProfile): void {
    this.currentUser.set(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  /**
   * Real backend API login
   */
  login(req: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, req).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setTokens(res.data.accessToken, res.data.refreshToken);
          const role = (res.data.roles && res.data.roles[0]) ? res.data.roles[0] as RoleType : 'SUPER_ADMIN';
          const user: UserProfile = {
            id: res.data.userId || 'usr-101',
            name: req.email.split('@')[0].replace('.', ' '),
            email: res.data.email || req.email,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            initials: 'AM',
            role,
            department: 'Enterprise Revenue',
            designation: 'Account Lead',
            status: 'ACTIVE',
            lastLogin: 'Just now'
          };
          this.saveUser(user);
        }
      })
    );
  }

  /**
   * Real backend API registration
   */
  register(req: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register`, req).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setTokens(res.data.accessToken, res.data.refreshToken);
          const role = (res.data.roles && res.data.roles[0]) ? res.data.roles[0] as RoleType : 'SALES_REP';
          const user: UserProfile = {
            id: res.data.userId || 'usr-reg',
            name: `${req.firstName} ${req.lastName}`,
            email: res.data.email || req.email,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            initials: `${req.firstName[0]}${req.lastName[0]}`,
            role,
            department: 'Enterprise Sales',
            designation: 'Account Executive',
            status: 'ACTIVE',
            lastLogin: 'Just now',
            phone: req.phone
          };
          this.saveUser(user);
        }
      })
    );
  }

  /**
   * Real backend API logout
   */
  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.baseUrl}/logout`, { refreshToken }).pipe(
        catchError(() => of(null))
      ).subscribe();
    }
    this.clearTokens();
  }

  /**
   * Demo fast role switch
   */
  switchRole(role: RoleType): void {
    const matching = this.availableUsers.find(u => u.role === role);
    if (matching) {
      this.saveUser(matching);
    } else {
      this.currentUser.update(curr => ({ ...curr, role }));
    }
  }

  switchUser(user: UserProfile): void {
    this.saveUser(user);
  }
}
