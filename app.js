/**
 * NaCRRI Fleet Management System - Core JavaScript
 * Handles state, simulated database, seed data, validations, and UI updates.
 */

// --- DATA STRUCTURES & SEED DATA ---
const DEFAULT_DROPDOWNS = {
    motorTypes: ["Vehicle", "Motorcycle", "Tractor", "Van", "Bus"],
    serviceStatuses: ["Serviced", "Pending", "Overdue"],
    pendingReasons: [
        "Awaiting approval",
        "Spare parts not available",
        "Workshop slot not available",
        "Scheduled for later date",
        "Awaiting inspection",
        "Under review",
        "Other"
    ],
    overdueReasons: [
        "Missed service date",
        "Motor was in use",
        "Workshop delay",
        "Pending approval",
        "Spare parts not available",
        "Other"
    ],
    serviceStations: ["Main Workshop", "Regional Workshop", "External Service Station", "On-site Mechanic"],
    locations: [
        { name: "Field Site A", category: "Field" },
        { name: "Field Site B", category: "Field" },
        { name: "Research Station", category: "On station" },
        { name: "Partner Station", category: "Off station" },
        { name: "Headquarters", category: "On station" },
        { name: "Off-site Location", category: "Off station" }
    ],
    locationCategories: ["Field", "On station", "Off station"]
};

// Real-time Photo Icon Mapper
function getMotorIconHTML(motorType) {
    let iconSrc = "icons/icon_vehicle.png";
    const type = (motorType || "").toLowerCase();
    if (type.includes("motorcycle")) iconSrc = "icons/icon_motorcycle.png";
    else if (type.includes("tractor") || type.includes("mowing")) iconSrc = "icons/icon_tractor.png";
    else if (type.includes("van")) iconSrc = "icons/icon_van.png";
    else if (type.includes("bus")) iconSrc = "icons/icon_bus.png";
    
    return `<img src="${iconSrc}" class="motor-type-img-icon" alt="${motorType}">`;
}

const DEFAULT_PROGRAMMES = [
    { id: "admin", name: "Administration" },
    { id: "horticulture", name: "Horticulture and Oil palm" },
    { id: "legumes", name: "Legumes" },
    { id: "root_crops", name: "Root crops" },
    { id: "cereals", name: "Cereals" },
    { id: "workshop", name: "Workshop" }
];

const DEFAULT_PERSONS = [
    { id: "p1", name: "John M.", programme_id: "admin" },
    { id: "p2", name: "Sarah K.", programme_id: "horticulture" },
    { id: "p3", name: "Peter O.", programme_id: "legumes" },
    { id: "p4", name: "Amina N.", programme_id: "root_crops" },
    { id: "p5", name: "David L.", programme_id: "cereals" },
    { id: "p6", name: "Grace T.", programme_id: "workshop" },
    { id: "p7", name: "Robert B.", programme_id: "admin" },
    { id: "p8", name: "Alice W.", programme_id: "cereals" }
];

// ≥2 motors per programme across all 3 types (Vehicle, Motorcycle, Tractor)
const DEFAULT_MOTORS = [
    // Administration
    { id: "m1", programme_id: "admin", motor_type: "Vehicle", registration_number: "UG-101-ABC", responsible_person_id: "p1" },
    { id: "m2", programme_id: "admin", motor_type: "Motorcycle", registration_number: "MC-011", responsible_person_id: "p7" },
    { id: "m3", programme_id: "admin", motor_type: "Tractor", registration_number: "TR-001", responsible_person_id: "p1" },
    // Horticulture and Oil palm
    { id: "m4", programme_id: "horticulture", motor_type: "Vehicle", registration_number: "UG-202-DEF", responsible_person_id: "p2" },
    { id: "m5", programme_id: "horticulture", motor_type: "Motorcycle", registration_number: "MC-012", responsible_person_id: "p2" },
    // Legumes
    { id: "m6", programme_id: "legumes", motor_type: "Vehicle", registration_number: "UG-303-GHI", responsible_person_id: "p3" },
    { id: "m7", programme_id: "legumes", motor_type: "Tractor", registration_number: "TR-002", responsible_person_id: "p3" },
    // Root crops
    { id: "m8", programme_id: "root_crops", motor_type: "Vehicle", registration_number: "UG-404-JKL", responsible_person_id: "p4" },
    { id: "m9", programme_id: "root_crops", motor_type: "Motorcycle", registration_number: "MC-013", responsible_person_id: "p4" },
    // Cereals
    { id: "m10", programme_id: "cereals", motor_type: "Vehicle", registration_number: "UG-505-MNO", responsible_person_id: "p5" },
    { id: "m11", programme_id: "cereals", motor_type: "Motorcycle", registration_number: "MC-014", responsible_person_id: "p8" },
    { id: "m12", programme_id: "cereals", motor_type: "Tractor", registration_number: "TR-003", responsible_person_id: "p5" },
    // Workshop
    { id: "m13", programme_id: "workshop", motor_type: "Vehicle", registration_number: "UG-606-PQR", responsible_person_id: "p6" },
    { id: "m14", programme_id: "workshop", motor_type: "Tractor", registration_number: "TR-004", responsible_person_id: "p6" }
];

// Seed Service Records (Initial Statuses)
const DEFAULT_SERVICE_RECORDS = [
    { id: "sr1", motor_id: "m1", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 120500, next_service_odometer: 125500, service_station: "Main Workshop", recorded_by: "Sarah K.", created_at: "2026-08-01" },
    { id: "sr2", motor_id: "m2", status: "Pending", reason_pending: "Spare parts not available", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "John M.", created_at: "2026-08-05" },
    { id: "sr3", motor_id: "m3", status: "Overdue", reason_pending: "", reason_overdue: "Missed service date", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "John M.", created_at: "2026-07-28" },
    { id: "sr4", motor_id: "m4", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 89300, next_service_odometer: 94300, service_station: "Regional Workshop", recorded_by: "Sarah K.", created_at: "2026-08-02" },
    { id: "sr5", motor_id: "m5", status: "Pending", reason_pending: "Workshop slot not available", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "Sarah K.", created_at: "2026-08-06" },
    { id: "sr6", motor_id: "m6", status: "Overdue", reason_pending: "", reason_overdue: "Motor was in use", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "Peter O.", created_at: "2026-07-20" },
    { id: "sr7", motor_id: "m7", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 4200, next_service_odometer: 4700, service_station: "External Service Station", recorded_by: "Peter O.", created_at: "2026-08-03" },
    { id: "sr8", motor_id: "m8", status: "Pending", reason_pending: "Awaiting approval", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "Amina N.", created_at: "2026-08-07" },
    { id: "sr9", motor_id: "m9", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 15400, next_service_odometer: 17400, service_station: "On-site Mechanic", recorded_by: "Amina N.", created_at: "2026-08-04" },
    { id: "sr10", motor_id: "m10", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 201100, next_service_odometer: 206100, service_station: "Main Workshop", recorded_by: "David L.", created_at: "2026-08-02" },
    { id: "sr11", motor_id: "m11", status: "Overdue", reason_pending: "", reason_overdue: "Workshop delay", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "David L.", created_at: "2026-07-15" },
    { id: "sr12", motor_id: "m12", status: "Pending", reason_pending: "Scheduled for later date", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "David L.", created_at: "2026-08-08" },
    { id: "sr13", motor_id: "m13", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 310500, next_service_odometer: 315500, service_station: "Main Workshop", recorded_by: "Grace T.", created_at: "2026-08-01" },
    { id: "sr14", motor_id: "m14", status: "Overdue", reason_pending: "", reason_overdue: "Pending approval", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "Grace T.", created_at: "2026-07-22" }
];

