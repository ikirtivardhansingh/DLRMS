# DLRMS : Digital Land Records & Allotment Management System

> A Salesforce-native platform for digitizing and automating the complete lifecycle of government land administration, from parcel registration and citizen allotments to payments, inspections, grievance resolution, and compliance reporting.

---

## Table of Contents

- [Overview](#overview)
- [System Objectives](#system-objectives)
- [User Roles](#user-roles)
- [Functional Modules](#functional-modules)
- [Data Model](#data-model)
- [Business Process Flows](#business-process-flows)
- [Automation](#automation)
- [Apex Implementation](#apex-implementation)
- [Lightning Web Components](#lightning-web-components)
- [Reports & Dashboards](#reports--dashboards)
- [Security & Access Control](#security--access-control)
- [Non-Functional Requirements](#non-functional-requirements)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Quality & Linting](#code-quality--linting)
- [Deployment](#deployment)
- [Integrations](#integrations)
- [Future Enhancements](#future-enhancements)
- [Implementation Milestones](#implementation-milestones)

---

## Overview

Land administration is one of the most fundamental responsibilities of government institutions. Accurate land records are essential for maintaining property ownership, allocating land resources, resolving disputes, collecting government revenue, and ensuring transparency in public administration.

**DLRMS** is a centralized digital platform built on the **Salesforce Platform** that digitizes the complete lifecycle of land administration, from parcel registration and citizen applications to approvals, payments, inspections, and grievance management. It replaces fragmented manual processes with standardized workflows, automated notifications, and centralized record storage, all with full auditability.

The system serves three user groups: **citizens** who apply for and manage land allotments, **government officials** who verify, approve, and inspect, and **administrators** who govern the platform and monitor operational performance.

---

## System Objectives

- Digitize government land records and allotment processes end-to-end
- Improve transparency and traceability of land allocations
- Automate multi-stage approval workflows and administrative tasks
- Provide a self-service portal for citizen interactions
- Enable efficient grievance resolution with SLA enforcement
- Generate analytical insights through dashboards and reports

---

## User Roles

### Citizens
Interact via the **Citizen Portal** to:
- Register and maintain their profile
- Apply for land allotments
- Track application status
- Pay allotment or renewal fees
- Submit and monitor grievances

### Government Officials

| Role | Responsibility |
|---|---|
| Clerk | Application verification |
| Surveyor | Land availability verification |
| Approver | Final allotment approval |
| Inspector | Land parcel inspection |
| Administrator | System management |

### System Administrators
- Manage users and permissions
- Maintain master data
- Configure automation
- Monitor reports and system logs
- Manage integrations

---

## Functional Modules

### 1. Land Parcel Management
Manages all government-owned land parcels and their attributes.

- Create and manage parcel records with GIS coordinates
- Track parcel status and classification
- Maintain hierarchical parcel relationships
- Track ownership history and generate parcel documentation

**Parcel Status Values:**

| Status | Description |
|---|---|
| Available | Parcel available for allocation |
| Allocated | Parcel assigned to a citizen |
| Under Review | Parcel flagged during inspection |
| Disputed | Parcel under active dispute |
| Expired | Allotment term has expired |

---

### 2. Citizen Portal
Built using Lightning Web Components (LWC), the portal enables citizens to:
- Submit allotment applications
- Track application and payment status
- View allotment history
- Pay allotment fees
- File and monitor grievances

---

### 3. Allotment Lifecycle Management
Governs the full lifecycle of land allotments through a multi-stage workflow:

```
Application Submitted
  → Clerk Verification
    → Surveyor Review
      → Approver Decision
        → Allotment Activation
          → Expiry / Renewal
```

Features include automated notifications, expiry tracking, and renewal eligibility management.

---

### 4. Grievance Management
Citizens can file grievances regarding land disputes or administrative issues.

- Grievances assigned to responsible officials
- SLA enforcement: resolution required within **7 days**
- Automatic escalation to higher authority if unresolved past SLA

---

### 5. Payments & Invoice Management
Manages all financial transactions related to allotments.

- Invoice generated automatically upon allotment approval
- Payment reminders sent 3 days before due date
- Allotment cancelled if payment remains overdue for **30 days**

**Payment Status Values:**

| Status | Meaning |
|---|---|
| Pending | Payment yet to be made |
| Paid | Payment completed |
| Overdue | Payment past due date |

---

### 6. Compliance & Inspections
Government officials conduct inspections to verify land usage compliance.

Inspection records capture: date, assigned official, findings, and recommendation.

**Inspection Outcomes:**

| Recommendation | Outcome |
|---|---|
| Approve | Parcel compliant |
| Reject | Parcel flagged as Under Review |
| Review Further | Additional investigation required |

---

### 7. Analytics & Transparency

Dashboards covering:
- **Land Utilization** : Available, allocated, and disputed parcels
- **Official Performance** : Applications processed, grievances resolved
- **Revenue Analytics** : Fees collected vs. overdue payments
- **SLA Compliance** : Grievance resolution time tracking

---

## Data Model

### Core Objects

| Object | Description |
|---|---|
| `Citizen__c` | Stores citizen records |
| `Land_Parcel__c` | Stores parcel information and GIS data |
| `Allotment__c` | Land assignment records |
| `Official__c` | Government official records |
| `Grievance__c` | Citizen complaint records |
| `Payment__c` | Payment and invoice records |
| `Inspection__c` | Parcel inspection logs |

### Object Relationships

```
Citizen        ──(1:M)──▶  Allotment
Allotment      ──(M:1)──▶  Land Parcel
Allotment      ──(1:M)──▶  Payment
Allotment      ──(1:M)──▶  Grievance
Land Parcel    ──(1:M)──▶  Inspection
Land Parcel    ──(M:1)──▶  Official
```

### Key Object Fields

**Citizen__c**

| Field | Type | Description |
|---|---|---|
| Citizen ID | Auto Number | Unique identifier |
| Full Name | Text | Legal name |
| Aadhaar Number | Text (Unique) | National identity number |
| Address | Long Text | Residential address |
| Phone / Email | Phone / Email | Contact details |
| Status | Picklist | Active, Blacklisted, Deceased |
| Total Parcels | Roll-up | Count of allotments |

**Land_Parcel__c**

| Field | Type |
|---|---|
| Parcel ID | Auto Number |
| Parent Parcel | Lookup |
| Location | Text |
| Pin Code | Number |
| Latitude / Longitude | Number |
| Type / Status | Picklist |
| Managed By | Lookup (Official) |

**Allotment__c**

| Field | Type |
|---|---|
| Allotment ID | Auto Number |
| Citizen | Master-Detail |
| Land Parcel | Lookup |
| Application / Allotment / Expiry Date | Date |
| Fee Amount | Currency |
| Status | Picklist |
| Renewal Eligible | Checkbox |

**Grievance__c**

| Field | Type |
|---|---|
| Grievance ID | Auto Number |
| Citizen / Allotment | Lookup |
| Description | Long Text |
| Priority | Picklist |
| Status | Picklist |
| Resolution Date | Date |

**Inspection__c**

| Field | Type |
|---|---|
| Inspection ID | Auto Number |
| Land Parcel / Official | Lookup |
| Date | Date |
| Findings | Long Text |
| Recommendation | Picklist |

---

## Business Process Flows

### Allotment Application
1. Citizen submits application via portal
2. System validates citizen eligibility
3. Application record created with status `Applied`
4. Clerk verifies documentation
5. Surveyor verifies parcel availability
6. Application forwarded to Approver
7. Approver approves or rejects
8. If approved → Allotment record created, parcel status set to `Allocated`, citizen notified

### Payment Processing
1. Invoice generated on allotment approval
2. Citizen submits payment → status set to `Paid`
3. If not received by due date → status becomes `Overdue`, reminder sent
4. If overdue exceeds 30 days → allotment cancelled, parcel reverted to `Available`

### Grievance Escalation
1. Citizen files grievance → status set to `Open`
2. Grievance assigned to responsible official
3. If resolved within 7 days → status set to `Resolved`
4. If unresolved after 7 days → status set to `Escalated`, higher authority notified

---

## Automation

| Automation | Mechanism | Trigger |
|---|---|---|
| Application status set to Pending Approval | Record-Triggered Flow | On application submission |
| Multi-stage approval chain (Clerk → Surveyor → Approver) | Approval Process | On status update |
| Allotment expiry processing | Scheduled Flow (daily) | Current Date > Expiry Date |
| Grievance SLA escalation | Scheduled Flow | Grievance unresolved > 7 days |
| Payment reminder email | Scheduled Flow | 3 days before due date |
| Invoice number generation | Record-Triggered Flow | On payment record creation |

---

## Apex Implementation

### Triggers

| Trigger | Responsibility |
|---|---|
| `CitizenTrigger` | Prevents duplicate Aadhaar records |
| `ParcelTrigger` | Prevents overlapping parcel allocations |
| `AllotmentTrigger` | Archives expired allotments |
| `PaymentTrigger` | Cancels allotment if payment overdue > 30 days |
| `GrievanceTrigger` | Notifies officials for high-priority grievances |

### Service Classes

| Class | Methods |
|---|---|
| `AllotmentService` | `assignParcelToCitizen()`, `renewAllotment()` |
| `PaymentService` | `generateInvoice()`, `markOverduePayments()` |
| `NotificationService` | `sendEmail()`, `sendInAppNotification()` |
| `GrievanceEscalationService` | Grievance escalation logic |
| `InspectionScheduler` | Batch inspection scheduling |

---

## Lightning Web Components

| Component | Purpose |
|---|---|
| `CitizenDashboard` | Display citizen data and status |
| `ParcelExplorer` | Search and filter parcels |
| `ParcelDetailMap` | GIS visualization of parcels |
| `AllotmentApplicationForm` | Submit new applications |
| `PaymentPortal` | Pay allotment fees |
| `GrievancePortal` | File and track grievances |
| `ApprovalConsole` | Officials review applications |
| `InspectionScheduler` | Schedule and manage inspections |
| `RevenueDashboard` | Revenue charts and analytics |
| `AuditTrailViewer` | System audit log viewer |

---

## Reports & Dashboards

### Reports
- Parcels by Status
- Allotments by Citizen
- Expiring Allotments
- Revenue Collected vs. Overdue
- Grievance SLA Compliance
- Inspection Summary

### Dashboards

| Dashboard | Contents |
|---|---|
| Citizen Dashboard | Applications, payments, grievances |
| Official Dashboard | Managed parcels, pending approvals, SLA violations |
| Admin Dashboard | Land utilization, revenue trends, performance KPIs |

---

## Security & Access Control

### Profiles
- `Citizen` : portal access only, own records visible
- `Official` : assigned parcels and cases
- `Approver` : application approval rights
- `Admin` : full system access

### Permission Sets

| Permission Set | Grants |
|---|---|
| File Grievances | Citizen grievance submission |
| Approve Applications | Approver workflow actions |
| Manage Inspections | Inspector scheduling and logging |
| Audit Logs | Admin audit trail access |

### Access Rules
- Citizens see only their own records
- Officials see only parcels assigned to their jurisdiction
- Aadhaar numbers are encrypted at rest
- All ownership changes are logged with full audit history

---

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| Scale | Supports 10,000+ citizens |
| Performance | Page load time < 3 seconds |
| Security | Aadhaar numbers encrypted; RBAC enforced |
| Auditability | All ownership changes logged; historical records preserved |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Lightning Web Components (LWC), HTML, CSS |
| Backend | Apex (Triggers, Classes, Batch Jobs) |
| Automation | Record-Triggered Flows, Scheduled Flows, Approval Processes |
| Platform | Salesforce (SFDX / SF CLI) |
| Testing | Jest (`@salesforce/sfdx-lwc-jest`) |
| Linting | ESLint with `@salesforce/eslint-config-lwc` |
| Formatting | Prettier with `prettier-plugin-apex` |
| Git Hooks | Husky + lint-staged |
| Deployment | Manifest-based (`package.xml`) |

---

## Project Structure

```
DLRMS/
├── force-app/
│   └── main/
│       └── default/
│           ├── lwc/              # Lightning Web Components
│           ├── classes/          # Apex service classes
│           ├── triggers/         # Apex triggers
│           ├── objects/          # Custom object & field definitions
│           ├── flows/            # Record-triggered & scheduled flows
│           ├── permissionsets/   # Permission set configurations
│           └── profiles/         # User profile configurations
├── manifest/
│   └── package.xml               # Deployment manifest
├── config/
│   └── project-scratch-def.json  # Scratch org definition
├── scripts/
│   └── apex/                     # Anonymous Apex scripts
├── .husky/                       # Git hook configurations
├── .vscode/                      # VS Code workspace settings
├── sfdx-project.json             # SFDX project configuration
├── jest.config.js                # Jest test configuration
├── eslint.config.js              # ESLint rules
├── .prettierrc                   # Prettier formatting config
└── package.json                  # Node.js dev dependencies
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Salesforce CLI (SF CLI)](https://developer.salesforce.com/tools/salesforcecli)
- A Salesforce Developer Edition org or sandbox access
- [VS Code](https://code.visualstudio.com/) with the [Salesforce Extension Pack](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode) (recommended)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ikirtivardhansingh/DLRMS.git
cd DLRMS
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Authorize a Salesforce Org

**Scratch org (recommended for development):**

```bash
sf org login web --set-default-dev-hub --alias MyDevHub
sf org create scratch --definition-file config/project-scratch-def.json --alias dlrms-dev --duration-days 30 --set-default
```

**Existing sandbox or developer org:**

```bash
sf org login web --alias dlrms-sandbox
```

### 4. Deploy Source

```bash
# Deploy all source
sf project deploy start --source-dir force-app

# Or deploy via manifest
sf project deploy start --manifest manifest/package.xml
```

### 5. Open the Org

```bash
sf org open
```

---

## Development Workflow

```bash
# Pull changes from org to local
sf project retrieve start --source-dir force-app

# Push local changes to scratch org
sf project deploy start --source-dir force-app

# Run anonymous Apex
sf apex run --file scripts/apex/hello.apex
```

---

## Testing

```bash
# Run all unit tests
npm test

# Watch mode (active development)
npm run test:unit:watch

# Coverage report
npm run test:unit:coverage

# Apex tests via CLI
sf apex run test --test-level RunLocalTests --output-dir ./test-results --result-format human
```

---

## Code Quality & Linting

```bash
# Lint LWC JavaScript
npm run lint

# Format all files
npm run prettier

# Verify formatting without writing
npm run prettier:verify
```

Pre-commit hooks (Husky + lint-staged) automatically run Prettier, ESLint, and related Jest tests on every `git commit`.

---

## Deployment

```bash
# Deploy to sandbox
sf project deploy start \
  --manifest manifest/package.xml \
  --target-org dlrms-sandbox \
  --test-level RunLocalTests

# Deploy to production (requires ≥ 75% Apex coverage)
sf project deploy start \
  --manifest manifest/package.xml \
  --target-org dlrms-prod \
  --test-level RunAllTestsInOrg

# Validate without deploying
sf project deploy validate \
  --manifest manifest/package.xml \
  --target-org dlrms-prod
```

---

## Integrations

| Integration | Purpose |
|---|---|
| GIS Mapping APIs | Geographic parcel visualization |
| Identity Verification Services | Aadhaar / citizen identity validation |
| Payment Gateway | Payment processing simulation |
| Email / SMS Services | Notifications and reminders |

---

## Future Enhancements

- Blockchain-based immutable land registry
- AI-powered fraud detection on applications
- Citizen-facing chatbot for self-service queries
- SMS notification channel for low-connectivity regions

---

## Implementation Milestones

| Milestone | Description | Outcome |
|---|---|---|
| Data Model Setup | Create custom objects and fields | Core schema ready |
| Automation Development | Implement flows and approval processes | Workflows operational |
| UI Development | Build LWC components and Citizen Portal | Portal available |
| Apex Development | Implement triggers and service classes | Advanced features ready |
| Testing & Reporting | UAT, dashboards, and report validation | Production ready |

---

*Built on the Salesforce Platform · Designed for Digital Government & Land Administration*