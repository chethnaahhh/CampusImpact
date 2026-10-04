import type { CampusData, EventItem, Registration, Vendor, FeedbackEntry } from '../types';

const eventOne: EventItem = {
  id: 'evt-1',
  name: 'Innovation & Impact Summit',
  description: 'A cross-campus event connecting students, faculty, and community partners around sprint-based innovation projects.',
  type: 'Seminar',
  organizer: 'Student Innovation Office',
  team: 'Program Management',
  startDate: '2026-10-18T09:30:00',
  endDate: '2026-10-18T15:00:00',
  venue: 'North Campus Innovation Hall',
  capacity: 180,
  targetAudience: 'Students, alumni, and faculty',
  objectives: ['Foster collaboration across disciplines', 'Showcase innovation projects', 'Connect student teams with employers'],
  successCriteria: ['At least 150 attendees', '60% of teams pitch', 'Average satisfaction above 4.2'],
  plannedBudget: 8200,
  status: 'Upcoming',
  taskChecklist: ['Finalize agenda', 'Confirm keynote speakers', 'Publish registration page', 'Arrange catering'],
  milestones: ['Agenda approved', 'Volunteers assigned', 'Venue confirmed'],
  budgetItems: [
    { id: 'b-1', category: 'Venue', planned: 2200, actual: 2100, notes: 'Room rental and AV support' },
    { id: 'b-2', category: 'Food', planned: 1500, actual: 1350, notes: 'Breakfast and lunch' },
    { id: 'b-3', category: 'Equipment', planned: 1200, actual: 900, notes: 'Projector and lighting' },
    { id: 'b-4', category: 'Marketing', planned: 900, actual: 700, notes: 'Flyers and digital ads' },
    { id: 'b-5', category: 'Travel', planned: 1000, actual: 1050, notes: 'Speaker travel' },
    { id: 'b-6', category: 'Prizes', planned: 800, actual: 400, notes: 'Judging awards' },
    { id: 'b-7', category: 'Materials', planned: 600, actual: 550, notes: 'Signage and handouts' },
  ],
};

const eventTwo: EventItem = {
  id: 'evt-2',
  name: 'Campus Sustainability Challenge',
  description: 'A hands-on challenge focused on sustainability solutions, prototypes, and student-led action plans.',
  type: 'Hackathon',
  organizer: 'Sustainability Office',
  team: 'Operations + Faculty',
  startDate: '2026-09-12T10:00:00',
  endDate: '2026-09-13T18:30:00',
  venue: 'STEM Commons',
  capacity: 120,
  targetAudience: 'STEM and business students',
  objectives: ['Reduce planning waste', 'Prototype solutions', 'Create actionable campus recommendations'],
  successCriteria: ['50+ teams', '90% of teams complete prototype', '4.0 average satisfaction'],
  plannedBudget: 6600,
  status: 'Completed',
  taskChecklist: ['Confirm judges', 'Order student kits', 'Review submissions', 'Closeout report'],
  milestones: ['Teams registered', 'Prototype review complete', 'Results communicated'],
  budgetItems: [
    { id: 'b-8', category: 'Venue', planned: 1800, actual: 1700, notes: 'Room booking' },
    { id: 'b-9', category: 'Food', planned: 1300, actual: 1280, notes: 'Meals for participants' },
    { id: 'b-10', category: 'Equipment', planned: 1500, actual: 1800, notes: '3D printers and lab access' },
    { id: 'b-11', category: 'Marketing', planned: 700, actual: 650, notes: 'Campus campaign' },
    { id: 'b-12', category: 'Materials', planned: 900, actual: 1000, notes: 'Prototype kits' },
    { id: 'b-13', category: 'Prizes', planned: 600, actual: 550, notes: 'Awards' },
  ],
};

const eventThree: EventItem = {
  id: 'evt-3',
  name: 'Leadership in Action Forum',
  description: 'A moderated leadership talk series that invites alumni and community experts to discuss civic engagement.',
  type: 'Workshop',
  organizer: 'Career Development Center',
  team: 'Community Engagement',
  startDate: '2026-11-04T12:00:00',
  endDate: '2026-11-04T16:30:00',
  venue: 'Riverside Hall',
  capacity: 96,
  targetAudience: 'Undergraduate leaders',
  objectives: ['Improve leadership readiness', 'Enable reflection and action planning', 'Increase participation in student organizations'],
  successCriteria: ['90 registrations', '75% attendance', 'Average feedback above 4.5'],
  plannedBudget: 4200,
  status: 'Planning',
  taskChecklist: ['Confirm speakers', 'Create agenda', 'Set registration target', 'Finalize sponsor list'],
  milestones: ['Speaker invites sent', 'Budget approved'],
  budgetItems: [
    { id: 'b-14', category: 'Venue', planned: 1200, actual: 0, notes: 'Forum room rental' },
    { id: 'b-15', category: 'Food', planned: 800, actual: 0, notes: 'Networking lunch' },
    { id: 'b-16', category: 'Marketing', planned: 500, actual: 0, notes: 'Event promotion' },
    { id: 'b-17', category: 'Travel', planned: 700, actual: 0, notes: 'Speaker travel' },
  ],
};

