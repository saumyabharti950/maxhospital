# SIFI Healthcare website: project blueprint

## First UI milestone

The current workspace is an HTML/CSS/JavaScript responsive homepage prototype. It uses Bootstrap 5 and the supplied SIFI content pack. The layout takes structural cues from the reference site—care discovery, doctor discovery, appointment requests and patient guidance—without using its branding or copy. Services are presented as consultation areas to confirm. No doctor, patient testimonial, operating hours, phone number, accreditation, bed count or active facility has been invented.

### Files in this milestone

```text
sifi-healthcare/
├── index.html       # Responsive homepage structure and supplied copy
├── styles.css       # SIFI visual system and responsive layouts
├── app.js           # Search, form validation and current year
└── PROJECT_PLAN.md  # Target Laravel structure, data model and roadmap
```

## Target application structure

```text
sifi-healthcare/
├── app/
│   ├── Http/Controllers/Api/V1/{Appointment,Department,Doctor,Branch,Service,Banner}Controller.php
│   ├── Http/Controllers/Admin/{Dashboard,Doctor,Department,Branch,Service,Banner}Controller.php
│   ├── Http/Requests/{StoreAppointmentRequest,StoreDoctorRequest,UpdateDoctorRequest}.php
│   ├── Models/{Appointment,Department,Doctor,Branch,Service,Banner,Page,Enquiry,AdminUser}.php
│   └── Policies/{Appointment,Doctor,Department,Branch,Service,Banner}Policy.php
├── database/migrations/  # Relational schema and indexes
├── resources/views/
│   ├── layouts/{site,admin}.blade.php
│   ├── pages/{home,about,specialities,doctors,facilities,patient-information,contact}.blade.php
│   ├── components/       # Navigation, cards, forms, footer
│   └── admin/            # Protected content-management screens
├── routes/{web,api}.php
├── public/{images,build}/
└── tests/                # Feature and authorization tests
```

## Database design

| Table | Key fields and relationships |
| --- | --- |
| `users` | Laravel admin users; name, email (unique), password hash, role, active flag, timestamps. Public registration disabled. |
| `branches` | name, slug, address, map URL, phone/email, hours, status, timestamps. One initial record for Kanke; schema supports future branches. |
| `departments` | name, slug, summary, description, icon, sort order, status, timestamps. |
| `doctors` | department FK, name, qualifications, experience, bio, photo path, consultation details, status, sort order, timestamps. Keep unpublished until verified. |
| `doctor_branch` | doctor FK + branch FK, optional schedule note; composite unique key. |
| `services` | optional department FK, title, slug, description, status, sort order, timestamps. Only confirmed services published. |
| `banners` | title, supporting text, image path/alt, CTA label/URL, sort order, active date window, status. |
| `pages` | slug, title, SEO title/description, structured JSON sections or sanitized rich content, publish state, timestamps. |
| `appointments` | patient name, phone, optional email, department FK nullable, doctor FK nullable, preferred date/time, short message, consent timestamp/text version, status, staff notes, timestamps. Do not collect Aadhaar or uploads. |
| `enquiries` | name, phone/email, category, message, consent, status, timestamps. |
| `feedback` | optional name/contact/visit date/department, category, comments, response requested, moderation status, timestamps. Publish only consented testimonials after review. |
| `media` | path, original name, MIME type, alt text, size, uploaded-by FK, timestamps. Validate image types and dimensions. |

Indexes: unique slugs; foreign-key indexes; `appointments(status, preferred_date)`, `appointments(created_at)`, `doctors(status, department_id, sort_order)`, `departments(status, sort_order)`. Use soft deletion for managed catalogue content where retention is useful; never cascade-delete appointment history.

## API outline

Public, versioned read endpoints: `GET /api/v1/departments`, `/doctors`, `/branches`, `/services`, `/banners`, `/pages/{slug}`. Public write endpoints: `POST /api/v1/appointments`, `/enquiries`, `/feedback` with validation, throttling, consent capture, spam protection and minimal returned data. Admin endpoints under `/api/v1/admin/*` require authenticated staff and policies; admin CRUD includes departments, doctors, branches, services, banners and pages, plus appointment/enquiry review and status updates. API resources expose only published fields to public clients.

## Implementation roadmap

1. **Confirm launch facts:** legal operator, status/opening date, active departments and services, doctor credentials/photos/schedules, contact details, OPD hours, map pin, privacy contact and approved imagery.
2. **Initialize Laravel + MySQL:** environment config, migrations, models, factories/seeds for verified content, and local setup instructions.
3. **Build public API:** resources, request validation, public visibility scopes, consent logging, rate limits and API feature tests.
4. **Connect the public UI:** convert this prototype into Blade layouts/components; load all copy/cards/forms from API/database. Create the requested About, Hospitals (single branch), Doctors, Specialities, Services/Facilities, Appointments, Patient Information, Contact, Community Health, Careers, Privacy and Terms routes.
5. **Appointment flow:** persist requests, confirmation-not-booked messaging, staff queue/status workflow, notifications only after a real receiving inbox/process is configured; test success and failure paths.
6. **Admin panel:** role-based login, CSRF-protected forms, CRUD, publish/unpublish, safe media upload, audit trail, appointment/enquiry moderation and pagination.
7. **Security and launch QA:** production secrets, HTTPS, secure cookies, password hashing, authorization policies, output escaping, input validation, throttling, backups, retention policy, accessibility, responsive/browser review, and clinician/legal review of published claims and privacy/terms.

## UI-to-backend field map

- Hero, location, intro and community sections → active `banners`, `branches`, and published `pages` sections.
- Speciality cards → published `departments` and optionally confirmed `services`.
- Doctor section → published `doctors`; empty state stays helpful until doctor records are approved.
- Appointment form → `POST /api/v1/appointments`, backed by `appointments`; frontend must show success only after a server acknowledgement.
- Address/directions/contact → active `branches`; phone links appear only after a verified number exists.

The present prototype is intentionally frontend-only: the form validates locally and says requests are not yet enabled. It must be wired to Laravel before it can collect or send requests.