// Seed Location Assignments
const DEFAULT_LOCATION_ASSIGNMENTS = [
    { id: "la1", motor_id: "m1", location_name: "Headquarters", category: "On station", start_date: "2026-08-01", end_date: "2026-08-15", period_days: 14 },
    { id: "la2", motor_id: "m2", location_name: "Research Station", category: "On station", start_date: "2026-08-05", end_date: "2026-08-08", period_days: 3 },
    { id: "la3", motor_id: "m3", location_name: "Field Site A", category: "Field", start_date: "2026-07-28", end_date: "2026-08-12", period_days: 15 },
    { id: "la4", motor_id: "m4", location_name: "Field Site B", category: "Field", start_date: "2026-08-02", end_date: "2026-08-10", period_days: 8 },
    { id: "la5", motor_id: "m5", location_name: "Partner Station", category: "Off station", start_date: "2026-08-06", end_date: "2026-08-12", period_days: 6 },
    { id: "la6", motor_id: "m6", location_name: "Field Site A", category: "Field", start_date: "2026-07-20", end_date: "2026-08-05", period_days: 16 },
    { id: "la7", motor_id: "m7", location_name: "Research Station", category: "On station", start_date: "2026-08-03", end_date: "2026-08-20", period_days: 17 },
    { id: "la8", motor_id: "m8", location_name: "Off-site Location", category: "Off station", start_date: "2026-08-07", end_date: "2026-08-15", period_days: 8 },
    { id: "la9", motor_id: "m9", location_name: "Field Site B", category: "Field", start_date: "2026-08-04", end_date: "2026-08-14", period_days: 10 },
    { id: "la10", motor_id: "m10", location_name: "Headquarters", category: "On station", start_date: "2026-08-02", end_date: "2026-08-09", period_days: 7 },
    { id: "la11", motor_id: "m11", location_name: "Field Site A", category: "Field", start_date: "2026-07-15", end_date: "2026-08-15", period_days: 31 },
    { id: "la12", motor_id: "m12", location_name: "Research Station", category: "On station", start_date: "2026-08-08", end_date: "2026-08-28", period_days: 20 },
    { id: "la13", motor_id: "m13", location_name: "Headquarters", category: "On station", start_date: "2026-08-01", end_date: "2026-08-15", period_days: 14 },
    { id: "la14", motor_id: "m14", location_name: "Partner Station", category: "Off station", start_date: "2026-07-22", end_date: "2026-08-05", period_days: 14 }
];


// --- STATE MANAGEMENT ---
class StateStore {
    constructor() {
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            this.programmes = JSON.parse(localStorage.getItem("nacrri_programmes")) || DEFAULT_PROGRAMMES;
            this.persons = JSON.parse(localStorage.getItem("nacrri_persons")) || DEFAULT_PERSONS;
            this.motors = JSON.parse(localStorage.getItem("nacrri_motors")) || DEFAULT_MOTORS;
            this.service_records = JSON.parse(localStorage.getItem("nacrri_service_records")) || DEFAULT_SERVICE_RECORDS;
            this.location_assignments = JSON.parse(localStorage.getItem("nacrri_location_assignments")) || DEFAULT_LOCATION_ASSIGNMENTS;
            this.dropdowns = JSON.parse(localStorage.getItem("nacrri_dropdowns")) || DEFAULT_DROPDOWNS;

            // Default app view states
            this.currentUser = {
                role: "Super Admin", // "Super Admin", "Programme Admin", "Management Viewer"
                programmeId: "admin", // Active programme context for Programme Admin
                name: "PHRAO Admin"
            };
            this.activeView = "login"; // "login", "overview", "workspace", "reports", "settings"
            this.activeWorkspaceTab = "dashboard"; // "dashboard", "register", "service", "location", "entry-form"
            this.selectedProgrammeId = "admin"; // Selected programme for view/filters
            this.viewingMotorId = null; // Right side details drawer
            this.editingMotorId = null; // Motor id currently being edited in form
        } catch (e) {
            console.error("Failed to load local storage", e);
            this.resetToDefaults();
        }
    }

    saveToStorage() {
        localStorage.setItem("nacrri_programmes", JSON.stringify(this.programmes));
        localStorage.setItem("nacrri_persons", JSON.stringify(this.persons));
        localStorage.setItem("nacrri_motors", JSON.stringify(this.motors));
        localStorage.setItem("nacrri_service_records", JSON.stringify(this.service_records));
        localStorage.setItem("nacrri_location_assignments", JSON.stringify(this.location_assignments));
        localStorage.setItem("nacrri_dropdowns", JSON.stringify(this.dropdowns));
    }

    resetToDefaults() {
        localStorage.clear();
        this.loadFromStorage();
        app.render();
    }

    // --- GETTERS & LOGIC ---
    getProgrammeName(id) {
        const prog = this.programmes.find(p => p.id === id);
        return prog ? prog.name : id;
    }

    getPersonName(id) {
        const person = this.persons.find(p => p.id === id);
        return person ? person.name : "Unknown";
    }

    getMotorLatestStatus(motorId) {
        const records = this.service_records.filter(r => r.motor_id === motorId);
        if (records.length === 0) return { status: "Pending", reason_pending: "Awaiting inspection", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", created_at: "" };
        // Sort descending by date or id
        records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return records[0];
    }

    getMotorLatestLocation(motorId) {
        const assigns = this.location_assignments.filter(a => a.motor_id === motorId);
        if (assigns.length === 0) return { location_name: "Headquarters", category: "On station", start_date: "", end_date: "", period_days: 0 };
        assigns.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        return assigns[0];
    }

    getMotorsByProgramme(programmeId) {
        return this.motors.filter(m => m.programme_id === programmeId);
    }

    // Comprehensive statistical calculations for a programme
    getProgrammeStats(programmeId) {
        const progMotors = this.getMotorsByProgramme(programmeId);
        const stats = {
            total: progMotors.length,
            serviced: 0,
            pending: 0,
            overdue: 0,
            vehicles: 0,
            motorcycles: 0,
            tractors: 0,
            field: 0,
            onStation: 0,
            offStation: 0
        };

        progMotors.forEach(m => {
            // Service Status
            const latestService = this.getMotorLatestStatus(m.id);
            if (latestService.status === "Serviced") stats.serviced++;
            else if (latestService.status === "Pending") stats.pending++;
            else if (latestService.status === "Overdue") stats.overdue++;

            // Motor Type
            if (m.motor_type === "Vehicle" || m.motor_type === "Motor Vehicle" || m.motor_type === "Van" || m.motor_type === "Bus") stats.vehicles++;
            else if (m.motor_type === "Motorcycle") stats.motorcycles++;
            else if (m.motor_type === "Tractor") stats.tractors++;

            // Location
            const latestLoc = this.getMotorLatestLocation(m.id);
            if (latestLoc.category === "Field") stats.field++;
            else if (latestLoc.category === "On station") stats.onStation++;
            else if (latestLoc.category === "Off station") stats.offStation++;
        });

        return stats;
    }

    // Adds a brand new motor to the register
    addMotor(programmeId, motorType, registrationNumber, responsiblePersonId) {
        const id = "m_" + Date.now();
        const newMotor = {
            id,
            programme_id: programmeId,
            motor_type: motorType,
            registration_number: registrationNumber,
            responsible_person_id: responsiblePersonId
        };
        this.motors.push(newMotor);
        this.saveToStorage();
        return id;
    }

    // Records a new status/location entry
    saveMotorEntry(formData) {
        const motorId = formData.motor_id;
        const recordedBy = this.currentUser.name;
        const entryDate = new Date().toISOString().split("T")[0];

        // 1. Save Service Record
        const serviceId = "sr_" + Date.now();
        const newService = {
            id: serviceId,
            motor_id: motorId,
            status: formData.service_status,
            reason_pending: formData.service_status === "Pending" ? formData.reason_pending : "",
            reason_overdue: formData.service_status === "Overdue" ? formData.reason_overdue : "",
            odometer_reading: formData.service_status === "Serviced" ? Number(formData.odometer_reading) : "",
            next_service_odometer: formData.service_status === "Serviced" ? Number(formData.next_service_odometer) : "",
            service_station: formData.service_status === "Serviced" ? formData.service_station : "",
            recorded_by: recordedBy,
            created_at: entryDate
        };
        this.service_records.push(newService);

        // 2. Save Location Assignment
        const locationId = "la_" + Date.now();
        const newAssignment = {
            id: locationId,
            motor_id: motorId,
            location_name: formData.location_name,
            category: formData.location_category,
            start_date: formData.start_date,
            end_date: formData.end_date,
            period_days: Number(formData.period_days)
        };
        this.location_assignments.push(newAssignment);

        // 3. Update responsible person of motor if changed
        const motor = this.motors.find(m => m.id === motorId);
        if (motor && formData.responsible_person_id) {
            motor.responsible_person_id = formData.responsible_person_id;
        }

        this.saveToStorage();
    }
}

