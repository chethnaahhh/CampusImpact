# CampusImpact

CampusImpact is a portfolio-ready event management dashboard for campus and university teams. It helps organize events, manage registrations, track budgets, coordinate vendors, monitor attendance, and summarize outcomes from a single operational view.

## Problem it solves

Campus and student program teams often manage event planning in disconnected tools such as spreadsheets, email threads, and standalone budget trackers. CampusImpact brings these activities together in one dashboard so teams can track commitments, monitor performance, and maintain a consistent event record.

## Verified features

- Dashboard with KPI cards and charts derived from event data
- Event create, edit, delete, search, and filter flows
- Registration tracking with capacity, waitlist awareness, duplicate prevention by email/event, and CSV export
- Budget planner with planned vs actual values and vendor payment summary
- Vendor directory with linked event data and payment status
- Attendance tracking and rate calculations based on eligible registrations
- Feedback summary and event outcomes area using demo sample feedback
- Local persistence using browser localStorage with demo-data reset
- Responsive SaaS-style dashboard layout for desktop and smaller screens

## Screenshots

This environment did not capture graphical screenshots automatically. The application is running locally and can be opened in the browser at http://localhost:5173.

## Technology stack

- React
- Vite
- TypeScript
- Recharts
- Lucide React
- Vitest
- jsdom
- localStorage-based persistence

## Installation and run instructions

1. Navigate to the app directory:
   cd /Users/apple/campus-impact
2. Install dependencies:
   npm install
3. Run the development server:
   npm run dev
4. Open the local URL reported by Vite, usually http://localhost:5173

## Test and build commands

- Run tests: npm test
- Run production build: npm run build
- Start preview: npm run preview

## Data persistence limitations

This is a frontend-only demo. Data is stored in browser localStorage and is not synchronized across devices or users. If the local browser data is cleared, the app will fall back to the built-in demo dataset. No secure backend or authentication layer is implemented.

## Demo data explanation

The application uses clearly labeled demo sample data for events, vendors, registrations, budgets, and feedback. All dashboard metrics and charts are calculated from this stored data and update as data changes during the session.

## Known limitations and future improvements

- No multi-user backend or cloud sync
- No real authentication or role-based access control
- Simple CSV export only, with no PDF export in the current implementation
- Demo-only sample data and simulated outcomes
- Limited advanced analytics and report customization

## Notes

This project was created as a separate application in /Users/apple/campus-impact and deliberately kept outside the unrelated parent repository to avoid overwriting other work.
