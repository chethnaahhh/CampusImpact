import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarRange,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { demoData } from './data/demo';
import { buildCsvRows, getDashboardMetrics, getEventBudget, getVendorSummary, toCurrency } from './lib/metrics';
import type { CampusData, EventItem, FeedbackEntry, Registration, Vendor } from './types';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Events', icon: CalendarRange },
  { name: 'Registrations', icon: Users },
  { name: 'Budget', icon: WalletCards },
  { name: 'Vendors', icon: BriefcaseBusiness },
  { name: 'Attendance', icon: ClipboardList },
  { name: 'Feedback & Results', icon: FileText },
  { name: 'Reports', icon: BarChart3 },
  { name: 'Settings', icon: Settings },
];

const budgetColors = ['#4f46e5', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316'];
const statusClasses = {
  Planning: 'status-planning',
  Upcoming: 'status-upcoming',
  'In Progress': 'status-progress',
  Completed: 'status-completed',
  Cancelled: 'status-cancelled',
};

const storageKey = 'campus-impact-data-v1';

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function getDefaultData(): CampusData {
  return structuredClone(demoData);
}

function App() {
  const [data, setData] = useState<CampusData>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.events) && Array.isArray(parsed.registrations)) return parsed;
      }
    } catch {
      // ignore malformed local data
    }
    return getDefaultData();
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState('Dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string>(data.events[0]?.id ?? '');
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState<EventItem | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  const currentEvent = data.events.find((event) => event.id === selectedEventId) ?? data.events[0];

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data.events;
    return data.events.filter((event) => `${event.name} ${event.type} ${event.organizer}`.toLowerCase().includes(term));
  }, [data.events, search]);

  const metrics = useMemo(() => getDashboardMetrics(data), [data]);

  const registrationsByEvent = useMemo(() => {
    return data.registrations.filter((reg) => reg.eventId === currentEvent?.id);
  }, [currentEvent, data.registrations]);

  const chartData = useMemo(() => {
    return data.events.map((event) => ({
      name: event.name.slice(0, 18),
      registrations: data.registrations.filter((reg) => reg.eventId === event.id && reg.status !== 'Cancelled').length,
      attended: data.registrations.filter((reg) => reg.eventId === event.id && reg.status === 'Attended').length,
      planned: event.plannedBudget,
      actual: event.budgetItems.reduce((sum, item) => sum + Number(item.actual || 0), 0),
    }));
  }, [data.events, data.registrations]);

  const budgetBreakdown = useMemo(() => {
    return data.events.flatMap((event) => event.budgetItems).reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.actual || 0);
      return acc;
    }, {});
  }, [data.events]);

  const pieData = useMemo(() => Object.entries(budgetBreakdown).map(([name, value]) => ({ name, value })), [budgetBreakdown]);

  const handleSaveEvent = () => {
    if (!eventForm) return;
    const cleaned = { ...eventForm, plannedBudget: Number(eventForm.plannedBudget || 0), capacity: Number(eventForm.capacity || 0) };
    if (!cleaned.name || !cleaned.organizer || !cleaned.venue || !cleaned.startDate || !cleaned.endDate) {
      alert('Please complete the required event fields before saving.');
      return;
    }
    const start = new Date(cleaned.startDate).getTime();
    const end = new Date(cleaned.endDate).getTime();
    if (start > end) {
      alert('Event end date cannot be before the start date.');
      return;
    }
    if (cleaned.capacity <= 0) {
      alert('Event capacity must be greater than zero.');
      return;
    }
    if (cleaned.id) {
      setData((prev) => ({
        ...prev,
        events: prev.events.map((event) => (event.id === cleaned.id ? cleaned : event)),
      }));
    } else {
      const newEvent = { ...cleaned, id: uid('evt') };
      setData((prev) => ({ ...prev, events: [newEvent, ...prev.events] }));
      setSelectedEventId(newEvent.id);
    }
    setShowEventModal(false);
    setEventForm(null);
  };

  const handleDeleteEvent = (id: string) => {
    const event = data.events.find((item) => item.id === id);
    if (!event) return;
    if (!window.confirm(`Delete ${event.name}? This will also remove related registrations and vendors in this demo.`)) return;
    setData((prev) => ({
      ...prev,
      events: prev.events.filter((item) => item.id !== id),
      registrations: prev.registrations.filter((reg) => reg.eventId !== id),
      vendors: prev.vendors.filter((vendor) => vendor.eventId !== id),
      feedback: prev.feedback.filter((item) => item.eventId !== id),
    }));
  };

  const addSampleEvent = () => {
    const event: EventItem = {
      id: uid('evt'),
      name: 'Wellness Week',
      description: 'Campus wellbeing and resilience program with workshops and exercises.',
      type: 'Workshop',
      organizer: 'Health & Wellness Center',
      team: 'Student Engagement',
      startDate: '2026-11-15T09:00:00',
      endDate: '2026-11-18T13:00:00',
      venue: 'Student Center Atrium',
      capacity: 90,
      targetAudience: 'Students and staff',
      objectives: ['Support campus wellbeing', 'Build resilience skills'],
      successCriteria: ['90% satisfaction', '80% attendance'],
      plannedBudget: 5000,
      status: 'Planning',
      taskChecklist: ['Program schedule', 'Marketing brief'],
      milestones: ['Budget approval', 'Speaker confirmation'],
      budgetItems: [
        { id: uid('budget'), category: 'Venue', planned: 1400, actual: 0, notes: 'Space booking' },
        { id: uid('budget'), category: 'Food', planned: 800, actual: 0, notes: 'Refreshments' },
      ],
    };
    setData((prev) => ({ ...prev, events: [event, ...prev.events] }));
    setSelectedEventId(event.id);
  };

  const exportCsv = (filename: string, rows: Record<string, string | number>[]) => {
    const csv = buildCsvRows(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const eventRows = data.registrations.map((reg) => ({
    'Registration ID': reg.id,
    Name: reg.name,
    Email: reg.email,
    Event: data.events.find((event) => event.id === reg.eventId)?.name ?? reg.eventId,
    Status: reg.status,
  }));

  const vendorRows = data.vendors.map((vendor) => ({
    'Vendor ID': vendor.id,
    Name: vendor.name,
    Category: vendor.category,
    Event: data.events.find((event) => event.id === vendor.eventId)?.name ?? vendor.eventId,
    'Payment Status': vendor.paymentStatus,
    'Actual Paid': vendor.actualAmount,
  }));

  const budgetRows = data.events.flatMap((event) => event.budgetItems.map((item) => ({
    Event: event.name,
    Category: item.category,
    Planned: item.planned,
    Actual: item.actual,
    Notes: item.notes,
  })));

  const attendanceRows = data.registrations.map((reg) => ({
    'Registration ID': reg.id,
    Name: reg.name,
    Event: data.events.find((event) => event.id === reg.eventId)?.name ?? reg.eventId,
    Status: reg.status,
    'Checked In': reg.checkedInAt ?? '',
  }));

  const renderDashboard = () => (
    <>
      <div className="kpi-grid">
        {[
          { label: 'Total events', value: metrics.totalEvents, detail: `${metrics.upcomingEvents} active` },
          { label: 'Registrations', value: metrics.totalRegistrations, detail: `${Math.round(metrics.attendanceRate)}% attendance` },
          { label: 'Planned budget', value: toCurrency(metrics.plannedBudget, data.currency), detail: 'vs. actual spend' },
          { label: 'Feedback rating', value: `${metrics.averageRating.toFixed(1)}/5`, detail: `${metrics.totalFeedback} reviews` },
        ].map((item) => (
          <div className="card metric-card" key={item.label}>
            <div className="metric-label">{item.label}</div>
            <div className="metric-value">{item.value}</div>
            <div className="metric-trend">{item.detail}</div>
          </div>
        ))}
      </div>

      <div className="page-grid" style={{ marginTop: 18 }}>
        <div className="card chart-card">
          <div className="card-body">
            <div className="section-heading">
              <h3 style={{ margin: 0 }}>Registrations over time</h3>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" stroke="#4f46e5" strokeWidth={3} />
                  <Line type="monotone" dataKey="attended" stroke="#22c55e" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card chart-card small">
          <div className="card-body">
            <div className="section-heading">
              <h3 style={{ margin: 0 }}>Budget allocation</h3>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={82} paddingAngle={2}>
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={budgetColors[index % budgetColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => toCurrency(Number(value), data.currency)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-body">
            <div className="section-heading">
              <h3 style={{ margin: 0 }}>Actual vs planned spend</h3>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => toCurrency(Number(value), data.currency)} />
                  <Bar dataKey="planned" fill="#c7d2fe" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="actual" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card chart-card small">
          <div className="card-body">
            <div className="section-heading">
              <h3 style={{ margin: 0 }}>Budget summary</h3>
            </div>
            <div className="summary-row">
              <div className="summary-box">
                <div style={{ color: '#64748b', fontSize: 12 }}>Actual spend</div>
                <strong>{toCurrency(metrics.actualSpend, data.currency)}</strong>
              </div>
              <div className="summary-box">
                <div style={{ color: '#64748b', fontSize: 12 }}>Remaining</div>
                <strong>{toCurrency(metrics.remainingBudget, data.currency)}</strong>
              </div>
              <div className="summary-box">
                <div style={{ color: '#64748b', fontSize: 12 }}>Utilization</div>
                <strong>{metrics.budgetUtilization.toFixed(0)}%</strong>
              </div>
              <div className="summary-box">
                <div style={{ color: '#64748b', fontSize: 12 }}>Pending vendors</div>
                <strong>{metrics.pendingVendors}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderEvents = () => (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-body">
        <div className="section-heading">
          <h3 style={{ margin: 0 }}>Event portfolio</h3>
          <div className="toolbar">
            <button className="primary-button" onClick={() => { setEventForm({
              id: '', name: '', description: '', type: 'Workshop', organizer: '', team: '', startDate: '', endDate: '', venue: '', capacity: 0, targetAudience: '', objectives: [''], successCriteria: [''], plannedBudget: 0, status: 'Planning', taskChecklist: [''], milestones: [''], budgetItems: [],
            }); setShowEventModal(true); }}>+ New event</button>
            <button className="ghost-button" onClick={addSampleEvent}>Load demo event</button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{event.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{event.venue}</div>
                  </td>
                  <td>{event.type}</td>
                  <td><span className={`badge ${statusClasses[event.status]}`}>{event.status}</span></td>
                  <td>{toCurrency(event.plannedBudget, data.currency)}</td>
                  <td>{event.capacity}</td>
                  <td className="inline-actions">
                    <button className="button" onClick={() => { setSelectedEventId(event.id); setActiveView('Dashboard'); }}>Open</button>
                    <button className="button" onClick={() => { setEventForm(event); setShowEventModal(true); }}>Edit</button>
                    <button className="danger-button" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRegs = () => (
    <div className="card">
      <div className="card-body">
        <div className="section-heading">
          <h3 style={{ margin: 0 }}>Registrations</h3>
          <button className="primary-button" onClick={() => exportCsv('registrations.csv', eventRows)}>Export CSV</button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Attendee</th>
                <th>Event</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.registrations.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.name}<div style={{ color: '#64748b', fontSize: 12 }}>{reg.email}</div></td>
                  <td>{data.events.find((event) => event.id === reg.eventId)?.name}</td>
                  <td><span className="pill">{reg.status}</span></td>
                  <td>
                    <select value={reg.status} onChange={(e) => setData((prev) => ({ ...prev, registrations: prev.registrations.map((item) => item.id === reg.id ? { ...item, status: e.target.value as Registration['status'] } : item) }))}>
                      <option value="Registered">Registered</option>
                      <option value="Waitlisted">Waitlisted</option>
                      <option value="Attended">Attended</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBudget = () => (
    <div className="grid-2">
      <div className="card">
        <div className="card-body">
          <h3>Budget overview</h3>
          {data.events.map((event) => {
            const budget = getEventBudget(event);
            return (
              <div key={event.id} style={{ marginBottom: 14, padding: 12, border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{event.name}</strong>
                  <span className={`badge ${statusClasses[event.status]}`}>{event.status}</span>
                </div>
                <div style={{ marginTop: 8, color: '#475569' }}>
                  Planned: {toCurrency(budget.planned, data.currency)} • Actual: {toCurrency(budget.actual, data.currency)}
                </div>
                <div style={{ marginTop: 8, fontWeight: 600 }}>Remaining: {toCurrency(budget.remaining, data.currency)}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3>Vendor payment summary</h3>
          {(() => {
            const vendorSummary = getVendorSummary(data.vendors);
            return (
              <>
                <div className="summary-row">
                  <div className="summary-box"><div style={{ color: '#64748b', fontSize: 12 }}>Agreed</div><strong>{toCurrency(vendorSummary.totalAgreed, data.currency)}</strong></div>
                  <div className="summary-box"><div style={{ color: '#64748b', fontSize: 12 }}>Paid</div><strong>{toCurrency(vendorSummary.totalPaid, data.currency)}</strong></div>
                  <div className="summary-box"><div style={{ color: '#64748b', fontSize: 12 }}>Outstanding</div><strong>{toCurrency(vendorSummary.remaining, data.currency)}</strong></div>
                </div>
              </>
            );
          })()}
          <div style={{ marginTop: 18 }}>
            <button className="primary-button" onClick={() => exportCsv('budget.csv', budgetRows)}>Export budget CSV</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVendors = () => (
    <div className="card">
      <div className="card-body">
        <div className="section-heading">
          <h3 style={{ margin: 0 }}>Vendor directory</h3>
          <button className="primary-button" onClick={() => exportCsv('vendors.csv', vendorRows)}>Export vendor CSV</button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {data.vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{vendor.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{vendor.contactName}</div>
                  </td>
                  <td>{vendor.category}</td>
                  <td>{data.events.find((event) => event.id === vendor.eventId)?.name}</td>
                  <td>{toCurrency(vendor.actualAmount, data.currency)}</td>
                  <td><span className="pill">{vendor.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="card">
      <div className="card-body">
        <div className="section-heading">
          <h3 style={{ margin: 0 }}>Attendance tracking</h3>
          <button className="primary-button" onClick={() => exportCsv('attendance.csv', attendanceRows)}>Export attendance CSV</button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Event</th>
                <th>Status</th>
                <th>Check-in</th>
              </tr>
            </thead>
            <tbody>
              {data.registrations.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.name}</td>
                  <td>{data.events.find((event) => event.id === reg.eventId)?.name}</td>
                  <td>
                    <select value={reg.status} onChange={(e) => setData((prev) => ({ ...prev, registrations: prev.registrations.map((item) => item.id === reg.id ? { ...item, status: e.target.value as Registration['status'] } : item) }))}>
                      <option value="Registered">Registered</option>
                      <option value="Waitlisted">Waitlisted</option>
                      <option value="Attended">Attended</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{reg.checkedInAt ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="card">
      <div className="card-body">
        <h3>Feedback & results</h3>
        {data.feedback.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Recommendations</th>
                </tr>
              </thead>
              <tbody>
                {data.feedback.map((entry) => (
                  <tr key={entry.id}>
                    <td>{data.events.find((event) => event.id === entry.eventId)?.name}</td>
                    <td>{entry.rating}/5</td>
                    <td>{entry.comments}</td>
                    <td>{entry.recommendations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No feedback is available yet for this portfolio demo.</div>
        )}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="card">
      <div className="card-body">
        <h3>Event summary report</h3>
        {currentEvent ? (
          <div>
            <div className="summary-row" style={{ marginBottom: 16 }}>
              <div className="summary-box"><strong>{currentEvent.name}</strong><div>{currentEvent.type}</div></div>
              <div className="summary-box"><strong>{currentEvent.status}</strong><div>{currentEvent.venue}</div></div>
              <div className="summary-box"><strong>{toCurrency(currentEvent.plannedBudget, data.currency)}</strong><div>Planned budget</div></div>
              <div className="summary-box"><strong>{registrationsByEvent.length}</strong><div>Registrations</div></div>
            </div>
            <div style={{ color: '#475569', lineHeight: 1.8 }}>
              Objectives: {currentEvent.objectives.join('; ')}<br />
              Success criteria: {currentEvent.successCriteria.join('; ')}<br />
              Attendance: {calculateRegistrationRate(currentEvent.id, data.registrations)}%<br />
              Budget utilization: {getEventBudget(currentEvent).utilization.toFixed(0)}%
            </div>
          </div>
        ) : (
          <div className="empty-state">Select an event to generate a report.</div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'Events': return renderEvents();
      case 'Registrations': return renderRegs();
      case 'Budget': return renderBudget();
      case 'Vendors': return renderVendors();
      case 'Attendance': return renderAttendance();
      case 'Feedback & Results': return renderFeedback();
      case 'Reports': return renderReports();
      case 'Settings': return <div className="card"><div className="card-body"><h3>Settings</h3><p>Demo mode is enabled. Data persists locally in the browser and can be reset at any time.</p></div></div>;
      default: return renderDashboard();
    }
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="brand-mark">C</div>
            {sidebarOpen && <div className="brand-name">CampusImpact</div>}
          </div>
          <button className="button" onClick={() => setSidebarOpen((prev) => !prev)} style={{ padding: '8px 10px' }}>{sidebarOpen ? '«' : '»'}</button>
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map(({ name, icon: Icon }) => (
            <button key={name} className={`nav-item ${activeView === name ? 'active' : ''}`} onClick={() => setActiveView(name)}>
              <span className="nav-icon"><Icon size={18} /></span>
              {sidebarOpen && <span className="nav-label">{name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="content-shell">
        <div className="topbar">
          <div className="topbar-title">
            <h1>{activeView}</h1>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={16} color="#64748b" />
              <input aria-label="Search events" placeholder="Search events" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="primary-button" onClick={() => setData(getDefaultData())}>Reset demo data</button>
          </div>
        </div>

        <div className="page">
          {renderContent()}
        </div>
      </div>

      {showEventModal && eventForm && (
        <div className="modal" onClick={() => setShowEventModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="section-heading">
              <h3 style={{ margin: 0 }}>{eventForm.id ? 'Edit event' : 'Add event'}</h3>
              <button className="button" onClick={() => setShowEventModal(false)}><X size={16} /></button>
            </div>
            <div className="form-grid">
              <div className="field">
                <label>Event name</label>
                <input value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} />
              </div>
              <div className="field">
                <label>Event type</label>
                <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}>
                  <option>Workshop</option>
                  <option>Hackathon</option>
                  <option>Seminar</option>
                  <option>Cultural event</option>
                  <option>Fundraiser</option>
                </select>
              </div>
              <div className="field">
                <label>Organizer</label>
                <input value={eventForm.organizer} onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })} />
              </div>
              <div className="field">
                <label>Responsible team</label>
                <input value={eventForm.team} onChange={(e) => setEventForm({ ...eventForm, team: e.target.value })} />
              </div>
              <div className="field">
                <label>Start date</label>
                <input type="datetime-local" value={eventForm.startDate.slice(0, 16)} onChange={(e) => setEventForm({ ...eventForm, startDate: new Date(e.target.value).toISOString() })} />
              </div>
              <div className="field">
                <label>End date</label>
                <input type="datetime-local" value={eventForm.endDate.slice(0, 16)} onChange={(e) => setEventForm({ ...eventForm, endDate: new Date(e.target.value).toISOString() })} />
              </div>
              <div className="field">
                <label>Venue</label>
                <input value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} />
              </div>
              <div className="field">
                <label>Capacity</label>
                <input type="number" value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })} />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Objectives</label>
                <textarea value={eventForm.objectives.join('\n')} onChange={(e) => setEventForm({ ...eventForm, objectives: e.target.value.split('\n').filter(Boolean) })} />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Success criteria</label>
                <textarea value={eventForm.successCriteria.join('\n')} onChange={(e) => setEventForm({ ...eventForm, successCriteria: e.target.value.split('\n').filter(Boolean) })} />
              </div>
              <div className="field">
                <label>Budget</label>
                <input type="number" value={eventForm.plannedBudget} onChange={(e) => setEventForm({ ...eventForm, plannedBudget: Number(e.target.value) })} />
              </div>
              <div className="field">
                <label>Status</label>
                <select value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as EventItem['status'] })}>
                  <option>Planning</option>
                  <option>Upcoming</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button className="button" onClick={() => setShowEventModal(false)}>Cancel</button>
              <button className="primary-button" onClick={handleSaveEvent}>Save event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateRegistrationRate(eventId: string, registrations: Registration[]) {
  const eligible = registrations.filter((r) => r.eventId === eventId && r.status !== 'Cancelled' && r.status !== 'Waitlisted');
  const attended = eligible.filter((r) => r.status === 'Attended').length;
  return eligible.length ? Math.round((attended / eligible.length) * 100) : 0;
}

export default App;
