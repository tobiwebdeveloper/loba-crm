# MVP Implementation Plan - Detailed Roadmap

## Overview
This is a detailed sprint-by-sprint breakdown to get Loba CRM to MVP release in 3-4 weeks.

---

## WEEK 1: Foundation (Days 1-5)

### SPRINT 1.1: Dashboard Completion (Days 1-2) | Effort: 4 hours

**Objective:** Dashboard becomes fully functional with real data

**Tasks:**
```
[Done ] Task 1.1.1: Wire StatCard metrics to prospectData
    - Import prospect data in Dashboard.vue
    - Calculate: total prospects, new (status: new), conversion rate
    - Time: 45 min

[ Done ] Task 1.1.2: Complete TodayActions component
    - Show today's tasks/follow-ups
    - Show recent calls
    - Add empty state
    - Time: 1 hour

[ Done ] Task 1.1.3: Populate PipelineOverview
    - Calculate prospects by stage
    - Display stage breakdown
    - Add visual indicators
    - Time: 1 hour

[ Done ] Task 1.1.4: Dashboard styling & responsiveness
    - Ensure cards stack on smaller screens
    - Test layout integrity
    - Time: 45 min
```

**Definition of Done:**
- Dashboard displays accurate metrics
- All sections are populated
- No console errors
- Mobile-responsive layout

---

### SPRINT 1.2: Prospects CRUD (Days 2-4) | Effort: 8 hours

**Objective:** Full prospect management (Create, Read, Update, Delete)

**Tasks:**
```
[ ] Task 1.2.1: ProspectTable enhancements
    - Add sorting by column (name, status, stage, date)
    - Implement pagination (10 items per page)
    - Add row actions (View, Edit, Delete buttons)
    - Time: 2 hours

[ ] Task 1.2.2: ProspectForm improvements
    - Add form validation (required fields, email format)
    - Add all required fields (name, business, email, phone, status, stage, notes)
    - Implement cancel/save functionality
    - Time: 1.5 hours

[ ] Task 1.2.3: Create ProspectDetail page
    - Create new page: Prospects/:id.vue
    - Display full prospect information
    - Add edit button launching form in modal
    - Show related activities (calls, tasks, notes)
    - Time: 2 hours

[ ] Task 1.2.4: Delete/Archive functionality
    - Add soft-delete (archive) option
    - Implement restore capability
    - Add confirmation dialog
    - Time: 1 hour

[ ] Task 1.2.5: Add new prospect workflow
    - Add floating action button or top button
    - Modal form for quick add
    - Auto-focus on first field
    - Time: 1 hour

[ ] Task 1.2.6: Advanced filtering & search
    - Filter by status (New, Contacted, Qualified, etc.)
    - Filter by stage (Lead, Prospect, Opportunity, etc.)
    - Search by name or business
    - Time: 1 hour
```

**Definition of Done:**
- Can create new prospect
- Can view prospect details
- Can edit prospect
- Can delete/archive prospect
- Filters and search work correctly
- No data loss on page refresh (mock data sufficient)

---

### SPRINT 1.3: Calls Feature (Days 4-5) | Effort: 6 hours

**Objective:** Implement basic call logging and tracking

**Tasks:**
```
[ Done ] Task 1.3.1: Create callData.ts
    - Define Call interface/type
    - Create mock call data (5-10 sample calls)
    - Link calls to prospects by ID
    - Time: 45 min

[ Done ] Task 1.3.2: Build CallForm component
    - Fields: prospect, date, duration, outcome (Completed/No-Answer/Callback), notes
    - Add required field validation
    - Time: 1.5 hours

[ ] Task 1.3.3: Build CallList component
    - Display calls in table format
    - Show prospect name, date, duration, outcome
    - Sort by date (newest first)
    - Time: 1.5 hours

[ ] Task 1.3.4: Implement Calls page
    - Replace empty Calls.vue with list + quick-add button
    - Add search by prospect name
    - Add filter by outcome
    - Time: 1 hour

[ ] Task 1.3.5: Link calls to prospects
    - Show recent calls on ProspectDetail
    - Show call count on ProspectCard
    - Time: 1 hour
```

**Definition of Done:**
- Can log a new call
- Can view call history
- Calls are linked to prospects
- Recent calls visible on prospect detail
- Calls page is functional

