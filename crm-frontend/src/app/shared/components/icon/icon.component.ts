import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="class"
      [ngSwitch]="name"
    >
      <!-- Dashboard / Layout -->
      <g *ngSwitchCase="'dashboard'">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </g>

      <!-- Users / Customers -->
      <g *ngSwitchCase="'users'">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </g>

      <!-- User Single -->
      <g *ngSwitchCase="'user'">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </g>

      <!-- User Check / Converted -->
      <g *ngSwitchCase="'user-check'">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </g>

      <!-- Contacts / Address Book -->
      <g *ngSwitchCase="'contacts'">
        <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <circle cx="12" cy="10" r="2" />
        <line x1="8" x2="8" y1="2" y2="4" />
        <line x1="16" x2="16" y1="2" y2="4" />
      </g>

      <!-- Leads / Target -->
      <g *ngSwitchCase="'target'">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </g>

      <!-- Deals / Briefcase -->
      <g *ngSwitchCase="'briefcase'">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </g>

      <!-- Sales Pipeline / Git Branch / Funnel -->
      <g *ngSwitchCase="'pipeline'">
        <line x1="6" x2="6" y1="3" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </g>

      <!-- Calendar / Activities -->
      <g *ngSwitchCase="'calendar'">
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </g>

      <!-- Tasks / Check Square -->
      <g *ngSwitchCase="'check-square'">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </g>

      <!-- Notes / File Text -->
      <g *ngSwitchCase="'file-text'">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </g>

      <!-- Mail / Email -->
      <g *ngSwitchCase="'mail'">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </g>

      <!-- Reports / Pie Chart -->
      <g *ngSwitchCase="'pie-chart'">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </g>

      <!-- Bar Chart -->
      <g *ngSwitchCase="'bar-chart'">
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="14" />
      </g>

      <!-- Roles / Shield Check -->
      <g *ngSwitchCase="'shield-check'">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </g>

      <!-- Audit / History -->
      <g *ngSwitchCase="'history'">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </g>

      <!-- Settings -->
      <g *ngSwitchCase="'settings'">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </g>

      <!-- Bell -->
      <g *ngSwitchCase="'bell'">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </g>

      <!-- Search -->
      <g *ngSwitchCase="'search'">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </g>

      <!-- Plus -->
      <g *ngSwitchCase="'plus'">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </g>

      <!-- Moon -->
      <g *ngSwitchCase="'moon'">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </g>

      <!-- Sun -->
      <g *ngSwitchCase="'sun'">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </g>

      <!-- Chevrons -->
      <g *ngSwitchCase="'chevron-down'">
        <path d="m6 9 6 6 6-6" />
      </g>
      <g *ngSwitchCase="'chevron-right'">
        <path d="m9 18 6-6-6-6" />
      </g>
      <g *ngSwitchCase="'chevron-left'">
        <path d="m15 18-6-6 6-6" />
      </g>
      <g *ngSwitchCase="'chevron-up'">
        <path d="m18 15-6-6-6 6" />
      </g>

      <!-- Arrows -->
      <g *ngSwitchCase="'arrow-up-right'">
        <path d="M7 7h10v10" />
        <path d="M7 17 17 7" />
      </g>
      <g *ngSwitchCase="'arrow-down-right'">
        <path d="M7 7 17 17" />
        <path d="M17 7v10H7" />
      </g>

      <!-- Filter -->
      <g *ngSwitchCase="'filter'">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </g>

      <!-- Download -->
      <g *ngSwitchCase="'download'">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </g>

      <!-- Upload -->
      <g *ngSwitchCase="'upload'">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </g>

      <!-- Refresh -->
      <g *ngSwitchCase="'refresh'">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </g>

      <!-- More Vertical -->
      <g *ngSwitchCase="'more-vertical'">
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
      </g>

      <!-- Edit -->
      <g *ngSwitchCase="'edit'">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </g>

      <!-- Trash -->
      <g *ngSwitchCase="'trash'">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </g>

      <!-- Phone -->
      <g *ngSwitchCase="'phone'">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>

      <!-- Check -->
      <g *ngSwitchCase="'check'">
        <polyline points="20 6 9 17 4 12" />
      </g>

      <!-- X -->
      <g *ngSwitchCase="'x'">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </g>

      <!-- Alert Circle -->
      <g *ngSwitchCase="'alert-circle'">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </g>

      <!-- Star -->
      <g *ngSwitchCase="'star'">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </g>

      <!-- Sparkles / AI -->
      <g *ngSwitchCase="'sparkles'">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </g>

      <!-- Help / Info Circle -->
      <g *ngSwitchCase="'help'">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </g>

      <!-- Default -->
      <g *ngSwitchDefault>
        <circle cx="12" cy="12" r="10" />
      </g>
    </svg>
  `
})
export class IconComponent {
  @Input() name = 'dashboard';
  @Input() size: string | number = 18;
  @Input() strokeWidth: string | number = 2;
  @Input() class = '';
}
