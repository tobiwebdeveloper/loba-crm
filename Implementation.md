Realistic remaining time

About 8–12 focused hours to get a solid working CRM MVP.

If you're learning the backend properly while building it, I'd expect closer to 10–12 hours.

Roughly:

Area	Time
Backend connection + routing	1–1.5h
Prospects API + page	2h
Calls API + page	1–1.5h
Follow-ups API + page	1–1.5h
Dashboard	1h
Functions/refactoring	45m
Testing + cleanup	1–1.5h
Total	8–12h

The important difference is that we're going to prove each layer before building on it.

New Loba CRM implementation plan
Phase 0 — Lock the architecture

Current structure:

loba-crm/
├── src/
│   ├── app/
│   │   ├── App.vue
│   │   └── router/
│   │       └── index.ts
│   │
│   ├── pages/
│   │   ├── Dashboard.vue
│   │   ├── Prospects.vue
│   │   ├── Calls.vue
│   │   ├── FollowUps.vue
│   │   └── Settings.vue
│   │
│   ├── composables/
│   │   ├── useProspects.ts
│   │   ├── useCalls.ts
│   │   └── useFollowUps.ts
│   │
│   ├── functions/
│   │   ├── prospects.ts
│   │   ├── calls.ts
│   │   ├── followUps.ts
│   │   └── dates.ts
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   ├── types/
│   │   └── crm.ts
│   │
│   └── main.ts
│
├── server/
│   ├── index.ts
│   ├── db/
│   │   └── index.ts
│   └── routes/
│       ├── prospects.ts
│       ├── calls.ts
│       └── followUps.ts
│
└── ...

Paraxe remains the UI system.

No local component library.

No shared/.

No Pinia.

No ORM.

No unnecessary backend layers.

Phase 1 — Backend connection

This is where you learn.

We build:

Browser
 ↓
fetch()
 ↓
server/index.ts
 ↓
routes/prospects.ts
 ↓
db/index.ts
 ↓
Neon
 ↓
PostgreSQL

But we don't immediately build CRUD.

First prove:

GET /api/prospects

works.

Success condition

The browser can request prospects and receive actual PostgreSQL data.

If that works, the architecture is proven.

Do not continue until it works.

Phase 2 — Frontend API layer

src/lib/api.ts becomes the single frontend HTTP boundary.

It knows:

GET
POST
PATCH
DELETE

It does not know:

Vue
ref
computed
Neon
SQL
page state

And critically, it uses the types from:

src/types/crm.ts

rather than inventing another Prospect type.

Phase 3 — Prospects

Now rebuild Prospects cleanly.

useProspects.ts

Owns the page's reactive state:

prospects
loading
error
dialog state
form state

and operations such as:

loadProspects()
createProspect()
editProspect()
removeProspect()
resetForm()

The composable does not perform SQL.

It calls api.ts.

functions/prospects.ts

Pure operations:

searchProspects()
filterProspectsByStatus()
sortProspectsBy...
getProspectValue()

No Vue.

No HTTP.

Prospects.vue

Owns:

layout
Paraxe components
event wiring
displaying state

That's it.

Phase 4 — Calls

Same architecture.

Calls.vue
   ↓
useCalls.ts
   ↓
api.ts
   ↓
server/routes/calls.ts
   ↓
db
   ↓
Neon

Functions specific to calls go in:

functions/calls.ts

For example:

getCallsForProspect()

No giant shared file.

Phase 5 — Follow-ups

Same pattern:

FollowUps.vue
   ↓
useFollowUps.ts
   ↓
api.ts
   ↓
server/routes/followUps.ts
   ↓
db
   ↓
Neon

Functions:

getUpcomingFollowUps()
getOverdueFollowUps()

Date logic goes into:

functions/dates.ts

So we don't write the same date calculation three times.

Phase 6 — Dashboard

Only now.

Dashboard doesn't need its own giant data architecture.

It composes what already exists.

For example:

prospects
calls
follow-ups
       ↓
Dashboard

We only create a new function if we discover genuine repeated logic.

No speculative:

getDashboardEverything()
getDashboardPipeline()
getDashboardStats()
Phase 7 — Polish

Then:

loading states
empty states
errors
pagination
search
filtering
sorting
responsive layout
Paraxe consistency
form validation
Phase 8 — Full test

We manually prove:

Prospects
CREATE ✓
READ ✓
UPDATE ✓
DELETE ✓
SEARCH ✓
FILTER ✓
SORT ✓
REFRESH ✓
Calls
CREATE ✓
READ ✓
UPDATE ✓
DELETE ✓
PROSPECT RELATION ✓
Follow-ups
CREATE ✓
READ ✓
UPDATE ✓
COMPLETE ✓
DELETE ✓
UPCOMING ✓
OVERDUE ✓
System
Frontend → API ✓
API → Node ✓
Node → Neon ✓
Neon → PostgreSQL ✓
PostgreSQL → Node ✓
Node → Frontend ✓
The rule that prevents another 4-hour disaster

From now on:

Never build three layers at once.

We do:

DATABASE
   ↓
BACKEND
   ↓
API
   ↓
FRONTEND

and verify each connection.

If something breaks, we know which boundary broke.

That's how large applications stay manageable too. They aren't necessarily less complex; they're divided into boundaries that can be understood independently.

And for you specifically, this project is now going to double as your backend course. You shouldn't just end up with a CRM that works — you should be able to explain exactly why:

<input>
   ↓
Vue state
   ↓
TypeScript object
   ↓
JSON
   ↓
HTTP request
   ↓
Node route
   ↓
SQL parameter
   ↓
PostgreSQL column

works.

That's the level-up we're after.