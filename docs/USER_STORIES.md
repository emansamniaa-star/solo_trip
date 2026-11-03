# User Stories & Agile Board (MVP)

## Sprint board (Kanban)

| Status | Stories |
|--------|---------|
| Done | US-01 Health API, US-02 Neon trips CRUD (read/create), US-03 Auth register/login, US-04 Wire trips UI, US-05 Profile session |
| In progress | US-06 Course tooling (tests, Docker, CI, logging) |
| Backlog | US-07 JWT protected routes, US-08 Experiences API, US-09 Messages API |

## User stories

### US-01 — API health
**As a** developer  
**I want** `/api/health` and `/api/db-health`  
**So that** I can verify the process and Neon connectivity.

### US-02 — Trips API
**As a** traveler  
**I want** to list, view, and create trips stored in Neon  
**So that** companions see real upcoming plans.

### US-03 — Auth
**As a** user  
**I want** to register and log in with a hashed password  
**So that** my profile is personal and safer than mock data.

### US-04 — Trips UI
**As a** user  
**I want** Home, Search, Details, and Create Trip to use the API  
**So that** the app is not limited to mockTrips.

### US-05 — Profile session
**As a** logged-in user  
**I want** Profile to show my name from login/register  
**So that** I am not stuck as mock “Layla”.

### US-06 — Course guidelines
**As a** student team  
**I want** licenses, logging, tests, Docker, and CI  
**So that** we meet project requirements beyond the demo UI.

## Retrospective (template)
- What went well: incremental Neon MVP, modular server split  
- What to improve: earlier tests/CI, JWT instead of localStorage-only  
- Action items: keep PRs small; never commit `.env`
