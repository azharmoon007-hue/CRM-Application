export type RoleType =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SALES_MANAGER'
  | 'SALES_REP'
  | 'SUPPORT_AGENT'
  | 'MARKETING_TEAM'
  | 'EXECUTIVE';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  role: RoleType;
  department: string;
  designation: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  lastLogin: string;
  phone?: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'UNQUALIFIED' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: 'Website' | 'Referral' | 'Social Media' | 'Advertisement' | 'Partner' | 'Direct';
  status: LeadStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  estimatedValue: number;
  score: number;
  assignedTo: string;
  assignedAvatar?: string;
  expectedClosingDate: string;
  createdAt: string;
  title?: string;
  industry?: string;
  location?: string;
  notes?: string;
}

export type CustomerStatus = 'ACTIVE' | 'PROSPECT' | 'CHURNED' | 'INACTIVE';

export interface Customer {
  id: string;
  code: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  status: CustomerStatus;
  assignedTo: string;
  assignedAvatar?: string;
  logoUrl?: string;
  annualRevenue: number;
  totalDeals: number;
  website: string;
  address: string;
  createdDate: string;
}

export type DealStage = 'Lead' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Deal {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  value: number;
  pipeline: string;
  stage: DealStage;
  probability: number;
  assignedTo: string;
  assignedAvatar?: string;
  expectedCloseDate: string;
  status: 'OPEN' | 'WON' | 'LOST';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdDate: string;
  notes?: string;
}

export interface PipelineStage {
  id: string;
  name: DealStage;
  color: string;
  deals: Deal[];
  totalValue: number;
}

export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Task' | 'Note' | 'Follow-up';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  customerName: string;
  assignedTo: string;
  assignedAvatar?: string;
  time: string;
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  duration?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  assignedTo: string;
  assignedAvatar?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'Completed';
  relatedCustomer?: string;
  relatedDeal?: string;
  isOverdue?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  department: string;
  avatar: string;
  status: 'Active' | 'Lead' | 'Inactive';
  lastContacted: string;
  dealsCount: number;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  relatedTo: string;
  relatedType: 'Customer' | 'Lead' | 'Deal';
  createdBy: string;
  createdAvatar?: string;
  updatedDate: string;
  isPinned: boolean;
  tags: string[];
}

export interface EmailMessage {
  id: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'templates';
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  tag?: 'Customer' | 'Lead' | 'Support' | 'Internal';
  hasAttachment?: boolean;
}

export interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  category: string;
  preview: string;
  body: string;
}

export interface AuditLogItem {
  id: string;
  user: string;
  userAvatar?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT';
  module: 'Customers' | 'Leads' | 'Deals' | 'Pipelines' | 'Users' | 'Settings';
  recordId: string;
  changes: { field: string; oldVal: string; newVal: string }[];
  ipAddress: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: 'DEAL' | 'LEAD' | 'TASK' | 'MENTION' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link?: string;
}

export interface PermissionRow {
  module: string;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}