---

## WEEK 2: Core Features (Days 6-12)

### SPRINT 2.1: Follow-ups & Tasks (Days 6-8) | Effort: 8 hours

**Objective:** Workflow management for follow-ups and tasks

**Tasks:**
```
[ ] Task 2.1.1: Create taskData.ts
    - Define Task interface
    - Create mock tasks
    - Link to prospects and calls
    - Time: 45 min

[ ] Task 2.1.2: Build TaskCard component
    - Display task title, due date, priority, status
    - Add checkbox to mark complete
    - Show priority badge (High, Medium, Low)
    - Time: 1 hour

[ ] Task 2.1.3: Build TaskForm component
    - Fields: title, description, due date, priority, assigned to, status
    - Link to prospect (optional)
    - Time: 1.5 hours

[ ] Task 2.1.4: Implement FollowUps page
    - Show tasks filtered by due date
    - Overdue section
    - Today section
    - Upcoming section
    - Time: 2 hours

[ ] Task 2.1.5: Quick-add task from anywhere
    - Floating action button or command palette
    - Quick task creation modal
    - Time: 1.5 hours

[ ] Task 2.1.6: Task notifications/indicators
    - Show overdue count in sidebar
    - Highlight in header
    - Time: 1 hour
```

**Definition of Done:**
- Can create tasks
- Tasks show organized by due date
- Can mark tasks complete
- Overdue tasks are highlighted
- Quick-add works from any page

---

### SPRINT 2.2: Pipeline View (Days 8-10) | Effort: 7 hours

**Objective:** Visual sales pipeline management

**Tasks:**
```
[ ] Task 2.2.1: Create PipelineKanban component
    - Columns for each stage (Lead, Prospect, Opportunity, Proposal, Won, Lost)
    - Display prospect cards in stages
    - Time: 2.5 hours

[ ] Task 2.2.2: Implement drag-and-drop
    - Move prospects between stages
    - Update data when dropped
    - Add animation
    - Time: 2 hours

[ ] Task 2.2.3: Add stage statistics
    - Show count per stage
    - Show total value per stage
    - Time: 1 hour

[ ] Task 2.2.4: Implement Pipeline filters
    - Filter by owner
    - Filter by date range
    - Time: 1 hour

[ ] Task 2.2.5: Pipeline page completion
    - Replace empty Pipeline.vue
    - Add controls above board
    - Time: 30 min
```

**Definition of Done:**
- Pipeline displays all prospects in correct stages
- Can drag prospects between stages
- Stage totals are accurate
- Mobile view has scrollable columns

---

### SPRINT 2.3: Analytics & Insights (Days 10-12) | Effort: 5 hours

**Objective:** KPI dashboards and basic reporting

**Tasks:**
```
[ ] Task 2.3.1: Create simple charts component
    - Use Chart.js or canvas for basic charts
    - Prospects by stage pie chart
    - Time: 1.5 hours

[ ] Task 2.3.2: Build conversion metrics
    - Win rate percentage
    - Average deal size
    - Sales cycle length
    - Time: 1 hour

[ ] Task 2.3.3: Implement Analytics page
    - Display key metrics
    - Show trend data (this month vs last month)
    - Time: 1.5 hours

[ ] Task 2.3.4: Add to Dashboard
    - Link Analytics in sidebar
    - Time: 30 min
```

**Definition of Done:**
- Analytics page displays key metrics
- Charts render correctly
- Data is calculated accurately

---

## WEEK 3: Additional Features (Days 13-19)

### SPRINT 3.1: Clients Management (Days 13-14) | Effort: 4 hours

**Objective:** Track won opportunities and clients

**Tasks:**
```
[ ] Task 3.1.1: Create clientData.ts
    - Define Client interface
    - Link to prospects (when won)
    - Time: 30 min

[ ] Task 3.1.2: Build ClientCard & ClientList
    - Display client name, company, contact info, value
    - Time: 1.5 hours

[ ] Task 3.1.3: Clients page implementation
    - List of all clients
    - Filter by acquisition date
    - Time: 1 hour

[ ] Task 3.1.4: Link clients to prospects
    - Mark prospect as "won" to convert to client
    - Time: 1 hour
```

---

