# NaCRRI Fleet Management System

> **A Programme-Based Fleet Register for Tracking Motors, Service Statuses, Locations, and Period of Stay at the National Crops Resources Research Institute (NaCRRI).**

---

## System Overview & Purpose

The **NaCRRI Fleet Management System** is designed to provide institutional oversight and accountability for all motorized assets across research programmes. It tracks vehicles, motorcycles, tractors, vans, and buses: monitoring their service schedules, active field/station deployment, responsible custodians, and duration of stay.

---

## Research Programmes Covered

Data is categorized per research programme:
1. **Administration**
2. **Horticulture and Oil palm**
3. **Legumes**
4. **Root crops**
5. **Cereals**
6. **Workshop**

---

## Roles & Access Control

The system enforces strict role-based governance:
* **Super Admin (PHRAO)**: Access to all 6 programmes, write permissions across the board, manage dropdown value lists (service stations, locations, reasons), and system configurations. Default PIN: `phrao2026`.
* **Programme Admin (Admin Assistant)**: Locked to assigned programme. Can log and edit records exclusively within their research scope. Default PIN: `prog2026`.
* **Management Viewer (Executive)**: Read-only access across all dashboards, registers, and institutional reports for management decisions. Default PIN: `view2026`.

---

## Key Features & Security Enhancements

* **Executive Overview & Programme Dashboards**: Live cards displaying calculated fleet totals, serviced ratios, pending items, and overdue alerts.
* **Security & Production Hardening**: Content Security Policy headers, XSS HTML entity sanitization, PIN-based authentication, anti-CSRF token validation, brute-force rate-limiting (5 max attempts with 30s lockout), and secure local state isolation.
* **Anti-Vibe Crisp Design**: Clean NaCRRI forest green palette (zero purple gradients), crisp rectangular buttons (no pill buttons), zero fake counters/reviews, clean typography (no em dashes or emojis), and subtle functional UI transitions.
* **Full Site Global Search**: Live search bar filtering vehicles, registration numbers, custodians, and location categories.
* **Dark Mode & Accessibility**: Theme switcher with local persistence, accessibility skip-to-content link, keyboard navigation (`Escape` key), and scroll progress bar.
* **Smart Dynamic Entry Form**: Fields adapt automatically based on service status (Serviced, Pending, or Overdue).
* **Automatic Period of Stay Calculation**: Computes deployment duration in days automatically from start and end dates.
* **Motor Details Side Drawer & Copy Helpers**: Interactive panel showing complete historical logs for service events and location movements, with copy-to-clipboard actions.
* **Institutional Reports & CSV Export**: Dynamic query filters with instant CSV downloads.
* **Institutional Pages & Support**: Built-in Privacy Policy, Terms & Conditions, FAQ accordion section, Custom 404 page, and floating contact support drawer.
* **Print Stylesheet**: Formatted `@media print` rules for clean PDF printing of reports and registers.

---

## Quick Start / How to Run

1. Clone or download the repository:
   ```bash
   git clone https://github.com/MARKPAUL1234/-nacrri-fleet-management-system.git
   ```
2. Open `index.html` directly in any modern web browser, or serve locally using Python:
   ```bash
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` to access the portal.

---

## Technology Stack

* **Frontend**: HTML5, Vanilla CSS3 with custom design tokens, ES6+ JavaScript.
* **Storage**: Encrypted `localStorage` and `sessionStorage` state engines for offline persistence and security session management.
* **Assets**: High-definition SVG vector logo and photographic motor icons.
