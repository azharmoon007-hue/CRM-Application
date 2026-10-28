import { Injectable, signal, computed, inject } from '@angular/core';
import { CrmApiService } from './api/crm-api.service';
import {
  Customer,
  Lead,
  Deal,
  Activity,
  TaskItem,
  Contact,
  NoteItem,
  EmailMessage,
  EmailTemplate,
  AuditLogItem,
  NotificationItem,
  PermissionRow,
  UserProfile,
  DealStage
} from '../models/crm.models';

@Injectable({
  providedIn: 'root'
})
export class CrmDataService {
  private api = inject(CrmApiService);

  readonly isBackendConnected = signal<boolean>(false);
  readonly isSyncing = signal<boolean>(false);

  constructor() {
    this.syncWithBackend();
  }

  syncWithBackend(): void {
    this.isSyncing.set(true);
    this.api.getDashboardSummary().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.isBackendConnected.set(true);
          const d = res.data;
          if (d.totalCustomers > 0 || d.totalLeads > 0 || d.revenue > 0) {
            this.kpis.update(k => [
              { ...k[0], value: d.totalCustomers ? d.totalCustomers.toLocaleString() : k[0].value },
              { ...k[1], value: d.totalLeads ? d.totalLeads.toLocaleString() : k[1].value },
              { ...k[2], value: d.openDeals ? d.openDeals.toLocaleString() : k[2].value },
              { ...k[3], value: d.revenue ? `$${Number(d.revenue).toLocaleString()}` : k[3].value },
              { ...k[4], value: d.totalPipelineValue ? `$${Number(d.totalPipelineValue).toLocaleString()}` : k[4].value },
              { ...k[5], value: d.conversionRate ? `${d.conversionRate}%` : k[5].value }
            ]);
          }
        }
        this.isSyncing.set(false);
      },
      error: () => {
        // Backend offline or unauthorized yet
        this.isSyncing.set(false);
      }
    });

    // Fetch live customers if available
    this.api.getCustomers(0, 50).subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.customers.set(
            res.data.map(c => ({
              id: c.id,
              code: c.customerCode || `CUST-${c.id.substring(0, 4)}`,
              name: c.companyName || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
              company: c.companyName || 'Enterprise Account',
              email: c.email || 'contact@example.com',
              phone: c.phone || '+1 (555) 000-0000',
              industry: c.industry || 'Technology & Cloud',
              status: c.status || 'ACTIVE',
              assignedTo: c.assignedToName || 'Alex Mercer',
              assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
              annualRevenue: c.annualRevenue || 350000,
              totalDeals: 1,
              website: c.website || 'https://example.com',
              address: c.address || 'San Francisco, CA',
              createdDate: c.createdAt ? c.createdAt.split('T')[0] : '2024-01-15'
            }))
          );
        }
      },
      error: () => {}
    });

    // Fetch live leads if available
    this.api.getLeads(0, 50).subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.leads.set(
            res.data.map(l => ({
              id: l.id,
              name: `${l.firstName || ''} ${l.lastName || ''}`.trim() || 'Lead Contact',
              company: l.companyName || 'Prospect Corp',
              email: l.email || 'lead@example.com',
              phone: l.phone || '+1 (555) 000-0000',
              source: l.source ? (l.source === 'WEBSITE' ? 'Website' : l.source === 'REFERRAL' ? 'Referral' : 'Direct') : 'Website',
              status: l.status || 'NEW',
              priority: l.priority ? (l.priority.charAt(0) + l.priority.slice(1).toLowerCase() as any) : 'Medium',
              estimatedValue: l.estimatedValue || 50000,
              score: 85,
              assignedTo: l.assignedToName || 'Alex Mercer',
              assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
              expectedClosingDate: l.expectedCloseDate || '2024-12-31',
              createdAt: l.createdAt ? l.createdAt.split('T')[0] : '2024-03-01'
            }))
          );
        }
      },
      error: () => {}
    });

    // Fetch live deals if available
    this.api.getDeals(0, 50).subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.deals.set(
            res.data.map(d => ({
              id: d.id,
              name: d.name,
              customerId: d.customerId || 'cust-1',
              customerName: d.customerName || 'Enterprise Account',
              value: d.amount || 75000,
              pipeline: 'Enterprise SaaS',
              stage: (d.stageName as DealStage) || 'Proposal',
              probability: d.probability || 60,
              assignedTo: d.assignedToName || 'Alex Mercer',
              assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
              expectedCloseDate: d.expectedCloseDate || '2024-12-31',
              status: d.status || 'OPEN',
              priority: 'High',
              createdDate: d.createdAt ? d.createdAt.split('T')[0] : '2024-02-01'
            }))
          );
        }
      },
      error: () => {}
    });
  }
  // ---------------------------------------------------------------------------
  // KPI METRICS
  // ---------------------------------------------------------------------------
  readonly kpis = signal([
    {
      id: 'kpi-1',
      title: 'Total Customers',
      value: '12,480',
      change: '+12.5%',
      isPositive: true,
      subtext: 'vs. previous 30 days',
      accent: 'blue',
      sparkline: [25, 30, 28, 38, 42, 50, 48, 55, 62]
    },
    {
      id: 'kpi-2',
      title: 'Total Leads',
      value: '2,845',
      change: '+8.2%',
      isPositive: true,
      subtext: 'vs. previous 30 days',
      accent: 'purple',
      sparkline: [40, 35, 45, 52, 48, 55, 58, 64, 70]
    },
    {
      id: 'kpi-3',
      title: 'Open Deals',
      value: '486',
      change: '+15.4%',
      isPositive: true,
      subtext: 'vs. previous 30 days',
      accent: 'amber',
      sparkline: [20, 22, 28, 25, 32, 38, 35, 42, 48]
    },
    {
      id: 'kpi-4',
      title: 'Total Revenue',
      value: '$284,500',
      change: '+18.7%',
      isPositive: true,
      subtext: 'vs. previous 30 days',
      accent: 'emerald',
      sparkline: [180, 195, 210, 205, 230, 250, 260, 275, 285]
    },
    {
      id: 'kpi-5',
      title: 'Pipeline Value',
      value: '$1,240,000',
      change: '+11.3%',
      isPositive: true,
      subtext: 'vs. previous 30 days',
      accent: 'info',
      sparkline: [850, 920, 980, 1050, 1100, 1150, 1200, 1240]
    },
    {
      id: 'kpi-6',
      title: 'Conversion Rate',
      value: '24.8%',
      change: '+3.2%',
      isPositive: true,
      subtext: 'vs. previous 30 days',
      accent: 'indigo',
      sparkline: [18, 19, 21, 20, 22, 23, 23.5, 24.8]
    }
  ]);

  // ---------------------------------------------------------------------------
  // REVENUE & PERFORMANCE CHARTS DATA
  // ---------------------------------------------------------------------------
  readonly revenueChartData = signal({
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    currentYear: [145000, 168000, 192000, 210000, 228000, 245000, 260000, 252000, 270000, 284500, 310000, 340000],
    previousYear: [120000, 135000, 150000, 162000, 175000, 185000, 195000, 205000, 210000, 225000, 240000, 265000]
  });

  readonly leadSources = signal([
    { source: 'Website', percentage: 42, count: 1195, color: '#2563EB' },
    { source: 'Referral', percentage: 24, count: 683, color: '#10B981' },
    { source: 'Social Media', percentage: 16, count: 455, color: '#8B5CF6' },
    { source: 'Advertisement', percentage: 12, count: 341, color: '#F59E0B' },
    { source: 'Other', percentage: 6, count: 171, color: '#64748B' }
  ]);

  readonly salesRepsPerformance = signal([
    {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      role: 'Sales Director',
      revenue: '$88,400',
      dealsClosed: 14,
      target: '$80,000',
      targetPercent: 110
    },
    {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      role: 'Senior AE',
      revenue: '$74,200',
      dealsClosed: 11,
      target: '$70,000',
      targetPercent: 106
    },
    {
      name: 'Sophia Chang',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
      role: 'Account Executive',
      revenue: '$62,500',
      dealsClosed: 9,
      target: '$65,000',
      targetPercent: 96
    },
    {
      name: 'David Patel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128',
      role: 'Enterprise AE',
      revenue: '$59,400',
      dealsClosed: 8,
      target: '$60,000',
      targetPercent: 99
    }
  ]);

  // ---------------------------------------------------------------------------
  // CUSTOMERS DATA
  // ---------------------------------------------------------------------------
  readonly customers = signal<Customer[]>([
    {
      id: 'cust-1',
      code: 'CUST-8021',
      name: 'CloudScale Dynamics',
      company: 'CloudScale Inc.',
      email: 'billing@cloudscale.io',
      phone: '+1 (415) 555-0182',
      industry: 'Technology & Cloud',
      status: 'ACTIVE',
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=96',
      annualRevenue: 480000,
      totalDeals: 4,
      website: 'https://cloudscale.io',
      address: '742 Market St, San Francisco, CA',
      createdDate: '2024-01-14'
    },
    {
      id: 'cust-2',
      code: 'CUST-8022',
      name: 'Apex Health Systems',
      company: 'Apex Health Corp',
      email: 'contact@apexhealth.org',
      phone: '+1 (617) 555-4921',
      industry: 'Healthcare & Pharma',
      status: 'ACTIVE',
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=96',
      annualRevenue: 620000,
      totalDeals: 6,
      website: 'https://apexhealth.org',
      address: '100 Longwood Ave, Boston, MA',
      createdDate: '2023-11-20'
    },
    {
      id: 'cust-3',
      code: 'CUST-8023',
      name: 'Vanguard FinTech Group',
      company: 'Vanguard Capital Partners',
      email: 'ops@vanguardfintech.com',
      phone: '+1 (212) 555-8930',
      industry: 'Financial Services',
      status: 'ACTIVE',
      assignedTo: 'Sophia Chang',
      assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
      logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=96',
      annualRevenue: 950000,
      totalDeals: 8,
      website: 'https://vanguardfintech.com',
      address: '45 Wall Street, New York, NY',
      createdDate: '2023-08-12'
    },
    {
      id: 'cust-4',
      code: 'CUST-8024',
      name: 'Nordic Logistics Global',
      company: 'Nordic Freight ApS',
      email: 'eu-sales@nordiclogistics.eu',
      phone: '+45 33 12 34 56',
      industry: 'Logistics & Supply',
      status: 'PROSPECT',
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=96',
      annualRevenue: 340000,
      totalDeals: 2,
      website: 'https://nordiclogistics.eu',
      address: 'Havnegade 24, Copenhagen, Denmark',
      createdDate: '2024-02-01'
    },
    {
      id: 'cust-5',
      code: 'CUST-8025',
      name: 'CyberShield Security',
      company: 'CyberShield Labs',
      email: 'enterprise@cybershield.ai',
      phone: '+1 (512) 555-7301',
      industry: 'Cybersecurity',
      status: 'ACTIVE',
      assignedTo: 'David Patel',
      assignedAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128',
      logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=96',
      annualRevenue: 510000,
      totalDeals: 5,
      website: 'https://cybershield.ai',
      address: '600 Congress Ave, Austin, TX',
      createdDate: '2023-09-05'
    },
    {
      id: 'cust-6',
      code: 'CUST-8026',
      name: 'Solaris Energy Solutions',
      company: 'Solaris Renewables LLC',
      email: 'info@solarisenergy.com',
      phone: '+1 (303) 555-9012',
      industry: 'Clean Energy',
      status: 'CHURNED',
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      logoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=96',
      annualRevenue: 120000,
      totalDeals: 1,
      website: 'https://solarisenergy.com',
      address: '1600 17th St, Denver, CO',
      createdDate: '2023-04-18'
    }
  ]);

  // ---------------------------------------------------------------------------
  // LEADS DATA
  // ---------------------------------------------------------------------------
  readonly leads = signal<Lead[]>([
    {
      id: 'lead-1',
      name: 'Jonathan Reynolds',
      company: 'Quantum Matrix Corp',
      email: 'jreynolds@quantummatrix.io',
      phone: '+1 (415) 890-2341',
      source: 'Website',
      status: 'QUALIFIED',
      priority: 'High',
      estimatedValue: 65000,
      score: 94,
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      expectedClosingDate: '2024-11-30',
      createdAt: '2024-03-01',
      title: 'Chief Technology Officer',
      industry: 'AI & Data Platforms',
      location: 'San Francisco, CA',
      notes: 'Evaluating Nexus CRM to replace legacy Salesforce instance across 140 seats.'
    },
    {
      id: 'lead-2',
      name: 'Clara Delacroix',
      company: 'BioGenix Labs',
      email: 'clara.d@biogenix.eu',
      phone: '+33 1 42 68 55 00',
      source: 'Referral',
      status: 'NEW',
      priority: 'Urgent',
      estimatedValue: 120000,
      score: 88,
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      expectedClosingDate: '2024-12-15',
      createdAt: '2024-03-04',
      title: 'Head of Clinical Procurement',
      industry: 'Biotechnology',
      location: 'Paris, France',
      notes: 'Referred by Apex Health. Needs HIPAA + GDPR compliant pipeline audit.'
    },
    {
      id: 'lead-3',
      name: 'Harrison Sterling',
      company: 'Sterling Global Asset Mgmt',
      email: 'h.sterling@sterlingasset.com',
      phone: '+1 (212) 332-9010',
      source: 'Advertisement',
      status: 'CONTACTED',
      priority: 'Medium',
      estimatedValue: 45000,
      score: 72,
      assignedTo: 'Sophia Chang',
      assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
      expectedClosingDate: '2024-11-15',
      createdAt: '2024-02-28',
      title: 'Managing Director',
      industry: 'Investment Banking',
      location: 'New York, NY',
      notes: 'Initial demo held. Requested custom security architecture whitepaper.'
    },
    {
      id: 'lead-4',
      name: 'Maya Lin',
      company: 'OmniRetail Commerce',
      email: 'mlin@omniretail.com',
      phone: '+1 (206) 441-8977',
      source: 'Social Media',
      status: 'CONVERTED',
      priority: 'High',
      estimatedValue: 88000,
      score: 98,
      assignedTo: 'David Patel',
      assignedAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128',
      expectedClosingDate: '2024-10-31',
      createdAt: '2024-02-15',
      title: 'VP of Digital Growth',
      industry: 'E-Commerce',
      location: 'Seattle, WA',
      notes: 'Successfully converted to deal #DEAL-9045.'
    },
    {
      id: 'lead-5',
      name: 'Oliver Thorne',
      company: 'Stratum GeoDynamics',
      email: 'o.thorne@stratumgeo.co.uk',
      phone: '+44 20 7123 4567',
      source: 'Partner',
      status: 'LOST',
      priority: 'Low',
      estimatedValue: 24000,
      score: 41,
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      expectedClosingDate: '2024-10-01',
      createdAt: '2024-01-20',
      title: 'Operations Director',
      industry: 'Geotechnical Engineering',
      location: 'London, UK',
      notes: 'Postponed CRM procurement to Q3 next year due to internal restructuring.'
    },
    {
      id: 'lead-6',
      name: 'Amira Benali',
      company: 'Zenith Robotic Systems',
      email: 'amira@zenithrobotics.de',
      phone: '+49 89 244 1234',
      source: 'Website',
      status: 'UNQUALIFIED',
      priority: 'Low',
      estimatedValue: 18000,
      score: 35,
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      expectedClosingDate: '2024-11-05',
      createdAt: '2024-03-02',
      title: 'Procurement Specialist',
      industry: 'Hardware & Robotics',
      location: 'Munich, Germany',
      notes: 'Looking for ERP hardware barcode management; not ideal fit for sales CRM.'
    }
  ]);

  // ---------------------------------------------------------------------------
  // DEALS DATA & PIPELINE
  // ---------------------------------------------------------------------------
  readonly deals = signal<Deal[]>([
    {
      id: 'deal-1',
      name: 'CloudScale Enterprise 250-Seat Expansion',
      customerId: 'cust-1',
      customerName: 'CloudScale Dynamics',
      value: 125000,
      pipeline: 'Enterprise SaaS',
      stage: 'Proposal',
      probability: 75,
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      expectedCloseDate: '2024-11-25',
      status: 'OPEN',
      priority: 'High',
      createdDate: '2024-02-10',
      notes: 'Custom MSA and enterprise SLAs currently under legal review.'
    },
    {
      id: 'deal-2',
      name: 'Apex Health Multi-Site Telehealth Rollout',
      customerId: 'cust-2',
      customerName: 'Apex Health Systems',
      value: 185000,
      pipeline: 'Enterprise SaaS',
      stage: 'Negotiation',
      probability: 90,
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      expectedCloseDate: '2024-11-18',
      status: 'OPEN',
      priority: 'Urgent',
      createdDate: '2024-01-18',
      notes: 'Final board approval scheduled for next Thursday.'
    },
    {
      id: 'deal-3',
      name: 'Vanguard Algorithmic Desk Integration',
      customerId: 'cust-3',
      customerName: 'Vanguard FinTech Group',
      value: 92000,
      pipeline: 'Enterprise SaaS',
      stage: 'Closed Won',
      probability: 100,
      assignedTo: 'Sophia Chang',
      assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
      expectedCloseDate: '2024-10-28',
      status: 'WON',
      priority: 'High',
      createdDate: '2024-01-05',
      notes: 'Contract signed! Provisioning sandbox environment.'
    },
    {
      id: 'deal-4',
      name: 'Quantum Matrix Automated Pipeline Pilot',
      customerId: 'cust-1',
      customerName: 'Quantum Matrix Corp',
      value: 65000,
      pipeline: 'Enterprise SaaS',
      stage: 'Qualification',
      probability: 45,
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      expectedCloseDate: '2024-12-05',
      status: 'OPEN',
      priority: 'Medium',
      createdDate: '2024-03-01',
      notes: 'Technical discovery session with Engineering team completed.'
    },
    {
      id: 'deal-5',
      name: 'BioGenix Global Clinical CRM Suite',
      customerId: 'cust-2',
      customerName: 'BioGenix Labs',
      value: 140000,
      pipeline: 'Enterprise SaaS',
      stage: 'Lead',
      probability: 25,
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      expectedCloseDate: '2024-12-20',
      status: 'OPEN',
      priority: 'High',
      createdDate: '2024-03-04',
      notes: 'Initial scope document sent to clinical department head.'
    },
    {
      id: 'deal-6',
      name: 'CyberShield Zero-Trust Analytics License',
      customerId: 'cust-5',
      customerName: 'CyberShield Security',
      value: 58000,
      pipeline: 'Mid-Market SaaS',
      stage: 'Closed Won',
      probability: 100,
      assignedTo: 'David Patel',
      assignedAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128',
      expectedCloseDate: '2024-10-15',
      status: 'WON',
      priority: 'Medium',
      createdDate: '2023-12-10'
    },
    {
      id: 'deal-7',
      name: 'Solaris Field Operations Portal',
      customerId: 'cust-6',
      customerName: 'Solaris Energy Solutions',
      value: 36000,
      pipeline: 'Mid-Market SaaS',
      stage: 'Closed Lost',
      probability: 0,
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      expectedCloseDate: '2024-09-30',
      status: 'LOST',
      priority: 'Low',
      createdDate: '2023-11-12',
      notes: 'Competitor undercut on pricing with bundled legacy license.'
    }
  ]);

  // Computed Kanban Stages
  readonly pipelineStages = computed(() => {
    const allDeals = this.deals();
    const stages: DealStage[] = ['Lead', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const colors: Record<DealStage, string> = {
      'Lead': '#3B82F6',
      'Qualification': '#8B5CF6',
      'Proposal': '#F59E0B',
      'Negotiation': '#0EA5E9',
      'Closed Won': '#10B981',
      'Closed Lost': '#EF4444'
    };

    return stages.map(st => {
      const stageDeals = allDeals.filter(d => d.stage === st);
      const total = stageDeals.reduce((sum, d) => sum + d.value, 0);
      return {
        id: st.toLowerCase().replace(/\s+/g, '-'),
        name: st,
        color: colors[st],
        deals: stageDeals,
        totalValue: total
      };
    });
  });

  // ---------------------------------------------------------------------------
  // ACTIVITIES & TASKS
  // ---------------------------------------------------------------------------
  readonly activities = signal<Activity[]>([
    {
      id: 'act-1',
      type: 'Meeting',
      title: 'Quarterly Executive Review & SLA Alignment',
      description: 'Discussed Q4 expansion and unified security compliance requirements with VP of Infrastructure.',
      customerName: 'CloudScale Dynamics',
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      time: '10:30 AM',
      date: 'Today',
      status: 'COMPLETED',
      duration: '45 mins'
    },
    {
      id: 'act-2',
      type: 'Call',
      title: 'Contract Negotiation Call with Legal Team',
      description: 'Reviewed indemnification clauses in section 8.2 of the enterprise SaaS contract.',
      customerName: 'Apex Health Systems',
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      time: '02:00 PM',
      date: 'Today',
      status: 'PENDING',
      duration: '30 mins'
    },
    {
      id: 'act-3',
      type: 'Email',
      title: 'Sent Proposal Deck & Custom ROI Model v2',
      description: 'Delivered tailored pricing matrix for 250 enterprise seats with automated workflow add-on.',
      customerName: 'Quantum Matrix Corp',
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      time: '11:15 AM',
      date: 'Yesterday',
      status: 'COMPLETED'
    },
    {
      id: 'act-4',
      type: 'Task',
      title: 'Prepare Technical Architecture Diagram for Board',
      description: 'Draft zero-trust data pipeline flow for enterprise security audit review.',
      customerName: 'Vanguard FinTech Group',
      assignedTo: 'Sophia Chang',
      assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
      time: '04:45 PM',
      date: 'Yesterday',
      status: 'COMPLETED'
    },
    {
      id: 'act-5',
      type: 'Follow-up',
      title: 'Post-Demo Follow-up with Chief Medical Officer',
      description: 'Check in regarding HIPAA compliance documentation submitted last week.',
      customerName: 'BioGenix Labs',
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      time: '09:00 AM',
      date: 'Tomorrow',
      status: 'PENDING'
    }
  ]);

  readonly tasks = signal<TaskItem[]>([
    {
      id: 'tsk-1',
      title: 'Finalize Master Services Agreement (MSA) with Apex Health',
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      dueDate: 'Today, 5:00 PM',
      priority: 'Urgent',
      status: 'In Progress',
      relatedCustomer: 'Apex Health Systems',
      relatedDeal: 'Apex Health Multi-Site Telehealth Rollout',
      isOverdue: false
    },
    {
      id: 'tsk-2',
      title: 'Send Enterprise pricing proposal to Quantum Matrix CTO',
      assignedTo: 'Marcus Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      dueDate: 'Today, 6:30 PM',
      priority: 'High',
      status: 'Todo',
      relatedCustomer: 'Quantum Matrix Corp',
      relatedDeal: 'Quantum Matrix Pilot',
      isOverdue: false
    },
    {
      id: 'tsk-3',
      title: 'Submit SOC 2 Type II audit report to Vanguard Compliance',
      assignedTo: 'Sophia Chang',
      assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
      dueDate: 'Yesterday',
      priority: 'High',
      status: 'In Progress',
      relatedCustomer: 'Vanguard FinTech Group',
      isOverdue: true
    },
    {
      id: 'tsk-4',
      title: 'Configure custom webhooks for CloudScale sandbox',
      assignedTo: 'David Patel',
      assignedAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128',
      dueDate: 'Nov 14, 2024',
      priority: 'Medium',
      status: 'Completed',
      relatedCustomer: 'CloudScale Dynamics',
      isOverdue: false
    },
    {
      id: 'tsk-5',
      title: 'Conduct weekly pipeline review with SDR team',
      assignedTo: 'Elena Rostova',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      dueDate: 'Nov 16, 2024',
      priority: 'Low',
      status: 'Todo',
      isOverdue: false
    }
  ]);

  // ---------------------------------------------------------------------------
  // CONTACTS
  // ---------------------------------------------------------------------------
  readonly contacts = signal<Contact[]>([
    {
      id: 'cnt-1',
      name: 'Jonathan Reynolds',
      company: 'Quantum Matrix Corp',
      jobTitle: 'Chief Technology Officer',
      email: 'jreynolds@quantummatrix.io',
      phone: '+1 (415) 890-2341',
      department: 'Executive Engineering',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=128',
      status: 'Lead',
      lastContacted: '2 hours ago',
      dealsCount: 1
    },
    {
      id: 'cnt-2',
      name: 'Dr. Evelyn Morales',
      company: 'Apex Health Systems',
      jobTitle: 'Chief Information Officer',
      email: 'emorales@apexhealth.org',
      phone: '+1 (617) 555-4921',
      department: 'Clinical Operations',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      status: 'Active',
      lastContacted: 'Yesterday',
      dealsCount: 3
    },
    {
      id: 'cnt-3',
      name: 'Julian Sterling',
      company: 'Vanguard FinTech Group',
      jobTitle: 'Managing Director & Head of Risk',
      email: 'j.sterling@vanguardfintech.com',
      phone: '+1 (212) 555-8930',
      department: 'Risk & Strategy',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=128',
      status: 'Active',
      lastContacted: '3 days ago',
      dealsCount: 4
    },
    {
      id: 'cnt-4',
      name: 'Rebecca Henderson',
      company: 'CloudScale Dynamics',
      jobTitle: 'VP of Platform Engineering',
      email: 'rebecca.h@cloudscale.io',
      phone: '+1 (415) 555-0182',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128',
      status: 'Active',
      lastContacted: 'Today',
      dealsCount: 2
    }
  ]);

  // ---------------------------------------------------------------------------
  // NOTES
  // ---------------------------------------------------------------------------
  readonly notes = signal<NoteItem[]>([
    {
      id: 'not-1',
      title: 'CloudScale Q4 Expansion Strategy & Security Notes',
      content: 'Customer is expanding from 80 seats to 250 enterprise seats. Crucial requirements: custom SAML/SSO integration, SCIM provisioning, and granular audit log export via REST API.',
      relatedTo: 'CloudScale Dynamics',
      relatedType: 'Customer',
      createdBy: 'Marcus Vance',
      updatedDate: 'Today, 11:20 AM',
      isPinned: true,
      tags: ['Expansion', 'SSO', 'Enterprise']
    },
    {
      id: 'not-2',
      title: 'Apex Health Executive Committee Priorities',
      content: 'Board meeting approved the Phase 1 rollout budget ($185k). Main obstacle resolved: HIPAA Business Associate Agreement (BAA) signed off by Chief Legal Officer.',
      relatedTo: 'Apex Health Systems',
      relatedType: 'Customer',
      createdBy: 'Elena Rostova',
      updatedDate: 'Yesterday, 3:15 PM',
      isPinned: true,
      tags: ['Healthcare', 'Legal', 'Contract']
    },
    {
      id: 'not-3',
      title: 'Quantum Matrix Competitive Intel - Salesforce Migration',
      content: 'Prospect currently paying $220/user/mo on Salesforce Lightning with heavy friction around custom reporting. Our automated dashboard insights and instant pipeline sync demoed strongly.',
      relatedTo: 'Quantum Matrix Corp',
      relatedType: 'Lead',
      createdBy: 'Marcus Vance',
      updatedDate: 'Oct 28, 2024',
      isPinned: false,
      tags: ['Migration', 'Competitive']
    }
  ]);

  // ---------------------------------------------------------------------------
  // EMAIL INBOX & MESSAGES
  // ---------------------------------------------------------------------------
  readonly emails = signal<EmailMessage[]>([
    {
      id: 'em-1',
      folder: 'inbox',
      senderName: 'Dr. Evelyn Morales',
      senderEmail: 'emorales@apexhealth.org',
      recipientEmail: 'alex.mercer@nexuscrm.io',
      subject: 'Re: Nexus CRM Enterprise Master Agreement - Approved with Minor Redlines',
      preview: 'Hi Alex, Our legal counsel has reviewed the data residency clauses and approved the agreement with minor redlines...',
      body: `Hi Alex,\n\nOur legal counsel has reviewed the data residency clauses and approved the agreement with minor redlines attached in Schedule C. We are ready to execute the contract as soon as the countersigned copy is available.\n\nPlease send over the DocuSign envelope when ready.\n\nBest regards,\nDr. Evelyn Morales\nCIO, Apex Health Systems`,
      date: 'Today',
      time: '10:14 AM',
      isRead: false,
      isStarred: true,
      tag: 'Customer',
      hasAttachment: true
    },
    {
      id: 'em-2',
      folder: 'inbox',
      senderName: 'Jonathan Reynolds',
      senderEmail: 'jreynolds@quantummatrix.io',
      recipientEmail: 'alex.mercer@nexuscrm.io',
      subject: 'Question on Nexus API Rate Limits & Webhooks',
      preview: 'Hello Team, We are testing the webhook event stream for real-time contact creation. Could you clarify our burst quota...',
      body: `Hello Team,\n\nWe are testing the webhook event stream for real-time contact creation. Could you clarify our burst quota during bulk CSV ingestion? We are planning an initial load of ~150,000 records.\n\nThanks,\nJonathan Reynolds\nCTO, Quantum Matrix`,
      date: 'Today',
      time: '08:45 AM',
      isRead: true,
      isStarred: false,
      tag: 'Lead',
      hasAttachment: false
    },
    {
      id: 'em-3',
      folder: 'inbox',
      senderName: 'Rebecca Henderson',
      senderEmail: 'rebecca.h@cloudscale.io',
      recipientEmail: 'alex.mercer@nexuscrm.io',
      subject: 'Scheduled Maintenance Confirmation & Q4 Kickoff',
      preview: 'Thank you for coordinating the sandbox environment update. Everything tested green on our staging instance...',
      body: `Thank you for coordinating the sandbox environment update. Everything tested green on our staging instance. Looking forward to our quarterly business review next Tuesday.\n\nCheers,\nRebecca Henderson\nVP Engineering, CloudScale`,
      date: 'Yesterday',
      time: '04:12 PM',
      isRead: true,
      isStarred: false,
      tag: 'Customer',
      hasAttachment: false
    },
    {
      id: 'em-4',
      folder: 'sent',
      senderName: 'Alex Mercer',
      senderEmail: 'alex.mercer@nexuscrm.io',
      recipientEmail: 'billing@apexhealth.org',
      subject: 'Invoice #INV-2024-984 - Nexus Enterprise Subscription',
      preview: 'Please find attached invoice #INV-2024-984 for your annual subscription period beginning Dec 1st...',
      body: `Please find attached invoice #INV-2024-984 for your annual subscription period beginning Dec 1st.\n\nThank you for choosing Nexus CRM!\n\nBest regards,\nAlex Mercer`,
      date: 'Oct 29, 2024',
      time: '02:00 PM',
      isRead: true,
      isStarred: false,
      tag: 'Customer',
      hasAttachment: true
    }
  ]);

  readonly emailTemplates = signal<EmailTemplate[]>([
    {
      id: 'tmpl-1',
      title: 'Enterprise Demo Follow-up & Next Steps',
      subject: 'Nexus CRM Demo - Next Steps & Implementation Architecture',
      category: 'Sales',
      preview: 'Thank you for taking the time to explore Nexus CRM today. As discussed, attached is...',
      body: `Hi {{ContactName}},\n\nThank you for taking the time to explore Nexus CRM today. It was great learning about {{CompanyName}}'s goals for scaling your sales organization.\n\nAs discussed during our call, I've outlined our recommended rollout plan and attached the ROI analysis.\n\nWould you be open to a 20-minute technical session on Thursday at 2 PM to walk through the custom integration requirements?\n\nBest regards,\n{{SenderName}}\nNexus CRM Team`
    },
    {
      id: 'tmpl-2',
      title: 'Contract Proposal & Executive Summary',
      subject: 'Proposal & Commercial Terms: Nexus CRM for {{CompanyName}}',
      category: 'Closing',
      preview: 'We are thrilled to present our tailored enterprise proposal for {{CompanyName}}...',
      body: `Hi {{ContactName}},\n\nWe are thrilled to present our tailored enterprise proposal for {{CompanyName}}. Based on our conversations, we have packaged 250 enterprise licenses with priority SLA support.\n\nPlease find the full proposal attached. Feel free to reply directly or schedule time with our legal team if any adjustments are needed.\n\nBest,\n{{SenderName}}`
    },
    {
      id: 'tmpl-3',
      title: 'Customer Onboarding Kickoff Welcome',
      subject: 'Welcome to Nexus CRM! Your dedicated Customer Success Kickoff',
      category: 'Customer Success',
      preview: 'Welcome to the Nexus CRM family! We are excited to partner with your team...',
      body: `Hi {{ContactName}},\n\nWelcome to the Nexus CRM family! We are delighted to partner with {{CompanyName}} on your revenue transformation.\n\nYour dedicated Customer Success Architect is {{CSMName}}. You can access your enterprise admin portal at https://app.nexuscrm.io.\n\nLet's schedule your 45-minute onboarding session here: [Booking Link]\n\nWarm regards,\n{{SenderName}}`
    }
  ]);

  // ---------------------------------------------------------------------------
  // USERS & PERMISSIONS
  // ---------------------------------------------------------------------------
  readonly users = signal<UserProfile[]>([
    {
      id: 'usr-101',
      name: 'Alex Mercer',
      email: 'alex.mercer@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128',
      initials: 'AM',
      role: 'SUPER_ADMIN',
      department: 'Executive Leadership',
      designation: 'Chief Revenue Officer',
      status: 'ACTIVE',
      lastLogin: 'Today, 09:42 AM',
      phone: '+1 (555) 349-2810'
    },
    {
      id: 'usr-102',
      name: 'Elena Rostova',
      email: 'elena.r@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      initials: 'ER',
      role: 'SALES_MANAGER',
      department: 'Enterprise Sales',
      designation: 'Sales Director (EMEA)',
      status: 'ACTIVE',
      lastLogin: 'Today, 08:30 AM',
      phone: '+44 20 7946 0912'
    },
    {
      id: 'usr-103',
      name: 'Marcus Vance',
      email: 'marcus.v@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      initials: 'MV',
      role: 'SALES_REP',
      department: 'Mid-Market Sales',
      designation: 'Senior Account Executive',
      status: 'ACTIVE',
      lastLogin: 'Today, 10:15 AM',
      phone: '+1 (555) 882-9014'
    },
    {
      id: 'usr-104',
      name: 'Sarah Jenkins',
      email: 'sarah.j@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128',
      initials: 'SJ',
      role: 'SUPPORT_AGENT',
      department: 'Customer Success',
      designation: 'Tier-3 Support Lead',
      status: 'ACTIVE',
      lastLogin: 'Yesterday, 05:22 PM',
      phone: '+1 (555) 743-1122'
    },
    {
      id: 'usr-105',
      name: 'Sophia Chang',
      email: 'sophia.c@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
      initials: 'SC',
      role: 'SALES_REP',
      department: 'FinTech & Capital Markets',
      designation: 'Senior Account Executive',
      status: 'ACTIVE',
      lastLogin: 'Today, 09:10 AM',
      phone: '+1 (212) 555-1980'
    },
    {
      id: 'usr-106',
      name: 'David Patel',
      email: 'david.p@nexuscrm.io',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128',
      initials: 'DP',
      role: 'SALES_REP',
      department: 'Enterprise Sales',
      designation: 'Enterprise Account Executive',
      status: 'ACTIVE',
      lastLogin: 'Yesterday, 03:40 PM',
      phone: '+1 (512) 555-4433'
    }
  ]);

  readonly permissionsMatrix = signal<PermissionRow[]>([
    { module: 'Customers', view: true, create: true, update: true, delete: true, export: true },
    { module: 'Contacts', view: true, create: true, update: true, delete: true, export: true },
    { module: 'Leads', view: true, create: true, update: true, delete: true, export: true },
    { module: 'Deals & Pipeline', view: true, create: true, update: true, delete: false, export: true },
    { module: 'Activities & Tasks', view: true, create: true, update: true, delete: true, export: true },
    { module: 'Email Communications', view: true, create: true, update: true, delete: false, export: false },
    { module: 'Reports & Analytics', view: true, create: true, update: true, delete: false, export: true },
    { module: 'User Management', view: true, create: true, update: true, delete: true, export: true },
    { module: 'Audit Logs', view: true, create: false, update: false, delete: false, export: true },
    { module: 'System Settings', view: true, create: true, update: true, delete: false, export: false }
  ]);

  // ---------------------------------------------------------------------------
  // AUDIT LOGS
  // ---------------------------------------------------------------------------
  readonly auditLogs = signal<AuditLogItem[]>([
    {
      id: 'aud-9801',
      user: 'Alex Mercer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128',
      action: 'UPDATE',
      module: 'Deals',
      recordId: 'DEAL-9042',
      changes: [
        { field: 'stage', oldVal: 'Proposal', newVal: 'Negotiation' },
        { field: 'probability', oldVal: '75%', newVal: '90%' }
      ],
      ipAddress: '192.168.1.104',
      timestamp: 'Today, 10:45:22 AM'
    },
    {
      id: 'aud-9802',
      user: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
      action: 'CREATE',
      module: 'Leads',
      recordId: 'LEAD-2041',
      changes: [
        { field: 'status', oldVal: 'null', newVal: 'NEW' },
        { field: 'assignedTo', oldVal: 'null', newVal: 'Elena Rostova' }
      ],
      ipAddress: '82.165.197.1',
      timestamp: 'Today, 09:20:15 AM'
    },
    {
      id: 'aud-9803',
      user: 'Marcus Vance',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
      action: 'EXPORT',
      module: 'Customers',
      recordId: 'BATCH-EXPORT-12',
      changes: [{ field: 'format', oldVal: 'none', newVal: 'XLSX (12,480 rows)' }],
      ipAddress: '73.189.44.120',
      timestamp: 'Yesterday, 04:30:00 PM'
    },
    {
      id: 'aud-9804',
      user: 'Sarah Jenkins',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128',
      action: 'LOGIN',
      module: 'Users',
      recordId: 'USR-104',
      changes: [{ field: 'authMethod', oldVal: 'none', newVal: 'Okta SSO (MFA verified)' }],
      ipAddress: '104.28.211.90',
      timestamp: 'Yesterday, 08:00:11 AM'
    },
    {
      id: 'aud-9805',
      user: 'Alex Mercer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128',
      action: 'DELETE',
      module: 'Settings',
      recordId: 'WEBHOOK-402',
      changes: [{ field: 'webhookEndpoint', oldVal: 'https://hooks.slack.com/services/old', newVal: 'DELETED' }],
      ipAddress: '192.168.1.104',
      timestamp: 'Nov 02, 2024, 02:14:50 PM'
    }
  ]);

  // ---------------------------------------------------------------------------
  // NOTIFICATIONS
  // ---------------------------------------------------------------------------
  readonly notifications = signal<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'DEAL',
      title: 'Deal Stage Advanced',
      message: 'Apex Health Multi-Site Telehealth was moved to Negotiation ($185k).',
      time: '15 mins ago',
      isRead: false,
      link: '/deals'
    },
    {
      id: 'notif-2',
      type: 'LEAD',
      title: 'High-Score Lead Inbound',
      message: 'Quantum Matrix Corp (Lead Score: 94) submitted executive demo request.',
      time: '1 hour ago',
      isRead: false,
      link: '/leads'
    },
    {
      id: 'notif-3',
      type: 'TASK',
      title: 'Task Overdue Reminder',
      message: 'Submit SOC 2 Type II audit report to Vanguard Compliance was due yesterday.',
      time: '3 hours ago',
      isRead: false,
      link: '/tasks'
    },
    {
      id: 'notif-4',
      type: 'MENTION',
      title: 'Marcus Vance mentioned you',
      message: 'In note "CloudScale Q4 Expansion": @Alex please review custom SLA term.',
      time: 'Yesterday',
      isRead: true,
      link: '/notes'
    },
    {
      id: 'notif-5',
      type: 'SYSTEM',
      title: 'Automated Backup Completed',
      message: 'Encrypted snapshot generated successfully (3.4 GB stored in us-east-1).',
      time: 'Yesterday',
      isRead: true,
      link: '/audit'
    }
  ]);

  readonly unreadNotificationsCount = computed(() => {
    return this.notifications().filter(n => !n.isRead).length;
  });

  // ---------------------------------------------------------------------------
  // MUTATION METHODS
  // ---------------------------------------------------------------------------

  markAllNotificationsRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
    this.api.markAllNotificationsRead().subscribe({ error: () => {} });
  }

  addCustomer(customer: Omit<Customer, 'id' | 'code' | 'createdDate'>): Customer {
    const code = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      code,
      createdDate: new Date().toISOString().split('T')[0]
    };
    this.customers.update(list => [newCustomer, ...list]);

    // Async persist to Spring Boot backend
    this.api.createCustomer({
      companyName: customer.company || customer.name,
      firstName: customer.name.split(' ')[0] || 'Customer',
      lastName: customer.name.split(' ')[1] || 'Account',
      email: customer.email,
      phone: customer.phone,
      website: customer.website,
      industry: customer.industry,
      annualRevenue: customer.annualRevenue,
      status: customer.status,
      source: 'WEBSITE',
      address: customer.address
    }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.customers.update(list =>
            list.map(c => (c.id === newCustomer.id ? { ...c, id: res.data.id, code: res.data.customerCode || c.code } : c))
          );
        }
      },
      error: () => {}
    });

    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): void {
    this.customers.update(list => list.map(c => (c.id === id ? { ...c, ...updates } : c)));
    this.api.updateCustomer(id, updates).subscribe({ error: () => {} });
  }

  deleteCustomer(id: string): void {
    this.customers.update(list => list.filter(c => c.id !== id));
    this.api.deleteCustomer(id).subscribe({ error: () => {} });
  }

  addLead(lead: Omit<Lead, 'id' | 'createdAt'>): Lead {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.leads.update(list => [newLead, ...list]);

    // Async persist to Spring Boot backend
    this.api.createLead({
      firstName: lead.name.split(' ')[0] || 'Lead',
      lastName: lead.name.split(' ')[1] || 'Contact',
      companyName: lead.company,
      email: lead.email,
      phone: lead.phone,
      source: lead.source?.toUpperCase().replace(/\s+/g, '_') || 'WEBSITE',
      industry: lead.industry || 'Technology',
      estimatedValue: lead.estimatedValue,
      status: lead.status,
      priority: lead.priority?.toUpperCase() || 'MEDIUM',
      expectedCloseDate: lead.expectedClosingDate
    }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.leads.update(list =>
            list.map(l => (l.id === newLead.id ? { ...l, id: res.data.id } : l))
          );
        }
      },
      error: () => {}
    });

    return newLead;
  }

  updateLeadStatus(id: string, status: Lead['status']): void {
    this.leads.update(list => list.map(l => (l.id === id ? { ...l, status } : l)));
    this.api.updateLeadStatus(id, status).subscribe({ error: () => {} });
  }

  convertLeadToDeal(leadId: string, dealName: string, dealValue: number): Deal {
    const targetLead = this.leads().find(l => l.id === leadId);
    if (!targetLead) throw new Error('Lead not found');

    // Mark lead as converted
    this.updateLeadStatus(leadId, 'CONVERTED');

    // Create Customer
    const newCust = this.addCustomer({
      name: targetLead.company,
      company: targetLead.company,
      email: targetLead.email,
      phone: targetLead.phone,
      industry: targetLead.industry || 'Technology',
      status: 'ACTIVE',
      assignedTo: targetLead.assignedTo,
      assignedAvatar: targetLead.assignedAvatar,
      annualRevenue: dealValue * 1.5,
      totalDeals: 1,
      website: `https://${targetLead.company.toLowerCase().replace(/\s+/g, '')}.com`,
      address: targetLead.location || 'San Francisco, CA'
    });

    // Create Deal
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      name: dealName || `${targetLead.company} Enterprise Contract`,
      customerId: newCust.id,
      customerName: newCust.name,
      value: dealValue || targetLead.estimatedValue,
      pipeline: 'Enterprise SaaS',
      stage: 'Proposal',
      probability: 60,
      assignedTo: targetLead.assignedTo,
      assignedAvatar: targetLead.assignedAvatar,
      expectedCloseDate: targetLead.expectedClosingDate,
      status: 'OPEN',
      priority: 'High',
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.deals.update(list => [newDeal, ...list]);

    // Backend convert API
    this.api.convertLead(leadId, {
      dealName: newDeal.name,
      dealAmount: newDeal.value
    }).subscribe({ error: () => {} });

    return newDeal;
  }

  updateDealStage(dealId: string, newStage: DealStage): void {
    this.deals.update(list =>
      list.map(d => {
        if (d.id !== dealId) return d;
        let status: Deal['status'] = 'OPEN';
        let prob = d.probability;
        if (newStage === 'Closed Won') {
          status = 'WON';
          prob = 100;
        } else if (newStage === 'Closed Lost') {
          status = 'LOST';
          prob = 0;
        } else if (newStage === 'Negotiation') {
          prob = 90;
        } else if (newStage === 'Proposal') {
          prob = 75;
        } else if (newStage === 'Qualification') {
          prob = 40;
        } else if (newStage === 'Lead') {
          prob = 20;
        }
        return { ...d, stage: newStage, status, probability: prob };
      })
    );

    if (newStage === 'Closed Won') {
      this.api.markDealWon(dealId, 'Closed Won from CRM Board').subscribe({ error: () => {} });
    } else if (newStage === 'Closed Lost') {
      this.api.markDealLost(dealId, 'Closed Lost from CRM Board').subscribe({ error: () => {} });
    }
  }

  addDeal(deal: Omit<Deal, 'id' | 'createdDate'>): Deal {
    const newDeal: Deal = {
      ...deal,
      id: `deal-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    this.deals.update(list => [newDeal, ...list]);

    this.api.createDeal({
      name: deal.name,
      amount: deal.value,
      pipelineId: '61a6d972-69d4-4854-8434-2a4fbeb159c1',
      stageId: '390bd9b2-3096-4175-8aea-14ec87aa237b',
      currency: 'USD',
      expectedCloseDate: deal.expectedCloseDate,
      probability: deal.probability || 50,
      status: deal.status || 'OPEN'
    }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.deals.update(list =>
            list.map(d => (d.id === newDeal.id ? { ...d, id: res.data.id } : d))
          );
        }
      },
      error: () => {}
    });

    return newDeal;
  }

  toggleTaskCompleted(taskId: string): void {
    this.tasks.update(list =>
      list.map(t => {
        if (t.id !== taskId) return t;
        const newStatus = t.status === 'Completed' ? 'Todo' : 'Completed';
        return { ...t, status: newStatus, isOverdue: false };
      })
    );

    const task = this.tasks().find(t => t.id === taskId);
    if (task) {
      this.api.updateTask(taskId, {
        status: task.status === 'Completed' ? 'COMPLETED' : 'PENDING'
      }).subscribe({ error: () => {} });
    }
  }

  addTask(task: Omit<TaskItem, 'id'>): TaskItem {
    const newTask: TaskItem = {
      ...task,
      id: `tsk-${Date.now()}`
    };
    this.tasks.update(list => [newTask, ...list]);

    this.api.createTask({
      title: task.title,
      priority: task.priority?.toUpperCase() || 'HIGH',
      status: 'PENDING'
    }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.tasks.update(list =>
            list.map(t => (t.id === newTask.id ? { ...t, id: res.data.id } : t))
          );
        }
      },
      error: () => {}
    });

    return newTask;
  }

  addActivity(activity: Omit<Activity, 'id' | 'date'>): Activity {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}`,
      date: 'Today'
    };
    this.activities.update(list => [newActivity, ...list]);

    this.api.createActivity({
      subject: activity.title,
      description: activity.description,
      type: activity.type?.toUpperCase() || 'MEETING',
      priority: 'HIGH',
      status: 'PENDING'
    }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.activities.update(list =>
            list.map(a => (a.id === newActivity.id ? { ...a, id: res.data.id } : a))
          );
        }
      },
      error: () => {}
    });

    return newActivity;
  }

  addNote(note: Omit<NoteItem, 'id' | 'updatedDate'>): NoteItem {
    const newNote: NoteItem = {
      ...note,
      id: `not-${Date.now()}`,
      updatedDate: 'Just now'
    };
    this.notes.update(list => [newNote, ...list]);

    this.api.createNote({
      title: note.title,
      content: note.content
    }).subscribe({ error: () => {} });

    return newNote;
  }

  sendEmail(email: Omit<EmailMessage, 'id' | 'date' | 'time' | 'folder' | 'isRead'>): EmailMessage {
    const newEmail: EmailMessage = {
      ...email,
      id: `em-${Date.now()}`,
      folder: 'sent',
      date: 'Today',
      time: 'Just now',
      isRead: true
    };
    this.emails.update(list => [newEmail, ...list]);

    this.api.sendEmail({
      recipient: email.recipientEmail,
      subject: email.subject,
      body: email.body
    }).subscribe({ error: () => {} });

    return newEmail;
  }

  togglePermission(module: string, action: 'view' | 'create' | 'update' | 'delete' | 'export'): void {
    this.permissionsMatrix.update(list =>
      list.map(row => {
        if (row.module !== module) return row;
        return { ...row, [action]: !row[action] };
      })
    );
  }
}