const registrations: Registration[] = [
  { id: 'reg-1001', eventId: 'evt-1', name: 'Ava Thompson', email: 'ava.demo@sample.com', organization: 'School of Design', studentId: 'STU-1001', status: 'Attended', createdAt: '2026-09-20T09:00:00' },
  { id: 'reg-1002', eventId: 'evt-1', name: 'Ethan Kim', email: 'ethan.demo@sample.com', organization: 'Data Science Club', studentId: 'STU-1002', status: 'Registered', createdAt: '2026-09-21T12:00:00' },
  { id: 'reg-1003', eventId: 'evt-1', name: 'Maya Patel', email: 'maya.demo@sample.com', organization: 'Entrepreneurship Lab', studentId: 'STU-1003', status: 'Registered', createdAt: '2026-09-22T13:00:00' },
  { id: 'reg-1004', eventId: 'evt-1', name: 'Jonah Lee', email: 'jonah.demo@sample.com', organization: 'Student Union', studentId: 'STU-1004', status: 'Waitlisted', createdAt: '2026-09-22T14:00:00' },
  { id: 'reg-2001', eventId: 'evt-2', name: 'Nia Gomez', email: 'nia.demo@sample.com', organization: 'Engineering Society', studentId: 'STU-2001', status: 'Attended', createdAt: '2026-08-10T10:00:00' },
  { id: 'reg-2002', eventId: 'evt-2', name: 'Lucas Martin', email: 'lucas.demo@sample.com', organization: 'Sustainability Council', studentId: 'STU-2002', status: 'Attended', createdAt: '2026-08-10T10:00:00' },
  { id: 'reg-2003', eventId: 'evt-2', name: 'Priya Shah', email: 'priya.demo@sample.com', organization: 'Business School', studentId: 'STU-2003', status: 'Cancelled', createdAt: '2026-08-11T13:00:00' },
  { id: 'reg-2004', eventId: 'evt-2', name: 'Owen Brooks', email: 'owen.demo@sample.com', organization: 'Computer Science', studentId: 'STU-2004', status: 'Registered', createdAt: '2026-08-12T09:30:00' },
];

const vendors: Vendor[] = [
  { id: 'ven-1', eventId: 'evt-1', name: 'North Campus Catering', category: 'Food', contactName: 'Harper Diaz', phone: '555-0101', email: 'harper@demo.com', agreedAmount: 2200, actualAmount: 2100, paymentStatus: 'Paid', notes: 'Breakfast and lunch service' },
  { id: 'ven-2', eventId: 'evt-1', name: 'Zenith A/V', category: 'Equipment', contactName: 'Miles Chen', phone: '555-0102', email: 'miles@demo.com', agreedAmount: 1800, actualAmount: 500, paymentStatus: 'Partially Paid', notes: 'Projector, mic, and staging' },
  { id: 'ven-3', eventId: 'evt-2', name: 'GreenBuild Supplies', category: 'Materials', contactName: 'Sarah Ali', phone: '555-0103', email: 'sarah@demo.com', agreedAmount: 1200, actualAmount: 1200, paymentStatus: 'Paid', notes: 'Prototype materials' },
  { id: 'ven-4', eventId: 'evt-3', name: 'Summit Media', category: 'Marketing', contactName: 'Isaac Ford', phone: '555-0104', email: 'isaac@demo.com', agreedAmount: 900, actualAmount: 0, paymentStatus: 'Pending', notes: 'Poster and alumni campaign' },
];

const feedback: FeedbackEntry[] = [
  { id: 'fb-1', eventId: 'evt-2', rating: 4, organization: 4, contentQuality: 5, venue: 4, overallSatisfaction: 4, comments: 'Very engaging and well organized.', keyFindings: 'The judges were highly appreciated.', recommendations: 'Add more guided mentor sessions.', createdAt: '2026-09-15T13:00:00' },
  { id: 'fb-2', eventId: 'evt-2', rating: 5, organization: 5, contentQuality: 5, venue: 4, overallSatisfaction: 5, comments: 'Excellent teamwork and clear outcomes.', keyFindings: 'Students loved the mentoring track.', recommendations: 'Keep the sustainability focus front and center.', createdAt: '2026-09-16T15:30:00' },
  { id: 'fb-3', eventId: 'evt-1', rating: 4, organization: 4, contentQuality: 4, venue: 3, overallSatisfaction: 4, comments: 'Strong speaker lineup and helpful community connections.', keyFindings: 'Need more break time for networking.', recommendations: 'Increase Q&A time and signage visibility.', createdAt: '2026-09-27T12:00:00' },
];

export const demoData: CampusData = {
  events: [eventOne, eventTwo, eventThree],
  registrations,
  vendors,
  feedback,
  currency: 'USD',
};
