export type EventStatus = 'Planning' | 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
export type RegistrationStatus = 'Registered' | 'Waitlisted' | 'Cancelled' | 'Attended';
export type BudgetCategory = 'Venue' | 'Food' | 'Equipment' | 'Marketing' | 'Travel' | 'Prizes' | 'Materials' | 'Miscellaneous';
export type VendorPaymentStatus = 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  planned: number;
  actual: number;
  notes: string;
}

export interface EventItem {
  id: string;
  name: string;
  description: string;
  type: string;
  organizer: string;
  team: string;
  startDate: string;
  endDate: string;
  venue: string;
  capacity: number;
  targetAudience: string;
  objectives: string[];
  successCriteria: string[];
  plannedBudget: number;
  status: EventStatus;
  taskChecklist: string[];
  milestones: string[];
  budgetItems: BudgetItem[];
}

export interface Registration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  organization: string;
  studentId: string;
  status: RegistrationStatus;
  createdAt: string;
  checkedInAt?: string;
}

export interface Vendor {
  id: string;
  eventId: string;
  name: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  agreedAmount: number;
  actualAmount: number;
  paymentStatus: VendorPaymentStatus;
  notes: string;
}

export interface FeedbackEntry {
  id: string;
  eventId: string;
  rating: number;
  organization: number;
  contentQuality: number;
  venue: number;
  overallSatisfaction: number;
  comments: string;
  keyFindings: string;
  recommendations: string;
  createdAt: string;
}

export interface CampusData {
  events: EventItem[];
  registrations: Registration[];
  vendors: Vendor[];
  feedback: FeedbackEntry[];
  currency: string;
}

export interface DashboardMetrics {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalRegistrations: number;
  attendanceRate: number;
  plannedBudget: number;
  actualSpend: number;
  remainingBudget: number;
  budgetUtilization: number;
  pendingVendors: number;
  averageRating: number;
  totalFeedback: number;
}
