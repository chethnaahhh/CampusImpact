import type { CampusData, DashboardMetrics, EventItem, Registration, Vendor } from '../types';

export function calculateAttendanceRate(eventId: string, registrations: Registration[]) {
  const eligible = registrations.filter((r) => r.eventId === eventId && r.status !== 'Cancelled' && r.status !== 'Waitlisted');
  const attended = eligible.filter((r) => r.status === 'Attended').length;
  if (!eligible.length) return 0;
  return (attended / eligible.length) * 100;
}

export function getDashboardMetrics(data: CampusData): DashboardMetrics {
  const totalEvents = data.events.length;
  const upcomingEvents = data.events.filter((event) => ['Planning', 'Upcoming', 'In Progress'].includes(event.status)).length;
  const completedEvents = data.events.filter((event) => event.status === 'Completed').length;

  const activeRegistrations = data.registrations.filter((r) => r.status !== 'Cancelled');
  const totalRegistrations = activeRegistrations.length;

  const totalPlanned = data.events.reduce((sum, event) => sum + Number(event.plannedBudget || 0), 0);
  const actualSpend = data.events.reduce((sum, event) => {
    const eventActual = event.budgetItems.reduce((budgetSum, item) => budgetSum + Number(item.actual || 0), 0);
    return sum + eventActual;
  }, 0);
  const remainingBudget = totalPlanned - actualSpend;
  const budgetUtilization = totalPlanned > 0 ? (actualSpend / totalPlanned) * 100 : 0;

  const pendingVendors = data.vendors.filter((vendor) => vendor.paymentStatus !== 'Paid').length;

  const totalFeedback = data.feedback.length;
  const averageRating = totalFeedback > 0 ? data.feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / totalFeedback : 0;

  const attendanceValues = data.events.map((event) => calculateAttendanceRate(event.id, data.registrations));
  const attendanceRate = attendanceValues.length ? attendanceValues.reduce((sum, val) => sum + val, 0) / attendanceValues.length : 0;

  return {
    totalEvents,
    upcomingEvents,
    completedEvents,
    totalRegistrations,
    attendanceRate,
    plannedBudget: totalPlanned,
    actualSpend,
    remainingBudget,
    budgetUtilization,
    pendingVendors,
    averageRating,
    totalFeedback,
  };
}

export function getEventBudget(event: EventItem) {
  const planned = event.budgetItems.reduce((sum, item) => sum + Number(item.planned || 0), 0);
  const actual = event.budgetItems.reduce((sum, item) => sum + Number(item.actual || 0), 0);
  return { planned, actual, remaining: planned - actual, utilization: planned > 0 ? (actual / planned) * 100 : 0 };
}

export function getVendorSummary(vendors: Vendor[]) {
  const totalAgreed = vendors.reduce((sum, vendor) => sum + Number(vendor.agreedAmount || 0), 0);
  const totalPaid = vendors.reduce((sum, vendor) => sum + Number(vendor.actualAmount || 0), 0);
  return { totalAgreed, totalPaid, remaining: totalAgreed - totalPaid };
}

export function toCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function buildCsvRows(data: Record<string, string | number>[]) {
  const headers = Object.keys(data[0] ?? {});
  const csvRows = [headers.join(',')];
  for (const row of data) {
    csvRows.push(headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(','));
  }
  return csvRows.join('\n');
}
