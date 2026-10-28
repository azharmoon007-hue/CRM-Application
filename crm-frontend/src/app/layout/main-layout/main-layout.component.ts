import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { GlobalSearchComponent } from '../../shared/components/global-search/global-search.component';
import { QuickCreateModalComponent } from '../../shared/components/quick-create-modal/quick-create-modal.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    GlobalSearchComponent,
    QuickCreateModalComponent,
    ToastContainerComponent
  ],
  template: `
    <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 font-sans">
      <!-- Fixed Collapsible Left Sidebar (Desktop) -->
      <app-sidebar
        [isCollapsed]="isSidebarCollapsed()"
        (toggleCollapse)="isSidebarCollapsed.set(!isSidebarCollapsed())"
        class="hidden lg:flex"
      ></app-sidebar>

      <!-- Mobile Sidebar Overlay Drawer -->
      @if (isMobileSidebarOpen()) {
        <div class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden animate-fade-in" (click)="isMobileSidebarOpen.set(false)">
          <div class="w-64 h-full bg-[#111827] animate-scale-in" (click)="$event.stopPropagation()">
            <app-sidebar [isCollapsed]="false" (toggleCollapse)="isMobileSidebarOpen.set(false)"></app-sidebar>
          </div>
        </div>
      }

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <!-- Top Navigation Header -->
        <app-header
          (toggleMobileSidebar)="isMobileSidebarOpen.set(true)"
          (openSearch)="isSearchOpen.set(true)"
          (openQuickCreate)="isQuickCreateOpen.set(true)"
        ></app-header>

        <!-- Routed Page Content -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Omnisearch Command Palette (Cmd+K) -->
      <app-global-search
        [isOpen]="isSearchOpen()"
        (closeEvent)="isSearchOpen.set(false)"
      ></app-global-search>

      <!-- Quick Create Modal -->
      <app-quick-create-modal
        [isOpen]="isQuickCreateOpen()"
        (closeEvent)="isQuickCreateOpen.set(false)"
      ></app-quick-create-modal>

      <!-- Toast Notifications -->
      <app-toast-container></app-toast-container>
    </div>
  `
})
export class MainLayoutComponent {
  isSidebarCollapsed = signal<boolean>(false);
  isMobileSidebarOpen = signal<boolean>(false);
  isSearchOpen = signal<boolean>(false);
  isQuickCreateOpen = signal<boolean>(false);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.isSearchOpen.update(v => !v);
    }
    if (event.key === 'Escape') {
      this.isSearchOpen.set(false);
      this.isQuickCreateOpen.set(false);
    }
  }
}
