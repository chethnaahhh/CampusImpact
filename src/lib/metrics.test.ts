import { describe, expect, it } from 'vitest';
import { calculateAttendanceRate, getDashboardMetrics } from './metrics';
import type { CampusData } from '../types';

const sampleData: CampusData = {
  currency: 'USD',
  events: [
    {
      id: 'evt-1',
      name: 'Innovation Summit',
      description: 'Campus innovation summit',
      type: 'Seminar',
      organizer: 'Student Life',
      team: 'Event Ops',
      startDate: '2026-10-15T10:00:00',
      endDate: '2026-10-15T16:00:00',
      venue: 'Innovation Hall',
      capacity: 150,
      targetAudience: 'Students and faculty',
      objectives: ['Build networking'],
      successCriteria: ['150 registrations'],
      plannedBudget: 5000,
      status: 'Upcoming',
      taskChecklist: ['Finalize agenda'],
      milestones: ['Agenda approved'],
      budgetItems: [
        { id: 'b1', category: 'Venue', planned: 1500, actual: 1400, notes: 'Room rental' },
        { id: 'b2', category: 'Food', planned: 900, actual: 1100, notes: 'Catering' },
      ],
    },
  ],
  registrations: [
    { id: 'r1', eventId: 'evt-1', name: 'Alice', email: 'alice@example.com', organization: 'Business Club', studentId: 'STU-001', status: 'Attended', createdAt: '2026-09-20' },
    { id: 'r2', eventId: 'evt-1', name: 'Bob', email: 'bob@example.com', organization: 'Engineering', studentId: 'STU-002', status: 'Registered', createdAt: '2026-09-22' },
    { id: 'r3', eventId: 'evt-1', name: 'Cara', email: 'cara@example.com', organization: 'CS', studentId: 'STU-003', status: 'Cancelled', createdAt: '2026-09-23' },
  ],
  vendors: [
    { id: 'v1', eventId: 'evt-1', name: 'Campus Catering', category: 'Food', contactName: 'Dana', phone: '555-0100', email: 'dana@demo.com', agreedAmount: 1200, actualAmount: 1100, paymentStatus: 'Paid', notes: 'Catering contract' },
  ],
  feedback: [
    { id: 'f1', eventId: 'evt-1', rating: 4, organization: 5, contentQuality: 4, venue: 3, overallSatisfaction: 4, comments: 'Helpful event', keyFindings: 'Need more time for Q&A', recommendations: 'Add extra break', createdAt: '2026-09-24' },
  ],
};

describe('CampusImpact metrics', () => {
  it('calculates attendance for eligible registrations', () => {
    expect(calculateAttendanceRate('evt-1', sampleData.registrations)).toBe(50);
  });

  it('computes aggregate dashboard metrics from event data', () => {
    const metrics = getDashboardMetrics(sampleData);
    expect(metrics.totalEvents).toBe(1);
    expect(metrics.totalRegistrations).toBe(2);
    expect(metrics.averageRating).toBe(4);
    expect(metrics.plannedBudget).toBe(5000);
    expect(metrics.actualSpend).toBe(2500);
    expect(metrics.remainingBudget).toBe(2500);
    expect(metrics.pendingVendors).toBe(0);
  });
});