// Instantiate Global State
const state = new StateStore();

// --- CONTROLLER / VIEW RENDER ENGINE ---
class AppController {
    constructor() {
        this.historyStack = [];
        this.setupEventListeners();
    }

    init() {
        this.render();
    }

    setupEventListeners() {
        // Keyboard navigation shortcuts (Escape key triggers Go Back)
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.goBack();
            }
        });

        // Global delegate for SPA navigation links
        document.addEventListener("click", (e) => {
            const navLink = e.target.closest("[data-view]");
            if (navLink) {
                e.preventDefault();
                const view = navLink.getAttribute("data-view");
                const progId = navLink.getAttribute("data-programme-id");

                if (state.currentUser.role === "Programme Admin" && view === "overview") {
                    // Programme Admins cannot view the general overview, force workspace
                    this.switchView("workspace", state.currentUser.programmeId);
                    return;
                }

                if (state.currentUser.role === "Programme Admin" && view === "settings") {
                    alert("Access Denied: Settings are only accessible by Super Admin.");
                    return;
                }

                if (progId) {
                    this.switchView(view, progId);
                } else {
                    this.switchView(view);
                }
            }

            // Tab toggling within workspace
            const tabLink = e.target.closest("[data-tab]");
            if (tabLink) {
                e.preventDefault();
                const tab = tabLink.getAttribute("data-tab");
                this.switchWorkspaceTab(tab);
            }

            // Close Side Drawer
            const closeDrawer = e.target.closest("#close-drawer") || e.target.closest(".btn-back-drawer");
            if (closeDrawer) {
                this.closeDetailsDrawer();
            }

            // Row click in registers
            const motorRow = e.target.closest(".motor-row");
            if (motorRow) {
                const motorId = motorRow.getAttribute("data-motor-id");
                this.openDetailsDrawer(motorId);
            }
        });
    }

    switchView(view, programmeId = null, pushHistory = true) {
        if (pushHistory && (state.activeView !== view || (programmeId && state.selectedProgrammeId !== programmeId))) {
            this.historyStack.push({
                type: "view",
                view: state.activeView,
                tab: state.activeWorkspaceTab,
                programmeId: state.selectedProgrammeId
            });
        }

        state.activeView = view;
        if (programmeId) {
            state.selectedProgrammeId = programmeId;
        }
        
        // Handle view restriction for Programme Admin
        if (state.currentUser.role === "Programme Admin") {
            // Lock selected programme to admin's own programme
            state.selectedProgrammeId = state.currentUser.programmeId;
            if (view === "overview") {
                state.activeView = "workspace";
            }
        }

        this.closeDetailsDrawer();
        this.render();
    }

    switchWorkspaceTab(tab, pushHistory = true) {
        if (pushHistory && state.activeWorkspaceTab !== tab) {
            this.historyStack.push({
                type: "tab",
                view: state.activeView,
                tab: state.activeWorkspaceTab,
                programmeId: state.selectedProgrammeId
            });
        }

        state.activeWorkspaceTab = tab;
        this.render();
        
        if (tab === "entry-form") {
            this.initEntryForm();
        }
    }

    goBack() {
        // If details side drawer is open, close drawer first
        if (state.viewingMotorId) {
            this.closeDetailsDrawer();
            return;
        }

        if (this.historyStack.length > 0) {
            const prev = this.historyStack.pop();
            state.selectedProgrammeId = prev.programmeId;
            state.activeWorkspaceTab = prev.tab;
            state.activeView = prev.view;
            this.render();
            if (prev.tab === "entry-form") {
                this.initEntryForm();
            }
        } else {
            // Default smooth fallback
            if (state.activeView === "workspace") {
                if (state.currentUser.role === "Programme Admin") {
                    state.activeWorkspaceTab = "dashboard";
                } else {
                    state.activeView = "overview";
                }
            } else if (state.activeView === "reports" || state.activeView === "settings") {
                state.activeView = state.currentUser.role === "Programme Admin" ? "workspace" : "overview";
            }
            this.render();
        }
    }

    openDetailsDrawer(motorId) {
        state.viewingMotorId = motorId;
        const drawer = document.getElementById("details-drawer");
        if (drawer) {
            drawer.classList.add("open");
            this.renderDetailsDrawer();
        }
    }

    closeDetailsDrawer() {
        state.viewingMotorId = null;
        const drawer = document.getElementById("details-drawer");
        if (drawer) {
            drawer.classList.remove("open");
        }
    }

    // --- FORM HANDLERS ---
    initEntryForm(editMotorId = null) {
        const form = document.getElementById("motor-entry-form");
        if (!form) return;

        form.reset();
        state.editingMotorId = editMotorId;

        const dateInput = document.getElementById("form-entry-date");
        const userRef = document.getElementById("form-recorded-by");
        
        if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
        if (userRef) userRef.value = state.currentUser.name;

        // Force program selection
        const progSelect = document.getElementById("form-programme");
        if (progSelect) {
            progSelect.value = state.selectedProgrammeId;
            // Locked if Programme Admin
            if (state.currentUser.role === "Programme Admin") {
                progSelect.disabled = true;
            } else {
                progSelect.disabled = false;
            }
        }

        // Setup dropdown listeners
        this.populateEntryFormFilters();
        this.handleFormConditionalVisibility();
    }

    populateEntryFormFilters() {
        const progId = document.getElementById("form-programme")?.value || state.selectedProgrammeId;
        const motorType = document.getElementById("form-motor-type")?.value || "";

        // Filter registrations by Programme + Type
        const regSelect = document.getElementById("form-registration");
        if (regSelect) {
            regSelect.innerHTML = '<option value="">-- Select Registration --</option>';
            const filteredMotors = state.motors.filter(m => m.programme_id === progId && (motorType === "" || m.motor_type === motorType));
            filteredMotors.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m.id;
                opt.textContent = m.registration_number;
                regSelect.appendChild(opt);
            });
        }

        // Filter responsible persons by Programme
        const personSelect = document.getElementById("form-responsible-person");
        if (personSelect) {
            personSelect.innerHTML = '<option value="">-- Select Responsible Person --</option>';
            const filteredPeople = state.persons.filter(p => p.programme_id === progId);
            filteredPeople.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.id;
                opt.textContent = p.name;
                personSelect.appendChild(opt);
            });
        }

        // Populate locations
        const locSelect = document.getElementById("form-location");
        if (locSelect) {
            locSelect.innerHTML = '<option value="">-- Select Location --</option>';
            state.dropdowns.locations.forEach(l => {
                const opt = document.createElement("option");
                opt.value = l.name;
                opt.textContent = l.name;
                opt.setAttribute("data-category", l.category);
                locSelect.appendChild(opt);
            });
        }

        // Service Stations
        const stationSelect = document.getElementById("form-service-station");
        if (stationSelect) {
            stationSelect.innerHTML = '<option value="">-- Select Station --</option>';
            state.dropdowns.serviceStations.forEach(s => {
                const opt = document.createElement("option");
                opt.value = s;
                opt.textContent = s;
                stationSelect.appendChild(opt);
            });
        }

        // Pending Reasons
        const pendingSelect = document.getElementById("form-pending-reason");
        if (pendingSelect) {
            pendingSelect.innerHTML = '<option value="">-- Select Pending Reason --</option>';
            state.dropdowns.pendingReasons.forEach(r => {
                const opt = document.createElement("option");
                opt.value = r;
                opt.textContent = r;
                pendingSelect.appendChild(opt);
            });
        }

        // Overdue Reasons
        const overdueSelect = document.getElementById("form-overdue-reason");
        if (overdueSelect) {
            overdueSelect.innerHTML = '<option value="">-- Select Overdue Reason --</option>';
            state.dropdowns.overdueReasons.forEach(r => {
                const opt = document.createElement("option");
                opt.value = r;
                opt.textContent = r;
                overdueSelect.appendChild(opt);
            });
        }
    }

    handleFormConditionalVisibility() {
        const serviceStatus = document.getElementById("form-service-status")?.value || "";
        
        const pendingGroup = document.getElementById("group-pending-reason");
        const overdueGroup = document.getElementById("group-overdue-reason");
        const servicedGroupOdo = document.getElementById("group-odometer");
        const servicedGroupStation = document.getElementById("group-service-station");

        // Hide all initially
        if (pendingGroup) pendingGroup.classList.add("hidden");
        if (overdueGroup) overdueGroup.classList.add("hidden");
        if (servicedGroupOdo) servicedGroupOdo.classList.add("hidden");
        if (servicedGroupStation) servicedGroupStation.classList.add("hidden");

        // Dynamic required flags toggle
        document.getElementById("form-pending-reason").required = false;
        document.getElementById("form-overdue-reason").required = false;
        document.getElementById("form-odometer").required = false;
        document.getElementById("form-service-station").required = false;

        if (serviceStatus === "Serviced") {
            if (servicedGroupOdo) servicedGroupOdo.classList.remove("hidden");
            if (servicedGroupStation) servicedGroupStation.classList.remove("hidden");
            document.getElementById("form-odometer").required = true;
            document.getElementById("form-service-station").required = true;
        } else if (serviceStatus === "Pending") {
            if (pendingGroup) pendingGroup.classList.remove("hidden");
            document.getElementById("form-pending-reason").required = true;
        } else if (serviceStatus === "Overdue") {
            if (overdueGroup) overdueGroup.classList.remove("hidden");
            document.getElementById("form-overdue-reason").required = true;
        }

        this.validateForm();
    }

    calculatePeriodOfStay() {
        const startVal = document.getElementById("form-start-date")?.value;
        const endVal = document.getElementById("form-end-date")?.value;
        const periodField = document.getElementById("form-period-days");

        if (startVal && endVal && periodField) {
            const start = new Date(startVal);
            const end = new Date(endVal);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            periodField.value = diffDays >= 0 ? diffDays : 0;
        } else if (periodField) {
            periodField.value = 0;
        }
        this.validateForm();
    }

    validateForm() {
        const form = document.getElementById("motor-entry-form");
        const submitBtn = document.getElementById("btn-save-entry");
        if (!form || !submitBtn) return;

        // Basic HTML5 validation + conditional field custom validations
        const isValid = form.checkValidity();
        submitBtn.disabled = !isValid;
    }


    // --- RENDER CONTROLLER VIEWS ---
    render() {
        const loginWrapper = document.getElementById("view-login");
        const mainAppShell = document.getElementById("main-application");

        if (state.activeView === "login") {
            if (loginWrapper) loginWrapper.classList.remove("hidden");
            if (mainAppShell) mainAppShell.classList.add("hidden");
            return;
        } else {
            if (loginWrapper) loginWrapper.classList.add("hidden");
            if (mainAppShell) mainAppShell.classList.remove("hidden");
        }

        // Update user indicators in nav/sidebar
        const userElements = document.querySelectorAll(".current-user-name");
        userElements.forEach(el => el.textContent = state.currentUser.name);

        const roleElements = document.querySelectorAll(".current-user-role");
        roleElements.forEach(el => el.textContent = state.currentUser.role);

        const progElements = document.querySelectorAll(".current-user-programme");
        progElements.forEach(el => el.textContent = state.getProgrammeName(state.currentUser.programmeId));

        // Navigation elements active state highlights
        const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
        sidebarLinks.forEach(link => {
            const view = link.getAttribute("data-view");
            if (view === state.activeView) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // Hide/Show screens
        const views = ["login", "overview", "workspace", "reports", "settings"];
        views.forEach(v => {
            const container = document.getElementById(`view-${v}`);
            if (container) {
                if (v === state.activeView) {
                    container.classList.remove("hidden");
                } else {
                    container.classList.add("hidden");
                }
            }
        });

        // Hide settings sidebar link if not Super Admin
        const settingsLink = document.querySelector('[data-view="settings"]')?.closest("li");
        if (settingsLink) {
            if (state.currentUser.role !== "Super Admin") {
                settingsLink.style.display = "none";
            } else {
                settingsLink.style.display = "block";
            }
        }

        // Hide overview sidebar link if Programme Admin (since they only see their own programme workspace)
        const overviewLink = document.querySelector('[data-view="overview"]')?.closest("li");
        if (overviewLink) {
            if (state.currentUser.role === "Programme Admin") {
                overviewLink.style.display = "none";
            } else {
                overviewLink.style.display = "block";
            }
        }

        // Render target view content
        if (state.activeView === "overview") {
            this.renderOverview();
        } else if (state.activeView === "workspace") {
            this.renderWorkspace();
        } else if (state.activeView === "reports") {
            this.renderReports();
        } else if (state.activeView === "settings") {
            this.renderSettings();
        }
    }

    renderOverview() {
        const container = document.getElementById("programmes-grid");
        if (!container) return;

        container.innerHTML = "";

        const progIcons = {
            "admin": "icons/icon_programme_admin.png",
            "horticulture": "icons/icon_programme_horticulture.png",
            "legumes": "icons/icon_programme_legumes.png",
            "rootcrops": "icons/icon_programme_rootcrops.png",
            "cereals": "icons/icon_programme_cereals.png",
            "workshop": "icons/icon_programme_workshop.png"
        };

        state.programmes.forEach(p => {
            const stats = state.getProgrammeStats(p.id);
            const iconPath = progIcons[p.id] || "icons/icon_programme_admin.png";

            const card = document.createElement("div");
            card.className = "programme-card";
            card.setAttribute("data-view", "workspace");
            card.setAttribute("data-programme-id", p.id);
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-icon-box">
                        <img src="${iconPath}" alt="${p.name}" class="prog-icon-img" />
                    </div>
                    <div>
                        <h3>${p.name}</h3>
                        <span class="total-badge">${stats.total} Motors</span>
                    </div>
                </div>
                <div class="card-stats-grid">
                    <div class="stat-box serviced">
                        <div class="stat-val">${stats.serviced}</div>
                        <div class="stat-lbl">Serviced</div>
                    </div>
                    <div class="stat-box pending">
                        <div class="stat-val">${stats.pending}</div>
                        <div class="stat-lbl">Pending</div>
                    </div>
                    <div class="stat-box overdue">
                        <div class="stat-val">${stats.overdue}</div>
                        <div class="stat-lbl">Overdue</div>
                    </div>
                </div>
                <div class="card-footer">
                    <span>View Workspace &rarr;</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderWorkspace() {
        const header = document.getElementById("workspace-header-title");
        if (header) {
            header.textContent = `${state.getProgrammeName(state.selectedProgrammeId)} Workspace`;
        }

        // Workspace tab highlight
        const tabLinks = document.querySelectorAll(".workspace-tabs a");
        tabLinks.forEach(link => {
            const tab = link.getAttribute("data-tab");
            if (tab === state.activeWorkspaceTab) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // Hide/Show workspace contents
        const tabs = ["dashboard", "register", "service", "location", "entry-form"];
        tabs.forEach(t => {
            const section = document.getElementById(`workspace-${t}`);
            if (section) {
                if (t === state.activeWorkspaceTab) {
                    section.classList.remove("hidden");
                } else {
                    section.classList.add("hidden");
                }
            }
        });

        // Render sub-tabs
        if (state.activeWorkspaceTab === "dashboard") {
            this.renderWorkspaceDashboard();
        } else if (state.activeWorkspaceTab === "register") {
            this.renderWorkspaceRegister();
        } else if (state.activeWorkspaceTab === "service") {
            this.renderWorkspaceServiceTracker();
        } else if (state.activeWorkspaceTab === "location") {
            this.renderWorkspaceLocationTracker();
        }
    }

    renderWorkspaceDashboard() {
        const stats = state.getProgrammeStats(state.selectedProgrammeId);
        
        // Populate dashboard high-level cards
        document.getElementById("dash-total-motors").textContent = stats.total;
        document.getElementById("dash-serviced-motors").textContent = stats.serviced;
        document.getElementById("dash-pending-motors").textContent = stats.pending;
        document.getElementById("dash-overdue-motors").textContent = stats.overdue;

        // Render simple graphical representations (CSS flex bar/percentage)
        const typeContainer = document.getElementById("dash-type-stats");
        if (typeContainer) {
            const total = stats.vehicles + stats.motorcycles + stats.tractors || 1;
            const vPct = Math.round((stats.vehicles / total) * 100);
            const mPct = Math.round((stats.motorcycles / total) * 100);
            const tPct = Math.round((stats.tractors / total) * 100);

            typeContainer.innerHTML = `
                <div class="stat-chart-bar">
                    <div style="width: ${vPct}%; background: var(--primary-green);" title="Vehicles"></div>
                    <div style="width: ${mPct}%; background: var(--secondary-amber);" title="Motorcycles"></div>
                    <div style="width: ${tPct}%; background: var(--secondary-blue);" title="Tractors"></div>
                </div>
                <ul class="stat-chart-legend">
                    <li><span class="legend-dot" style="background: var(--primary-green)"></span> Vehicles: <strong>${stats.vehicles}</strong> (${vPct}%)</li>
                    <li><span class="legend-dot" style="background: var(--secondary-amber)"></span> Motorcycles: <strong>${stats.motorcycles}</strong> (${mPct}%)</li>
                    <li><span class="legend-dot" style="background: var(--secondary-blue)"></span> Tractors: <strong>${stats.tractors}</strong> (${tPct}%)</li>
                </ul>
            `;
        }

        const statusContainer = document.getElementById("dash-status-stats");
        if (statusContainer) {
            const total = stats.serviced + stats.pending + stats.overdue || 1;
            const sPct = Math.round((stats.serviced / total) * 100);
            const pPct = Math.round((stats.pending / total) * 100);
            const oPct = Math.round((stats.overdue / total) * 100);

            statusContainer.innerHTML = `
                <div class="stat-chart-bar">
                    <div style="width: ${sPct}%; background: var(--status-serviced-bg);" title="Serviced"></div>
                    <div style="width: ${pPct}%; background: var(--status-pending-bg);" title="Pending"></div>
                    <div style="width: ${oPct}%; background: var(--status-overdue-bg);" title="Overdue"></div>
                </div>
                <ul class="stat-chart-legend">
                    <li><span class="legend-dot" style="background: var(--status-serviced-bg)"></span> Serviced: <strong>${stats.serviced}</strong> (${sPct}%)</li>
                    <li><span class="legend-dot" style="background: var(--status-pending-bg)"></span> Pending: <strong>${stats.pending}</strong> (${pPct}%)</li>
                    <li><span class="legend-dot" style="background: var(--status-overdue-bg)"></span> Overdue: <strong>${stats.overdue}</strong> (${oPct}%)</li>
                </ul>
            `;
        }

        const locContainer = document.getElementById("dash-location-stats");
        if (locContainer) {
            const total = stats.field + stats.onStation + stats.offStation || 1;
            const fPct = Math.round((stats.field / total) * 100);
            const onPct = Math.round((stats.onStation / total) * 100);
            const offPct = Math.round((stats.offStation / total) * 100);

            locContainer.innerHTML = `
                <div class="stat-chart-bar">
                    <div style="width: ${fPct}%; background: var(--category-field-bg);" title="Field"></div>
                    <div style="width: ${onPct}%; background: var(--category-onstation-bg);" title="On station"></div>
                    <div style="width: ${offPct}%; background: var(--category-offstation-bg);" title="Off station"></div>
                </div>
                <ul class="stat-chart-legend">
                    <li><span class="legend-dot" style="background: var(--category-field-bg)"></span> Field: <strong>${stats.field}</strong> (${fPct}%)</li>
                    <li><span class="legend-dot" style="background: var(--category-onstation-bg)"></span> On Station: <strong>${stats.onStation}</strong> (${onPct}%)</li>
                    <li><span class="legend-dot" style="background: var(--category-offstation-bg)"></span> Off Station: <strong>${stats.offStation}</strong> (${offPct}%)</li>
                </ul>
            `;
        }

        // Recent logs list
        const recentLogsContainer = document.getElementById("dash-recent-logs");
        if (recentLogsContainer) {
            recentLogsContainer.innerHTML = "";
            const progMotors = state.getMotorsByProgramme(state.selectedProgrammeId);
            const motorIds = progMotors.map(m => m.id);

            // Filter service records for these motors
            const records = state.service_records.filter(r => motorIds.includes(r.motor_id));
            records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const sliced = records.slice(0, 5);
            if (sliced.length === 0) {
                recentLogsContainer.innerHTML = `<li class="empty-state">No recent service updates recorded</li>`;
            } else {
                sliced.forEach(r => {
                    const m = state.motors.find(mot => mot.id === r.motor_id);
                    const li = document.createElement("li");
                    li.className = "log-item";
                    li.innerHTML = `
                        <div class="log-details">
                            <span class="log-motor">${m ? m.registration_number : "Unknown"}</span>
                            <span class="log-status badge ${r.status.toLowerCase()}">${r.status}</span>
                            <div class="log-meta">By ${r.recorded_by} on ${r.created_at}</div>
                        </div>
                    `;
                    recentLogsContainer.appendChild(li);
                });
            }
        }
    }

    renderWorkspaceRegister() {
        const tbody = document.getElementById("register-table-body");
        if (!tbody) return;

        tbody.innerHTML = "";
        const progMotors = state.getMotorsByProgramme(state.selectedProgrammeId);

        // Search & Filters inputs
        const searchQuery = document.getElementById("reg-search")?.value.toLowerCase() || "";
        const typeFilter = document.getElementById("reg-filter-type")?.value || "";
        const statusFilter = document.getElementById("reg-filter-status")?.value || "";

        const filtered = progMotors.filter(m => {
            const matchesSearch = m.registration_number.toLowerCase().includes(searchQuery) ||
                state.getPersonName(m.responsible_person_id).toLowerCase().includes(searchQuery);
            const matchesType = typeFilter === "" || m.motor_type === typeFilter;
            
            const service = state.getMotorLatestStatus(m.id);
            const matchesStatus = statusFilter === "" || service.status === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-table">No matching motors found in this programme.</td></tr>`;
            return;
        }

        filtered.forEach(m => {
            const service = state.getMotorLatestStatus(m.id);
            const loc = state.getMotorLatestLocation(m.id);
            const personName = state.getPersonName(m.responsible_person_id);

            const tr = document.createElement("tr");
            tr.className = "motor-row";
            tr.setAttribute("data-motor-id", m.id);

            // Real-time Photo Icon HTML
            const iconHTML = getMotorIconHTML(m.motor_type);

            tr.innerHTML = `
                <td><span class="motor-icon">${iconHTML}</span> ${m.registration_number}</td>
                <td>${m.motor_type}</td>
                <td>${personName}</td>
                <td><span class="badge ${service.status.toLowerCase()}">${service.status}</span></td>
                <td><span class="badge-cat ${loc.category.toLowerCase().replace(" ", "")}">${loc.location_name} (${loc.category})</span></td>
                <td class="action-cell">
                    <button class="btn-table btn-view" onclick="event.stopPropagation(); app.openDetailsDrawer('${m.id}')">View</button>
                    ${state.currentUser.role !== "Management Viewer" ? `<button class="btn-table btn-edit" onclick="event.stopPropagation(); app.startStatusUpdate('${m.id}')">Update Status</button>` : ""}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    startStatusUpdate(motorId) {
        const motor = state.motors.find(m => m.id === motorId);
        if (!motor) return;

        // Switch to Entry Form
        this.switchWorkspaceTab("entry-form");

        // Wait brief millisecond for DOM to render then fill
        setTimeout(() => {
            const motorTypeField = document.getElementById("form-motor-type");
            if (motorTypeField) {
                motorTypeField.value = motor.motor_type;
            }
            this.populateEntryFormFilters();

            const regField = document.getElementById("form-registration");
            if (regField) {
                regField.value = motor.id;
            }

            const personField = document.getElementById("form-responsible-person");
            if (personField) {
                personField.value = motor.responsible_person_id;
            }

            // Prefill with current values of service and location
            const service = state.getMotorLatestStatus(motorId);
            const statusField = document.getElementById("form-service-status");
            if (statusField) {
                statusField.value = service.status;
                this.handleFormConditionalVisibility();
            }

            if (service.status === "Serviced") {
                document.getElementById("form-odometer").value = service.odometer_reading || "";
                document.getElementById("form-service-station").value = service.service_station || "";
            } else if (service.status === "Pending") {
                document.getElementById("form-pending-reason").value = service.reason_pending || "";
            } else if (service.status === "Overdue") {
                document.getElementById("form-overdue-reason").value = service.reason_overdue || "";
            }

            const loc = state.getMotorLatestLocation(motorId);
            const locField = document.getElementById("form-location");
            if (locField) {
                locField.value = loc.location_name || "";
            }
            const catField = document.getElementById("form-location-category");
            if (catField) {
                catField.value = loc.category || "";
            }
            document.getElementById("form-start-date").value = loc.start_date || "";
            document.getElementById("form-end-date").value = loc.end_date || "";
            document.getElementById("form-period-days").value = loc.period_days || 0;

            this.validateForm();
        }, 50);
    }

    renderWorkspaceServiceTracker() {
        const tbody = document.getElementById("service-table-body");
        if (!tbody) return;

        tbody.innerHTML = "";
        const progMotors = state.getMotorsByProgramme(state.selectedProgrammeId);

        progMotors.forEach(m => {
            const service = state.getMotorLatestStatus(m.id);
            const personName = state.getPersonName(m.responsible_person_id);

            let reason = "-";
            if (service.status === "Pending") reason = service.reason_pending;
            else if (service.status === "Overdue") reason = service.reason_overdue;

            let extra = "-";
            if (service.status === "Serviced") {
                extra = `Odo: ${service.odometer_reading} km (${service.service_station})`;
            }

            const tr = document.createElement("tr");
            tr.className = "motor-row";
            tr.setAttribute("data-motor-id", m.id);
            tr.innerHTML = `
                <td><strong>${m.registration_number}</strong></td>
                <td>${m.motor_type}</td>
                <td><span class="badge ${service.status.toLowerCase()}">${service.status}</span></td>
                <td>${reason}</td>
                <td>${extra}</td>
                <td>${service.created_at || "No record"}</td>
                <td>${service.recorded_by || "-"}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderWorkspaceLocationTracker() {
        const tbody = document.getElementById("location-table-body");
        if (!tbody) return;

        tbody.innerHTML = "";
        const progMotors = state.getMotorsByProgramme(state.selectedProgrammeId);

        progMotors.forEach(m => {
            const loc = state.getMotorLatestLocation(m.id);
            const personName = state.getPersonName(m.responsible_person_id);

            const tr = document.createElement("tr");
            tr.className = "motor-row";
            tr.setAttribute("data-motor-id", m.id);

            let dates = "-";
            if (loc.start_date) {
                dates = `${loc.start_date} to ${loc.end_date}`;
            }

            tr.innerHTML = `
                <td><strong>${m.registration_number}</strong></td>
                <td>${personName}</td>
                <td><span class="badge-cat ${loc.category.toLowerCase().replace(" ", "")}">${loc.location_name}</span></td>
                <td>${loc.category}</td>
                <td>${dates}</td>
                <td><strong>${loc.period_days || 0}</strong> days</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderDetailsDrawer() {
        const drawerContent = document.getElementById("drawer-content");
        if (!drawerContent || !state.viewingMotorId) return;

        const m = state.motors.find(mot => mot.id === state.viewingMotorId);
        if (!m) return;

        const latestService = state.getMotorLatestStatus(m.id);
        const latestLoc = state.getMotorLatestLocation(m.id);
        const personName = state.getPersonName(m.responsible_person_id);

        // Fetch histories
        const serviceHistory = state.service_records
            .filter(r => r.motor_id === m.id)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const locationHistory = state.location_assignments
            .filter(a => a.motor_id === m.id)
            .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

        const iconHTML = getMotorIconHTML(m.motor_type);

        let serviceHistoryRows = serviceHistory.map(h => `
            <tr>
                <td>${h.created_at}</td>
                <td><span class="badge ${h.status.toLowerCase()}">${h.status}</span></td>
                <td>${h.status === "Serviced" ? `Odo: ${h.odometer_reading} (Next: ${h.next_service_odometer || 'N/A'}) - ${h.service_station}` : (h.reason_pending || h.reason_overdue || '-')}</td>
                <td>${h.recorded_by}</td>
            </tr>
        `).join("");

        let locationHistoryRows = locationHistory.map(h => `
            <tr>
                <td>${h.start_date}</td>
                <td>${h.end_date}</td>
                <td><span class="badge-cat ${h.category.toLowerCase().replace(" ", "")}">${h.location_name} (${h.category})</span></td>
                <td>${h.period_days} days</td>
            </tr>
        `).join("");

        drawerContent.innerHTML = `
            <div class="drawer-header-summary">
                <div class="drawer-top-actions">
                    <button class="btn-back-drawer">&larr; Back</button>
                </div>
                <span class="drawer-icon">${iconHTML}</span>
                <h2>${m.registration_number}</h2>
                <div class="drawer-source-project">Source Programme: <strong>${state.getProgrammeName(m.programme_id)}</strong></div>
            </div>
            
            <div class="drawer-section">
                <h3>Core Specifications</h3>
                <table class="details-mini-table">
                    <tr><th>Motor Type:</th><td>${m.motor_type}</td></tr>
                    <tr><th>Registration:</th><td>${m.registration_number}</td></tr>
                    <tr><th>Responsible Custodian:</th><td>${personName}</td></tr>
                </table>
            </div>

            <div class="drawer-section">
                <h3>Current Status & Location</h3>
                <table class="details-mini-table">
                    <tr><th>Service Status:</th><td><span class="badge ${latestService.status.toLowerCase()}">${latestService.status}</span></td></tr>
                    <tr><th>Current Location:</th><td><span class="badge-cat ${latestLoc.category.toLowerCase().replace(" ", "")}">${latestLoc.location_name} (${latestLoc.category})</span></td></tr>
                    <tr><th>Period of stay:</th><td><strong>${latestLoc.period_days || 0} days</strong> (${latestLoc.start_date} to ${latestLoc.end_date})</td></tr>
                </table>
            </div>

            <div class="drawer-section">
                <h3>Service History</h3>
                <div class="table-scroll-container">
                    <table class="drawer-history-table">
                        <thead>
                            <tr><th>Date</th><th>Status</th><th>Details</th><th>Recorder</th></tr>
                        </thead>
                        <tbody>
                            ${serviceHistoryRows || '<tr><td colspan="4" class="empty-table">No service entries recorded yet</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="drawer-section">
                <h3>Location History</h3>
                <div class="table-scroll-container">
                    <table class="drawer-history-table">
                        <thead>
                            <tr><th>Start</th><th>End</th><th>Location</th><th>Period</th></tr>
                        </thead>
                        <tbody>
                            ${locationHistoryRows || '<tr><td colspan="4" class="empty-table">No location logs recorded yet</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderReports() {
        const typeSelect = document.getElementById("report-type");
        if (!typeSelect) return;

        const reportType = typeSelect.value;
        const tbody = document.getElementById("reports-table-body");
        const thead = document.getElementById("reports-table-head");
        
        if (!tbody || !thead) return;

        tbody.innerHTML = "";
        thead.innerHTML = "";

        // Standard dynamic header mapper
        let headers = [];
        let rowsData = [];

        // Fetch overall records across all programmes or filter by selected program
        const searchProgramme = document.getElementById("report-programme-filter")?.value || "";

        let filteredMotors = state.motors;
        if (searchProgramme !== "") {
            filteredMotors = state.motors.filter(m => m.programme_id === searchProgramme);
        }

        switch (reportType) {
            case "by_programme":
                headers = ["Programme", "Total Motors", "Serviced", "Pending", "Overdue"];
                thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

                state.programmes.forEach(p => {
                    const stats = state.getProgrammeStats(p.id);
                    rowsData.push([
                        p.name,
                        stats.total,
                        stats.serviced,
                        stats.pending,
                        stats.overdue
                    ]);
                });
                break;

            case "by_status":
                headers = ["Registration Number", "Programme", "Motor Type", "Responsible Person", "Service Status", "Last Odo / Reason", "Last Service Date"];
                thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

                filteredMotors.forEach(m => {
                    const s = state.getMotorLatestStatus(m.id);
                    let info = "-";
                    if (s.status === "Serviced") info = `Odo: ${s.odometer_reading}`;
                    else if (s.status === "Pending") info = s.reason_pending;
                    else if (s.status === "Overdue") info = s.reason_overdue;

                    rowsData.push([
                        m.registration_number,
                        state.getProgrammeName(m.programme_id),
                        m.motor_type,
                        state.getPersonName(m.responsible_person_id),
                        s.status,
                        info,
                        s.created_at || "N/A"
                    ]);
                });
                break;

            case "pending":
                headers = ["Registration Number", "Programme", "Motor Type", "Responsible Person", "Reason for Pending", "Date Flagged", "Recorded By"];
                thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

                filteredMotors.forEach(m => {
                    const s = state.getMotorLatestStatus(m.id);
                    if (s.status === "Pending") {
                        rowsData.push([
                            m.registration_number,
                            state.getProgrammeName(m.programme_id),
                            m.motor_type,
                            state.getPersonName(m.responsible_person_id),
                            s.reason_pending || "Other",
                            s.created_at,
                            s.recorded_by
                        ]);
                    }
                });
                break;

            case "overdue":
                headers = ["Registration Number", "Programme", "Motor Type", "Responsible Person", "Reason for Overdue", "Date Flagged", "Recorded By"];
                thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

                filteredMotors.forEach(m => {
                    const s = state.getMotorLatestStatus(m.id);
                    if (s.status === "Overdue") {
                        rowsData.push([
                            m.registration_number,
                            state.getProgrammeName(m.programme_id),
                            m.motor_type,
                            state.getPersonName(m.responsible_person_id),
                            s.reason_overdue || "Other",
                            s.created_at,
                            s.recorded_by
                        ]);
                    }
                });
                break;

            case "serviced":
                headers = ["Registration Number", "Programme", "Motor Type", "Odometer Reading", "Next Service Odo", "Service Station", "Service Date", "Recorded By"];
                thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

                filteredMotors.forEach(m => {
                    const s = state.getMotorLatestStatus(m.id);
                    if (s.status === "Serviced") {
                        rowsData.push([
                            m.registration_number,
                            state.getProgrammeName(m.programme_id),
                            m.motor_type,
                            s.odometer_reading,
                            s.next_service_odometer || (s.odometer_reading + 5000),
                            s.service_station,
                            s.created_at,
                            s.recorded_by
                        ]);
                    }
                });
                break;

            case "by_location":
                headers = ["Registration Number", "Programme", "Responsible Person", "Current Location", "Location Category", "Start Date", "Expected End Date", "Period of Stay"];
                thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

                filteredMotors.forEach(m => {
                    const l = state.getMotorLatestLocation(m.id);
                    rowsData.push([
                        m.registration_number,
                        state.getProgrammeName(m.programme_id),
                        state.getPersonName(m.responsible_person_id),
                        l.location_name,
                        l.category,
                        l.start_date || "N/A",
                        l.end_date || "N/A",
                        `${l.period_days || 0} days`
                    ]);
                });
                break;

            case "period_of_stay":
                headers = ["Registration Number", "Programme", "Location Assigned", "Category", "Duration Days", "Status Range"];
                thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

                // Gather all assignments sorted by period stay descending
                const allAssigns = [];
                filteredMotors.forEach(m => {
                    const assigns = state.location_assignments.filter(a => a.motor_id === m.id);
                    assigns.forEach(a => {
                        allAssigns.push({
                            reg: m.registration_number,
                            prog: state.getProgrammeName(m.programme_id),
                            loc: a.location_name,
                            cat: a.category,
                            days: a.period_days,
                            range: `${a.start_date} to ${a.end_date}`
                        });
                    });
                });

                allAssigns.sort((a, b) => b.days - a.days);

                allAssigns.forEach(a => {
                    rowsData.push([
                        a.reg,
                        a.prog,
                        a.loc,
                        a.cat,
                        a.days,
                        a.range
                    ]);
                });
                break;
        }

        if (rowsData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${headers.length}" class="empty-table">No records found matching current report criteria.</td></tr>`;
            return;
        }

        rowsData.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = row.map(val => `<td>${val}</td>`).join("");
            tbody.appendChild(tr);
        });

        // Save active report content globally for CSV Exporter
        this.activeReportData = {
            headers,
            rows: rowsData,
            filename: `${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`
        };
    }

    exportCSV() {
        if (!this.activeReportData || !this.activeReportData.rows.length) {
            alert("No report data available to export.");
            return;
        }

        const data = this.activeReportData;
        
        // Escape cells and build CSV string
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add header
        csvContent += data.headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(",") + "\n";
        
        // Add rows
        data.rows.forEach(row => {
            csvContent += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",") + "\n";
        });

        // Trigger browser download anchor
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", data.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    renderSettings() {
        if (state.currentUser.role !== "Super Admin") return;

        // Render current lists to settings editor
        const motorTypesTxt = document.getElementById("set-motor-types");
        if (motorTypesTxt) motorTypesTxt.value = state.dropdowns.motorTypes.join("\n");

        const pendingTxt = document.getElementById("set-pending-reasons");
        if (pendingTxt) pendingTxt.value = state.dropdowns.pendingReasons.join("\n");

        const overdueTxt = document.getElementById("set-overdue-reasons");
        if (overdueTxt) overdueTxt.value = state.dropdowns.overdueReasons.join("\n");

        const stationsTxt = document.getElementById("set-service-stations");
        if (stationsTxt) stationsTxt.value = state.dropdowns.serviceStations.join("\n");

        const locationsTxt = document.getElementById("set-locations");
        if (locationsTxt) {
            locationsTxt.value = state.dropdowns.locations.map(l => `${l.name} | ${l.category}`).join("\n");
        }
    }

    saveSettings() {
        if (state.currentUser.role !== "Super Admin") {
            alert("Access Denied.");
            return;
        }

        try {
            // Read and parse text areas
            const motorTypes = document.getElementById("set-motor-types").value.split("\n").map(s => s.trim()).filter(s => s);
            const pendingReasons = document.getElementById("set-pending-reasons").value.split("\n").map(s => s.trim()).filter(s => s);
            const overdueReasons = document.getElementById("set-overdue-reasons").value.split("\n").map(s => s.trim()).filter(s => s);
            const serviceStations = document.getElementById("set-service-stations").value.split("\n").map(s => s.trim()).filter(s => s);
            
            const locationsRaw = document.getElementById("set-locations").value.split("\n").map(s => s.trim()).filter(s => s);
            const locations = locationsRaw.map(line => {
                const parts = line.split("|");
                const name = parts[0]?.trim() || "";
                const category = parts[1]?.trim() || "Field";
                return { name, category };
            }).filter(l => l.name);

            state.dropdowns = {
                motorTypes,
                serviceStatuses: ["Serviced", "Pending", "Overdue"],
                pendingReasons,
                overdueReasons,
                serviceStations,
                locations,
                locationCategories: ["Field", "On station", "Off station"]
            };

            state.saveToStorage();
            alert("Dropdown settings saved successfully!");
            this.render();
        } catch (err) {
            alert("Error parsing settings: " + err.message);
        }
    }

    // Modal to add new motor directly
    openAddMotorModal() {
        // Build modal inputs dynamically
        const modal = document.createElement("div");
        modal.id = "add-motor-modal";
        modal.className = "modal-overlay";
        
        let progOptions = state.programmes.map(p => {
            const selected = p.id === state.selectedProgrammeId ? "selected" : "";
            return `<option value="${p.id}" ${selected}>${p.name}</option>`;
        }).join("");

        // If Programme Admin, restrict selector to own programme
        if (state.currentUser.role === "Programme Admin") {
            progOptions = `<option value="${state.currentUser.programmeId}">${state.getProgrammeName(state.currentUser.programmeId)}</option>`;
        }

        const typeOptions = state.dropdowns.motorTypes.map(t => `<option value="${t}">${t}</option>`).join("");
        
        // Filter persons for selected programme
        const defaultProg = state.currentUser.role === "Programme Admin" ? state.currentUser.programmeId : state.selectedProgrammeId;
        const personOptions = state.persons.filter(p => p.programme_id === defaultProg).map(p => `<option value="${p.id}">${p.name}</option>`).join("");

        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h2>Register New Motor</h2>
                    <button class="close-modal-btn" onclick="app.closeAddMotorModal()">&times;</button>
                </div>
                <form id="new-motor-form" onsubmit="event.preventDefault(); app.submitNewMotorForm()">
                    <div class="form-group">
                        <label for="new-prog">Programme</label>
                        <select id="new-prog" required onchange="app.onModalProgrammeChange(this.value)">
                            ${progOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="new-type">Motor Type</label>
                        <select id="new-type" required>
                            ${typeOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="new-reg">Registration Number</label>
                        <input type="text" id="new-reg" placeholder="e.g. UG-707-XYZ" required />
                    </div>
                    <div class="form-group">
                        <label for="new-custodian">Responsible custodian</label>
                        <select id="new-custodian" required>
                            ${personOptions}
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="app.closeAddMotorModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Motor</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    onModalProgrammeChange(progId) {
        const custodianSelect = document.getElementById("new-custodian");
        if (custodianSelect) {
            custodianSelect.innerHTML = "";
            const filtered = state.persons.filter(p => p.programme_id === progId);
            filtered.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.id;
                opt.textContent = p.name;
                custodianSelect.appendChild(opt);
            });
        }
    }

    closeAddMotorModal() {
        const modal = document.getElementById("add-motor-modal");
        if (modal) {
            modal.parentNode.removeChild(modal);
        }
    }

    submitNewMotorForm() {
        const progId = document.getElementById("new-prog").value;
        const type = document.getElementById("new-type").value;
        const reg = document.getElementById("new-reg").value.trim().toUpperCase();
        const custodian = document.getElementById("new-custodian").value;

        if (!reg) return;

        // Check if registration already exists
        const exists = state.motors.some(m => m.registration_number === reg);
        if (exists) {
            alert(`Error: A motor with registration ${reg} is already registered.`);
            return;
        }

        const motorId = state.addMotor(progId, type, reg, custodian);
        
        // Seed default initial location & service for the motor
        const recordDate = new Date().toISOString().split("T")[0];
        
        state.service_records.push({
            id: "sr_init_" + Date.now(),
            motor_id: motorId,
            status: "Serviced",
            reason_pending: "",
            reason_overdue: "",
            odometer_reading: 0,
            next_service_odometer: 5000,
            service_station: "Main Workshop",
            recorded_by: state.currentUser.name,
            created_at: recordDate
        });

        state.location_assignments.push({
            id: "la_init_" + Date.now(),
            motor_id: motorId,
            location_name: "Headquarters",
            category: "On station",
            start_date: recordDate,
            end_date: recordDate,
            period_days: 0
        });

        state.saveToStorage();
        this.closeAddMotorModal();
        this.renderWorkspaceRegister();
        alert("New motor registered successfully!");
    }
}

// Initializer
const app = new AppController();
window.app = app;

// Document Ready Bootstrap
document.addEventListener("DOMContentLoaded", () => {
    app.init();

    // Login Form Handler
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const role = document.getElementById("login-role").value;
            const programmeId = document.getElementById("login-programme").value;
            const nameField = document.getElementById("login-name").value.trim();

            state.currentUser = {
                role,
                programmeId,
                name: nameField || `${role} User`
            };

            // Lock context program selection for Programme Admin
            if (role === "Programme Admin") {
                state.selectedProgrammeId = programmeId;
                app.switchView("workspace", programmeId);
            } else {
                app.switchView("overview");
            }
        });
    }

    // Quick Login selectors for demo ease
    const quickLogins = document.querySelectorAll(".quick-role-btn");
    quickLogins.forEach(btn => {
        btn.addEventListener("click", () => {
            const role = btn.getAttribute("data-role");
            const prog = btn.getAttribute("data-prog");
            const name = btn.getAttribute("data-name");

            state.currentUser = {
                role,
                programmeId: prog,
                name
            };

            if (role === "Programme Admin") {
                state.selectedProgrammeId = prog;
                app.switchView("workspace", prog);
            } else {
                app.switchView("overview");
            }
        });
    });

    // Motor entry submission & real-time validation delegation
    const entryForm = document.getElementById("motor-entry-form");
    if (entryForm) {
        entryForm.addEventListener("input", () => app.validateForm());
        entryForm.addEventListener("change", () => app.validateForm());

        entryForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = {
                motor_id: document.getElementById("form-registration").value,
                responsible_person_id: document.getElementById("form-responsible-person").value,
                service_status: document.getElementById("form-service-status").value,
                reason_pending: document.getElementById("form-pending-reason").value,
                reason_overdue: document.getElementById("form-overdue-reason").value,
                odometer_reading: document.getElementById("form-odometer").value,
                // Automatically set next service odometer to +5000 km of current odometer
                next_service_odometer: Number(document.getElementById("form-odometer").value) + 5000,
                service_station: document.getElementById("form-service-station").value,
                location_name: document.getElementById("form-location").value,
                location_category: document.getElementById("form-location-category").value,
                start_date: document.getElementById("form-start-date").value,
                end_date: document.getElementById("form-end-date").value,
                period_days: document.getElementById("form-period-days").value
            };

            if (!formData.motor_id) {
                alert("Please select a registration number.");
                return;
            }

            state.saveMotorEntry(formData);
            alert("Motor status details recorded successfully!");
            
            // Redirect to Register
            app.switchWorkspaceTab("register");
        });
    }
});
