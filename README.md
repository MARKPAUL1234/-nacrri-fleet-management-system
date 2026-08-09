# 🚗 NaCRRI Fleet Management System

> **A Programme-Based Fleet Register for Tracking Motors, Service Statuses, Locations, and Period of Stay at the National Crops Resources Research Institute (NaCRRI).**

---

## 📋 System Overview & Purpose

The **NaCRRI Fleet Management System** is designed to provide institutional oversight and accountability for all motorized assets across research programmes. It tracks vehicles, motorcycles, tractors, vans, and buses—monitoring their service schedules, active field/station deployment, responsible custodians, and duration of stay.

---

## 🌾 Research Programmes Covered
Data is categorized per research programme:
1. **Administration**
2. **Horticulture and Oil palm**
3. **Legumes**
4. **Root crops**
5. **Cereals**
6. **Workshop**

---

## 🔐 Roles & Access Control
The system enforces strict role-based governance:
* 🛡️ **Super Admin (PHRAO)**: Access to all 6 programmes, write permissions across the board, manage dropdown value lists (service stations, locations, reasons), and system configurations.
* 🌾 **Programme Admin (Admin Assistant)**: Locked to their assigned programme. Can log and edit records exclusively within their research scope.
* 📊 **Management Viewer (Executive)**: Read-only access across all dashboards, registers, and institutional reports for management decisions.

---

## ⭐ Key Features

* 📊 **Executive Overview & Programme Dashboards**: Live cards displaying fleet totals, serviced ratios, pending items, and overdue alerts.
* 📝 **Smart Dynamic Entry Form**: Fields adapt automatically based on service status (Serviced, Pending, or Overdue).
* 📅 **Automatic Period of Stay Calculation**: Computes deployment duration in days automatically from start and end dates.
* 🔍 **Motor Details Side Drawer**: Interactive panel showing complete historical logs for service events and location movements.
* 📈 **Institutional Reports & CSV Export**: Dynamic query filters with instant CSV downloads.
* ⬅️ **Universal Smooth Navigation**: Seamless history tracking with back buttons and `Escape` key shortcuts.

---

## 🚀 Quick Start / How to Run

1. Clone or download the repository:
   ```bash
   git clone https://github.com/MARKPAUL1234/-nacrri-fleet-management-system.git
   ```
2. Open `index.html` directly in any modern web browser, or serve locally using Python:
   ```bash
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` to access the login portal.

---

## 🛠️ Technology Stack
* **Frontend**: HTML5, CSS3 (Vanilla CSS with design tokens), ES6+ JavaScript.
* **Storage**: `localStorage` database simulation for offline persistence.
* **Assets**: High-definition SVG vector logo and studio photographic motor icons.