### SPRINT 3.2: Projects & Proposals (Days 14-15) | Effort: 4 hours

**Objective:** Track deliverables and proposals

**Tasks:**
```
[ ] Task 3.2.1: Create projectData.ts & proposalData.ts
    - Define interfaces
    - Mock data
    - Time: 1 hour

[ ] Task 3.2.2: Build project components
    - ProjectCard
    - ProjectList
    - ProjectForm
    - Time: 1.5 hours

[ ] Task 3.2.3: Build proposal components
    - ProposalCard
    - ProposalForm
    - Time: 1.5 hours

[ ] Task 3.2.4: Pages implementation
    - Projects page
    - Proposals page
    - Time: 1 hour
```

---

### SPRINT 3.3: Settings & Polish (Days 16-19) | Effort: 5 hours

**Objective:** User preferences and UI/UX refinements

**Tasks:**
```
[ ] Task 3.3.1: Settings page skeleton
    - User preferences section
    - Workspace settings
    - Data management (export/import)
    - Time: 1 hour

[ ] Task 3.3.2: Theme/appearance settings
    - Dark/light mode toggle
    - Apply theme globally
    - Time: 1.5 hours

[ ] Task 3.3.3: Notification settings
    - Email preferences
    - In-app alerts
    - Time: 1 hour

[ ] Task 3.3.4: UI Polish
    - Consistent spacing and typography
    - Smooth transitions
    - Loading states
    - Error states
    - Time: 1.5 hours
```

---

## WEEK 4: Testing & Release (Days 20-21)

### SPRINT 4.1: QA & Bug Fixes (Days 20-21) | Effort: Full week

**Objectives:**
- Fix bugs and edge cases
- Ensure data consistency
- Verify all features work together
- Performance optimization

**Tasks:**
```
[ ] Test all CRUD operations
[ ] Test navigation between pages
[ ] Test responsiveness on different screen sizes
[ ] Check console for errors/warnings
[ ] Test with large datasets (100+ prospects)
[ ] Verify mock data persistence
[ ] Check Tauri integration
[ ] Final styling pass
[ ] User acceptance testing
```

---

## Critical Path to MVP

```
MUST COMPLETE:
├─ Dashboard with metrics ...................... Day 2
├─ Prospects CRUD ................................ Day 4
├─ Calls tracking ................................ Day 5
├─ Follow-ups/Tasks .............................. Day 8
└─ Pipeline view ................................. Day 10

OPTIONAL BUT NICE:
├─ Analytics ..................................... Day 12
├─ Clients ....................................... Day 14
├─ Projects/Proposals ............................ Day 15
└─ Settings ...................................... Day 19
```

---

## Implementation Tips

### High Priority
1. **Focus on prospect data flow first** - It's the core entity
2. **Keep styling simple initially** - Use CSS classes, avoid framework complexity
3. **Test with real interactions** - Don't just assume logic works
4. **Link features early** - Call prospects, prospects to tasks, etc.

### Code Quality
1. **Use TypeScript types consistently** - Leverage type safety
2. **Create reusable components** - DRY principle
3. **Handle edge cases** - Empty states, validation errors
4. **Add console logging for debugging** - Remove before release

### Testing Strategy
1. **Manual testing of happy paths** - Core workflows
2. **Test error states** - Invalid inputs, missing data
3. **Test on desktop** - Primary Tauri platform
4. **Test with multiple workspaces** - If supported

---

## Success Checklist for MVP

- [ ] Dashboard is primary entry point with key metrics
- [ ] Can manage full prospect lifecycle (add → win or lose)
- [ ] Call tracking is working with prospect linkage
- [ ] Follow-up/task system is functional
- [ ] Sales pipeline visualizes prospect progression
- [ ] Search and filters work across main features
- [ ] No critical bugs or console errors
- [ ] Desktop app is responsive and performant
- [ ] Data consistency across features
- [ ] UI is clean and professional-looking

---

## Post-MVP Enhancements (Not in MVP)

- Database integration (replace mock data)
- User authentication & team collaboration
- Email integration for automated follow-ups
- Calendar view for meetings/calls
- Reporting and data export
- Mobile app version
- Real-time sync
- Advanced analytics
- Workflow automation
- CRM integrations (Slack, Google Workspace, etc.)

