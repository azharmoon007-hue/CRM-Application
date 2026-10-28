import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CustomersComponent } from './features/customers/customers.component';
import { ContactsComponent } from './features/contacts/contacts.component';
import { LeadsComponent } from './features/leads/leads.component';
import { DealsComponent } from './features/deals/deals.component';
import { PipelineComponent } from './features/pipeline/pipeline.component';
import { ActivitiesComponent } from './features/activities/activities.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { NotesComponent } from './features/notes/notes.component';
import { EmailComponent } from './features/email/email.component';
import { ReportsComponent } from './features/reports/reports.component';
import { UsersComponent } from './features/users/users.component';
import { RolesComponent } from './features/roles/roles.component';
import { AuditComponent } from './features/audit/audit.component';
import { SettingsComponent } from './features/settings/settings.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { LoginComponent } from './core/auth/login.component';
import { RegisterComponent } from './core/auth/register.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'leads', component: LeadsComponent },
      { path: 'deals', component: DealsComponent },
      { path: 'pipeline', component: PipelineComponent },
      { path: 'activities', component: ActivitiesComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'email', component: EmailComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'audit', component: AuditComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'notifications', component: NotificationsComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
