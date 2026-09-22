/**
 * NaCRRI Fleet Management System - Core JavaScript Module
 * Hardened Security, Accessibility, State Management, and Non-Vibe UI Controller
 */

// --- UTILITY & SECURITY HELPERS ---

/**
 * Sanitizes input text against XSS attacks
 */
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Anti-CSRF Token Generator & Storage
 */
function getCSRFToken() {
    let token = sessionStorage.getItem('nacrri_csrf_token');
    if (!token) {
        token = 'csrf_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('nacrri_csrf_token', token);
    }
    return token;
}

// --- DATA STRUCTURES & DEFAULT DATA ---
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

function getMotorIconHTML(motorType) {
    let iconSrc = "icons/icon_vehicle.png";
    const type = (motorType || "").toLowerCase();
    if (type.includes("motorcycle")) iconSrc = "icons/icon_motorcycle.png";
    else if (type.includes("tractor") || type.includes("mowing")) iconSrc = "icons/icon_tractor.png";
    else if (type.includes("van")) iconSrc = "icons/icon_van.png";
    else if (type.includes("bus")) iconSrc = "icons/icon_bus.png";
    
    return `<img src="${iconSrc}" class="motor-type-img-icon" alt="${escapeHTML(motorType)}">`;
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
    { id: "p3", name: "Gerald", programme_id: "legumes" },
    { id: "p_l2", name: "Phillip", programme_id: "legumes" },
    { id: "p_l3", name: "Ssozi", programme_id: "legumes" },
    { id: "p_l4", name: "Ssekandi", programme_id: "legumes" },
    { id: "p_l5", name: "Dr. Ugen", programme_id: "legumes" },
    { id: "p_l6", name: "Mugagga", programme_id: "legumes" },
    { id: "p4", name: "Amina N.", programme_id: "root_crops" },
    { id: "p5", name: "David L.", programme_id: "cereals" },
    { id: "p6", name: "Grace T.", programme_id: "workshop" },
    { id: "p7", name: "Robert B.", programme_id: "admin" },
    { id: "p8", name: "Alice W.", programme_id: "cereals" }
];

const DEFAULT_MOTORS = [
    // Administration
    { id: "m1", programme_id: "admin", motor_type: "Vehicle", registration_number: "UG-101-ABC", responsible_person_id: "p1", make_of_motor: "Toyota Land Cruiser", remarks: "Maintained in excellent working condition" },
    { id: "m2", programme_id: "admin", motor_type: "Motorcycle", registration_number: "MC-011", responsible_person_id: "p7", make_of_motor: "Yamaha DT 125", remarks: "Due for tire change soon" },
    { id: "m3", programme_id: "admin", motor_type: "Tractor", registration_number: "TR-001", responsible_person_id: "p1", make_of_motor: "Massey Ferguson 375", remarks: "Operates daily on station" },
    // Horticulture and Oil palm
    { id: "m4", programme_id: "horticulture", motor_type: "Vehicle", registration_number: "UG-202-DEF", responsible_person_id: "p2", make_of_motor: "Toyota Hilux D/Cab", remarks: "Slight scratch on passenger side" },
    { id: "m5", programme_id: "horticulture", motor_type: "Motorcycle", registration_number: "MC-012", responsible_person_id: "p2", make_of_motor: "Honda CG125", remarks: "Maintained by horticulture team" },
    // Legumes
    { id: "m6", programme_id: "legumes", motor_type: "Vehicle", registration_number: "UBJ 186V", responsible_person_id: "p3", make_of_motor: "FORD RANGER DBL XLS 2.2D (PICK UP DOUBLE CABIN)", remarks: "Very good" },
    { id: "m7", programme_id: "legumes", motor_type: "Vehicle", registration_number: "UAY 107Z", responsible_person_id: "p_l2", make_of_motor: "TOYOTA HILUX DOUBLE CABIN KUN26R-PRMSYN", remarks: "Good" },
    { id: "m_l3", programme_id: "legumes", motor_type: "Vehicle", registration_number: "UAR 626Y", responsible_person_id: "p_l3", make_of_motor: "TOYOTA HILUX DOUBLE CABIN KUN25R-PRMDHN", remarks: "Good" },
    { id: "m_l4", programme_id: "legumes", motor_type: "Vehicle", registration_number: "UAJ 946X", responsible_person_id: "p_l4", make_of_motor: "TOYOTA HILUX KUN25R-PRMDHN(DOUBLE CABIN PICK UP)", remarks: "Good" },
    { id: "m_l7", programme_id: "legumes", motor_type: "Vehicle", registration_number: "UAA 708N", responsible_person_id: "p_l5", make_of_motor: "TOYOTA RAV4 ACA21R(STATION WAGON)", remarks: "Good" },
    { id: "m_l8", programme_id: "legumes", motor_type: "Vehicle", registration_number: "UAT 561X", responsible_person_id: "p_l6", make_of_motor: "TOYOTA LAND CRUISER (STATION WAGON)", remarks: "Good" },
    { id: "m_l9", programme_id: "legumes", motor_type: "Vehicle", registration_number: "UAB 857Z", responsible_person_id: "", make_of_motor: "TOYOTA DOUBLE CABIN PICKUP", remarks: "Fair" },
    { id: "m_l10", programme_id: "legumes", motor_type: "Motorcycle", registration_number: "UEC 177Y", responsible_person_id: "p3", make_of_motor: "Motorcycle", remarks: "Standard state" },
    { id: "m_l11", programme_id: "legumes", motor_type: "Motorcycle", registration_number: "MC-LEG-PEND", responsible_person_id: "p_l2", make_of_motor: "Motorcycle", remarks: "Under inspection" },
    // Root crops
    { id: "m8", programme_id: "root_crops", motor_type: "Vehicle", registration_number: "UG-404-JKL", responsible_person_id: "p4", make_of_motor: "Mitsubishi L200", remarks: "Under administrative custody" },
    { id: "m9", programme_id: "root_crops", motor_type: "Motorcycle", registration_number: "MC-013", responsible_person_id: "p4", make_of_motor: "Yamaha Crux", remarks: "Good operational state" },
    // Cereals
    { id: "m10", programme_id: "cereals", motor_type: "Vehicle", registration_number: "UG-505-MNO", responsible_person_id: "p5", make_of_motor: "Nissan Patrol", remarks: "Assigned to head of cereals programme" },
    { id: "m11", programme_id: "cereals", motor_type: "Motorcycle", registration_number: "MC-014", responsible_person_id: "p8", make_of_motor: "Bajaj Boxer 150", remarks: "Used for field data collection" },
    { id: "m12", programme_id: "cereals", motor_type: "Tractor", registration_number: "TR-003", responsible_person_id: "p5", make_of_motor: "Massey Ferguson 290", remarks: "Used for cereal planting fields" },
    // Workshop
    { id: "m13", programme_id: "workshop", motor_type: "Vehicle", registration_number: "UG-606-PQR", responsible_person_id: "p6", make_of_motor: "Toyota Land Cruiser Pick-up", remarks: "Workshop utility vehicle" },
    { id: "m14", programme_id: "workshop", motor_type: "Tractor", registration_number: "TR-004", responsible_person_id: "p6", make_of_motor: "New Holland TD5", remarks: "Workshop deployment tractor" }
];

const DEFAULT_SERVICE_RECORDS = [
    { id: "sr1", motor_id: "m1", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 120500, next_service_odometer: 125500, service_station: "Main Workshop", recorded_by: "Sarah K.", created_at: "2026-08-01" },
    { id: "sr2", motor_id: "m2", status: "Pending", reason_pending: "Spare parts not available", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "John M.", created_at: "2026-08-05" },
    { id: "sr3", motor_id: "m3", status: "Overdue", reason_pending: "", reason_overdue: "Missed service date", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "John M.", created_at: "2026-07-28" },
    { id: "sr4", motor_id: "m4", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 89300, next_service_odometer: 94300, service_station: "Regional Workshop", recorded_by: "Sarah K.", created_at: "2026-08-02" },
    { id: "sr5", motor_id: "m5", status: "Pending", reason_pending: "Workshop slot not available", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "Sarah K.", created_at: "2026-08-06" },
    { id: "sr6", motor_id: "m6", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 15000, next_service_odometer: 20000, service_station: "Main Workshop", recorded_by: "Gerald", created_at: "2026-08-01" },
    { id: "sr7", motor_id: "m7", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 24000, next_service_odometer: 29000, service_station: "Main Workshop", recorded_by: "Phillip", created_at: "2026-08-02" },
    { id: "sr_l3", motor_id: "m_l3", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 48000, next_service_odometer: 53000, service_station: "Main Workshop", recorded_by: "Ssozi", created_at: "2026-08-03" },
    { id: "sr_l4", motor_id: "m_l4", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 32000, next_service_odometer: 37000, service_station: "Main Workshop", recorded_by: "Ssekandi", created_at: "2026-08-03" },
    { id: "sr_l7", motor_id: "m_l7", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 96000, next_service_odometer: 101000, service_station: "Main Workshop", recorded_by: "Dr. Ugen", created_at: "2026-08-04" },
    { id: "sr_l8", motor_id: "m_l8", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 128000, next_service_odometer: 133000, service_station: "Main Workshop", recorded_by: "Mugagga", created_at: "2026-08-05" },
    { id: "sr_l9", motor_id: "m_l9", status: "Pending", reason_pending: "Awaiting inspection", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "Gerald", created_at: "2026-08-05" },
    { id: "sr_l10", motor_id: "m_l10", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 5000, next_service_odometer: 10000, service_station: "Main Workshop", recorded_by: "Gerald", created_at: "2026-08-06" },
    { id: "sr_l11", motor_id: "m_l11", status: "Pending", reason_pending: "Spare parts not available", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "Phillip", created_at: "2026-08-06" },
    { id: "sr8", motor_id: "m8", status: "Pending", reason_pending: "Awaiting approval", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "Amina N.", created_at: "2026-08-07" },
    { id: "sr9", motor_id: "m9", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 15400, next_service_odometer: 17400, service_station: "On-site Mechanic", recorded_by: "Amina N.", created_at: "2026-08-04" },
    { id: "sr10", motor_id: "m10", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 201100, next_service_odometer: 206100, service_station: "Main Workshop", recorded_by: "David L.", created_at: "2026-08-02" },
    { id: "sr11", motor_id: "m11", status: "Overdue", reason_pending: "", reason_overdue: "Workshop delay", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "David L.", created_at: "2026-07-15" },
    { id: "sr12", motor_id: "m12", status: "Pending", reason_pending: "Scheduled for later date", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "David L.", created_at: "2026-08-08" },
    { id: "sr13", motor_id: "m13", status: "Serviced", reason_pending: "", reason_overdue: "", odometer_reading: 310500, next_service_odometer: 315500, service_station: "Main Workshop", recorded_by: "Grace T.", created_at: "2026-08-01" },
    { id: "sr14", motor_id: "m14", status: "Overdue", reason_pending: "", reason_overdue: "Pending approval", odometer_reading: "", next_service_odometer: "", service_station: "", recorded_by: "Grace T.", created_at: "2026-07-22" }
];

const DEFAULT_LOCATION_ASSIGNMENTS = [
    { id: "la1", motor_id: "m1", location_name: "Headquarters", category: "On station", start_date: "2026-08-01", end_date: "2026-08-15", period_days: 14 },
    { id: "la2", motor_id: "m2", location_name: "Research Station", category: "On station", start_date: "2026-08-05", end_date: "2026-08-08", period_days: 3 },
    { id: "la3", motor_id: "m3", location_name: "Field Site A", category: "Field", start_date: "2026-07-28", end_date: "2026-08-12", period_days: 15 },
    { id: "la4", motor_id: "m4", location_name: "Field Site B", category: "Field", start_date: "2026-08-02", end_date: "2026-08-10", period_days: 8 },
    { id: "la5", motor_id: "m5", location_name: "Partner Station", category: "Off station", start_date: "2026-08-06", end_date: "2026-08-12", period_days: 6 },
    { id: "la6", motor_id: "m6", location_name: "Headquarters", category: "On station", start_date: "2026-08-01", end_date: "2026-08-15", period_days: 14 },
    { id: "la7", motor_id: "m7", location_name: "Research Station", category: "On station", start_date: "2026-08-03", end_date: "2026-08-20", period_days: 17 },
    { id: "la_l3", motor_id: "m_l3", location_name: "Field Site A", category: "Field", start_date: "2026-08-01", end_date: "2026-08-15", period_days: 14 },
    { id: "la_l4", motor_id: "m_l4", location_name: "Field Site B", category: "Field", start_date: "2026-08-02", end_date: "2026-08-10", period_days: 8 },
    { id: "la_l7", motor_id: "m_l7", location_name: "Research Station", category: "On station", start_date: "2026-08-03", end_date: "2026-08-20", period_days: 17 },
    { id: "la_l8", motor_id: "m_l8", location_name: "Partner Station", category: "Off station", start_date: "2026-08-04", end_date: "2026-08-14", period_days: 10 },
    { id: "la_l9", motor_id: "m_l9", location_name: "Headquarters", category: "On station", start_date: "2026-08-05", end_date: "2026-08-15", period_days: 10 },
    { id: "la_l10", motor_id: "m_l10", location_name: "Research Station", category: "On station", start_date: "2026-08-05", end_date: "2026-08-15", period_days: 10 },
    { id: "la_l11", motor_id: "m_l11", location_name: "Headquarters", category: "On station", start_date: "2026-08-06", end_date: "2026-08-16", period_days: 10 },
    { id: "la8", motor_id: "m8", location_name: "Off-site Location", category: "Off station", start_date: "2026-08-07", end_date: "2026-08-15", period_days: 8 },
    { id: "la9", motor_id: "m9", location_name: "Field Site B", category: "Field", start_date: "2026-08-04", end_date: "2026-08-14", period_days: 10 },
    { id: "la10", motor_id: "m10", location_name: "Headquarters", category: "On station", start_date: "2026-08-02", end_date: "2026-08-09", period_days: 7 },
    { id: "la11", motor_id: "m11", location_name: "Field Site A", category: "Field", start_date: "2026-07-15", end_date: "2026-08-15", period_days: 31 },
    { id: "la12", motor_id: "m12", location_name: "Research Station", category: "On station", start_date: "2026-08-08", end_date: "2026-08-28", period_days: 20 },
    { id: "la13", motor_id: "m13", location_name: "Headquarters", category: "On station", start_date: "2026-08-01", end_date: "2026-08-15", period_days: 14 },
    { id: "la14", motor_id: "m14", location_name: "Partner Station", category: "Off station", start_date: "2026-07-22", end_date: "2026-08-05", period_days: 14 }
];

// --- STATE STORE ---
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

            this.currentUser = {
                role: "Super Admin",
                programmeId: "admin",
                name: "PHRAO Officer"
            };
            this.activeView = "login";
            this.activeWorkspaceTab = "dashboard";
            this.selectedProgrammeId = "admin";
            this.viewingMotorId = null;
            this.editingMotorId = null;
        } catch (e) {
            console.error("Failed to parse storage, restoring defaults:", e);
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

    getProgrammeName(id) {
        const prog = this.programmes.find(p => p.id === id);
        return prog ? prog.name : id;
    }

    getPersonName(id) {
        const person = this.persons.find(p => p.id === id);
        return person ? person.name : "Unassigned Custodian";
    }

    getMotorLatestStatus(motorId) {
        const records = this.service_records.filter(r => r.motor_id === motorId);
        if (records.length === 0) return { status: "Pending", reason_pending: "Awaiting inspection", reason_overdue: "", odometer_reading: "", next_service_odometer: "", service_station: "", created_at: "" };
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
            const latestService = this.getMotorLatestStatus(m.id);
            if (latestService.status === "Serviced") stats.serviced++;
            else if (latestService.status === "Pending") stats.pending++;
            else if (latestService.status === "Overdue") stats.overdue++;

            const type = (m.motor_type || "").toLowerCase();
            if (type.includes("vehicle") || type.includes("van") || type.includes("bus")) stats.vehicles++;
            else if (type.includes("motorcycle")) stats.motorcycles++;
            else if (type.includes("tractor")) stats.tractors++;

            const latestLoc = this.getMotorLatestLocation(m.id);
            if (latestLoc.category === "Field") stats.field++;
            else if (latestLoc.category === "On station") stats.onStation++;
            else if (latestLoc.category === "Off station") stats.offStation++;
        });

        return stats;
    }

    addMotor(programmeId, motorType, registrationNumber, responsiblePersonId, makeOfMotor = "", remarks = "") {
        const id = "m_" + Date.now();
        const newMotor = {
            id,
            programme_id: programmeId,
            motor_type: motorType,
            registration_number: registrationNumber,
            responsible_person_id: responsiblePersonId,
            make_of_motor: makeOfMotor,
            remarks: remarks
        };
        this.motors.push(newMotor);
        this.saveToStorage();
        return id;
    }

    deleteMotor(motorId) {
        this.motors = this.motors.filter(m => m.id !== motorId);
        this.service_records = this.service_records.filter(r => r.motor_id !== motorId);
        this.location_assignments = this.location_assignments.filter(a => a.motor_id !== motorId);
        this.saveToStorage();
    }

    saveMotorEntry(formData) {
        const motorId = formData.motor_id;
        const recordedBy = this.currentUser.name;
        const entryDate = new Date().toISOString().split("T")[0];

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

        const motor = this.motors.find(m => m.id === motorId);
        if (motor && formData.responsible_person_id) {
            motor.responsible_person_id = formData.responsible_person_id;
        }

        this.saveToStorage();
    }
}

const state = new StateStore();

// --- CONTROLLER / VIEW RENDER ENGINE ---
class AppController {
    constructor() {
        this.historyStack = [];
        this.confirmCallback = null;
        this.failedAttempts = 0;
        this.lockoutUntil = 0;
        this.setupEventListeners();
        this.initTheme();
    }

    init() {
        this.setupCSRFTokens();
        this.updateCopyrightYear();
        this.render();
    }

    setupCSRFTokens() {
        const csrfToken = getCSRFToken();
        const inputs = document.querySelectorAll('input[name="csrf_token"]');
        inputs.forEach(i => i.value = csrfToken);
    }

    updateCopyrightYear() {
        const yearEl = document.getElementById("copyright-year");
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    initTheme() {
        const savedTheme = localStorage.getItem("nacrri_theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);
        this.updateThemeButtonLabel(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("nacrri_theme", newTheme);
        this.updateThemeButtonLabel(newTheme);
        this.showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    }

    updateThemeButtonLabel(theme) {
        const label = document.getElementById("theme-toggle-label");
        if (label) {
            label.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
        }
    }

    setupEventListeners() {
        // Keyboard Esc handler
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeDetailsDrawer();
                this.closeMotorModal();
                this.closeConfirmationModal();
            }
        });

        // Scroll listener for progress bar & scroll-to-top button
        window.addEventListener("scroll", () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const progressBar = document.getElementById("scroll-progress-bar");
            if (progressBar) progressBar.style.width = scrolled + "%";

            const topBtn = document.getElementById("scroll-to-top-btn");
            if (topBtn) {
                if (winScroll > 200) topBtn.classList.remove("hidden");
                else topBtn.classList.add("hidden");
            }
        });

        // Close global search dropdown on outside click
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".header-search-container")) {
                this.clearGlobalSearch();
            }
        });
    }

    handleRoleChange(role) {
        const progGroup = document.getElementById("group-login-prog");
        const pinGroup = document.getElementById("group-login-pin");
        const pinInput = document.getElementById("login-pin");

        if (progGroup) {
            progGroup.style.display = role === "Programme Admin" ? "block" : "none";
        }

        if (pinInput) {
            if (role === "Super Admin") pinInput.value = "phrao2026";
            else if (role === "Programme Admin") pinInput.value = "prog2026";
            else pinInput.value = "view2026";
        }
    }

    togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const btn = event.target;
        if (input) {
            if (input.type === "password") {
                input.type = "text";
                if (btn) btn.textContent = "Hide";
            } else {
                input.type = "password";
                if (btn) btn.textContent = "Show";
            }
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3500);
    }

    copyToClipboard(text, label = "Item") {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast(`${label} copied to clipboard!`, 'success');
            }).catch(() => {
                this.fallbackCopyToClipboard(text, label);
            });
        } else {
            this.fallbackCopyToClipboard(text, label);
        }
    }

    fallbackCopyToClipboard(text, label) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.showToast(`${label} copied to clipboard!`, 'success');
        } catch (err) {
            this.showToast(`Failed to copy ${label}`, 'error');
        }
        document.body.removeChild(textArea);
    }

    navigateTo(view) {
        if (state.currentUser && state.currentUser.role === "Programme Admin" && (view === "overview" || view === "settings")) {
            this.showToast("Programme Admins are scoped exclusively to their assigned workspace.", "warning");
            return;
        }
        this.switchView(view);
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
        
        if (state.currentUser && state.currentUser.role === "Programme Admin") {
            state.selectedProgrammeId = state.currentUser.programmeId;
            if (view === "overview") {
                state.activeView = "workspace";
            }
        }

        this.closeDetailsDrawer();
        this.render();
    }

    openProgrammeWorkspace(programmeId) {
        this.switchView("workspace", programmeId);
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
        } else {
            if (state.activeView === "workspace") {
                if (state.currentUser && state.currentUser.role === "Programme Admin") {
                    state.activeWorkspaceTab = "dashboard";
                } else {
                    state.activeView = "overview";
                }
            } else if (state.activeView === "reports" || state.activeView === "settings" || state.activeView === "privacy" || state.activeView === "terms" || state.activeView === "faq") {
                state.activeView = (state.currentUser && state.currentUser.role === "Programme Admin") ? "workspace" : "overview";
            }
            this.render();
        }
    }

    confirmLogout() {
        this.showConfirmationModal(
            "Confirm System Exit",
            "Are you sure you want to end your active session and exit the portal?",
            () => this.logout()
        );
    }

    logout() {
        state.currentUser = null;
        state.activeView = "login";
        this.showToast("Logged out successfully.", "info");
        this.render();
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

    renderDetailsDrawer() {
        const content = document.getElementById("drawer-content");
        if (!content || !state.viewingMotorId) return;

        const motor = state.motors.find(m => m.id === state.viewingMotorId);
        if (!motor) return;

        const latestService = state.getMotorLatestStatus(motor.id);
        const latestLocation = state.getMotorLatestLocation(motor.id);
        const custodianName = state.getPersonName(motor.responsible_person_id);
        const progName = state.getProgrammeName(motor.programme_id);

        const allServices = state.service_records.filter(r => r.motor_id === motor.id);
        const allLocations = state.location_assignments.filter(l => l.motor_id === motor.id);

        content.innerHTML = `
            <div class="drawer-header">
                <span class="drawer-type">${escapeHTML(motor.motor_type)}</span>
                <h2>${escapeHTML(motor.registration_number)}</h2>
                <p>${escapeHTML(motor.make_of_motor)} &bull; ${escapeHTML(progName)}</p>
                <div style="margin-top: 10px;">
                    <button class="btn btn-secondary btn-sm" onclick="app.copyToClipboard('${escapeHTML(motor.registration_number)}', 'Registration Number')">Copy Registration</button>
                </div>
            </div>

            <div class="drawer-section-title">Current Operations Overview</div>
            <div class="drawer-info-grid">
                <div class="info-cell">
                    <span class="cell-lbl">Current Custodian</span>
                    <span class="cell-val">${escapeHTML(custodianName)}</span>
                </div>
                <div class="info-cell">
                    <span class="cell-lbl">Service Status</span>
                    <span class="cell-val"><span class="status-badge ${latestService.status.toLowerCase()}">${escapeHTML(latestService.status)}</span></span>
                </div>
                <div class="info-cell">
                    <span class="cell-lbl">Assigned Location</span>
                    <span class="cell-val">${escapeHTML(latestLocation.location_name)}</span>
                </div>
                <div class="info-cell">
                    <span class="cell-lbl">Location Category</span>
                    <span class="cell-val"><span class="category-badge ${latestLocation.category.toLowerCase().replace(' ', '')}">${escapeHTML(latestLocation.category)}</span></span>
                </div>
                <div class="info-cell">
                    <span class="cell-lbl">Period of Stay</span>
                    <span class="cell-val">${escapeHTML(latestLocation.period_days)} Days</span>
                </div>
                <div class="info-cell">
                    <span class="cell-lbl">Odometer Reading</span>
                    <span class="cell-val">${latestService.odometer_reading ? escapeHTML(latestService.odometer_reading) + ' km' : 'N/A'}</span>
                </div>
            </div>

            <div class="drawer-section-title">Remarks & Asset Notes</div>
            <p style="font-size: 0.88rem; color: var(--text-dark); margin-bottom: 20px;">${escapeHTML(motor.remarks || "No additional remarks logged.")}</p>

            <div class="drawer-section-title">Service Maintenance History</div>
            <div class="timeline-list">
                ${allServices.length === 0 ? '<p style="font-size: 0.8rem; color: var(--text-muted)">No service logs recorded.</p>' : ''}
                ${allServices.map(s => `
                    <div class="timeline-entry">
                        <div class="timeline-date">${escapeHTML(s.created_at)} by ${escapeHTML(s.recorded_by)}</div>
                        <div class="timeline-content">
                            <strong>Status:</strong> ${escapeHTML(s.status)}
                            ${s.reason_pending ? `<br><em>Pending Reason:</em> ${escapeHTML(s.reason_pending)}` : ''}
                            ${s.reason_overdue ? `<br><em>Overdue Reason:</em> ${escapeHTML(s.reason_overdue)}` : ''}
                            ${s.service_station ? `<br><em>Station:</em> ${escapeHTML(s.service_station)} (${escapeHTML(s.odometer_reading)} km)` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="drawer-section-title">Location Deployment History</div>
            <div class="timeline-list">
                ${allLocations.length === 0 ? '<p style="font-size: 0.8rem; color: var(--text-muted)">No location assignments recorded.</p>' : ''}
                ${allLocations.map(l => `
                    <div class="timeline-entry">
                        <div class="timeline-date">${escapeHTML(l.start_date || 'N/A')} to ${escapeHTML(l.end_date || 'N/A')} (${escapeHTML(l.period_days)} days)</div>
                        <div class="timeline-content">
                            <strong>Location:</strong> ${escapeHTML(l.location_name)} (${escapeHTML(l.category)})
                        </div>
                    </div>
                `).join('')}
            </div>

            ${state.currentUser.role === "Super Admin" ? `
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-light)">
                    <button class="btn btn-secondary btn-block" style="color: var(--status-overdue-bg); border-color: var(--status-overdue-bg)" onclick="app.confirmDeleteMotor('${escapeHTML(motor.id)}')">Delete Motor Record</button>
                </div>
            ` : ''}
        `;
    }

    confirmDeleteMotor(motorId) {
        const motor = state.motors.find(m => m.id === motorId);
        if (!motor) return;

        this.showConfirmationModal(
            "Delete Motor Record",
            `Are you sure you want to delete registration ${motor.registration_number}? This operation cannot be undone.`,
            () => {
                state.deleteMotor(motorId);
                this.closeDetailsDrawer();
                this.renderWorkspaceRegister();
                this.showToast(`Motor ${motor.registration_number} deleted.`, 'success');
            }
        );
    }

    openAddMotorModal() {
        if (state.currentUser.role === "Management Viewer") {
            this.showToast("Access Denied: Management Viewer role is read-only.", "warning");
            return;
        }

        const modal = document.getElementById("motor-modal");
        const progSelect = document.getElementById("modal-programme");

        if (progSelect) {
            progSelect.innerHTML = "";
            state.programmes.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.id;
                opt.textContent = p.name;
                if (p.id === state.selectedProgrammeId) opt.selected = true;
                progSelect.appendChild(opt);
            });

            if (state.currentUser.role === "Programme Admin") {
                progSelect.value = state.currentUser.programmeId;
                progSelect.disabled = true;
            } else {
                progSelect.disabled = false;
            }
        }

        if (modal) modal.classList.remove("hidden");
    }

    closeMotorModal() {
        const modal = document.getElementById("motor-modal");
        if (modal) modal.classList.add("hidden");
    }

    handleSaveNewMotor(e) {
        e.preventDefault();
        const progId = document.getElementById("modal-programme").value;
        const motorType = document.getElementById("modal-motor-type").value;
        const regNum = document.getElementById("modal-registration").value.trim().toUpperCase();
        const make = document.getElementById("modal-make").value.trim();
        const custodianName = document.getElementById("modal-custodian").value.trim();
        const remarks = document.getElementById("modal-remarks").value.trim();

        if (!regNum || !make || !custodianName) {
            this.showToast("Please complete all required motor fields.", "error");
            return;
        }

        const exists = state.motors.some(m => m.registration_number === regNum);
        if (exists) {
            this.showToast(`Motor registration ${regNum} already exists in the system.`, "error");
            return;
        }

        // Add or find person
        let person = state.persons.find(p => p.name.toLowerCase() === custodianName.toLowerCase());
        if (!person) {
            person = { id: "p_" + Date.now(), name: custodianName, programme_id: progId };
            state.persons.push(person);
        }

        const motorId = state.addMotor(progId, motorType, regNum, person.id, make, remarks);
        
        // Initial service and location entry
        const today = new Date().toISOString().split("T")[0];
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
            created_at: today
        });

        state.location_assignments.push({
            id: "la_init_" + Date.now(),
            motor_id: motorId,
            location_name: "Headquarters",
            category: "On station",
            start_date: today,
            end_date: today,
            period_days: 0
        });

        state.saveToStorage();
        this.closeMotorModal();
        this.renderWorkspaceRegister();
        this.showToast(`Registered motor ${regNum} successfully.`, "success");
    }

    confirmResetDatabase() {
        if (state.currentUser.role !== "Super Admin") {
            this.showToast("Access Denied: Only Super Admin can reset database.", "warning");
            return;
        }

        this.showConfirmationModal(
            "Reset System Database",
            "Are you sure you want to clear custom motor entries and reset all registers to default institutional seed data?",
            () => {
                state.resetToDefaults();
                this.showToast("Database reset to institutional default values.", "info");
            }
        );
    }

    showConfirmationModal(title, message, callback) {
        const modal = document.getElementById("confirmation-modal");
        const titleEl = document.getElementById("confirm-modal-title");
        const bodyEl = document.getElementById("confirm-modal-body");
        const confirmBtn = document.getElementById("btn-confirm-action");

        if (titleEl) titleEl.textContent = title;
        if (bodyEl) bodyEl.textContent = message;

        this.confirmCallback = callback;

        if (confirmBtn) {
            confirmBtn.onclick = () => {
                if (this.confirmCallback) this.confirmCallback();
                this.closeConfirmationModal();
            };
        }

        if (modal) modal.classList.remove("hidden");
    }

    closeConfirmationModal() {
        const modal = document.getElementById("confirmation-modal");
        if (modal) modal.classList.add("hidden");
        this.confirmCallback = null;
    }

    handleGlobalSearch(query) {
        const dropdown = document.getElementById("global-search-results");
        const clearBtn = document.getElementById("search-clear-btn");
        if (!dropdown) return;

        const q = (query || "").trim().toLowerCase();
        if (q.length < 2) {
            dropdown.classList.add("hidden");
            if (clearBtn) clearBtn.classList.add("hidden");
            return;
        }

        if (clearBtn) clearBtn.classList.remove("hidden");

        const matchingMotors = state.motors.filter(m => 
            m.registration_number.toLowerCase().includes(q) ||
            m.make_of_motor.toLowerCase().includes(q) ||
            state.getPersonName(m.responsible_person_id).toLowerCase().includes(q)
        ).slice(0, 5);

        const matchingLocations = state.dropdowns.locations.filter(l => l.name.toLowerCase().includes(q)).slice(0, 3);

        let html = '';

        if (matchingMotors.length > 0) {
            html += `<div style="padding: 6px 12px; font-weight:700; font-size:0.7rem; color:var(--text-muted); background:var(--bg-light-mint)">MOTOR REGISTRATION MATCHES</div>`;
            matchingMotors.forEach(m => {
                const custodian = state.getPersonName(m.responsible_person_id);
                html += `
                    <div class="search-result-item" onclick="app.selectSearchResultMotor('${escapeHTML(m.id)}', '${escapeHTML(m.programme_id)}')">
                        <div class="search-result-title">${escapeHTML(m.registration_number)} (${escapeHTML(m.motor_type)})</div>
                        <div class="search-result-sub">${escapeHTML(m.make_of_motor)} &bull; Custodian: ${escapeHTML(custodian)}</div>
                    </div>
                `;
            });
        }

        if (matchingLocations.length > 0) {
            html += `<div style="padding: 6px 12px; font-weight:700; font-size:0.7rem; color:var(--text-muted); background:var(--bg-light-mint)">LOCATION MATCHES</div>`;
            matchingLocations.forEach(l => {
                html += `
                    <div class="search-result-item" onclick="app.switchView('reports')">
                        <div class="search-result-title">${escapeHTML(l.name)}</div>
                        <div class="search-result-sub">Category: ${escapeHTML(l.category)}</div>
                    </div>
                `;
            });
        }

        if (!html) {
            html = `<div style="padding: 12px; font-size:0.85rem; color:var(--text-muted); text-align:center;">No matching fleet records found.</div>`;
        }

        dropdown.innerHTML = html;
        dropdown.classList.remove("hidden");
    }

    selectSearchResultMotor(motorId, programmeId) {
        this.clearGlobalSearch();
        this.switchView("workspace", programmeId);
        this.openDetailsDrawer(motorId);
    }

    clearGlobalSearch() {
        const input = document.getElementById("global-site-search");
        const dropdown = document.getElementById("global-search-results");
        const clearBtn = document.getElementById("search-clear-btn");
        if (input) input.value = "";
        if (dropdown) dropdown.classList.add("hidden");
        if (clearBtn) clearBtn.classList.add("hidden");
    }

    toggleMobileSidebar() {
        const sidebar = document.getElementById("app-sidebar");
        if (sidebar) sidebar.classList.toggle("open");
    }

    toggleFAQ(buttonEl) {
        const item = buttonEl.closest(".faq-item");
        if (item) item.classList.toggle("active");
    }

    toggleContactModal() {
        const modal = document.getElementById("contact-modal");
        if (modal) modal.classList.toggle("hidden");
    }

    // --- MAIN RENDER CONTROLLER ---
    render() {
        const loginWrapper = document.getElementById("view-login");
        const mainAppShell = document.getElementById("main-application");

        // Dynamic Document Title
        let pageTitle = "NaCRRI Fleet Management System";
        if (state.activeView === "overview") pageTitle = "NaCRRI Fleet - Programmes Overview";
        else if (state.activeView === "workspace") pageTitle = `NaCRRI Fleet - ${state.getProgrammeName(state.selectedProgrammeId)} Workspace`;
        else if (state.activeView === "reports") pageTitle = "NaCRRI Fleet - Reports & Export";
        else if (state.activeView === "settings") pageTitle = "NaCRRI Fleet - Settings Manager";
        else if (state.activeView === "privacy") pageTitle = "NaCRRI Fleet - Privacy Policy";
        else if (state.activeView === "terms") pageTitle = "NaCRRI Fleet - Terms & Conditions";
        else if (state.activeView === "faq") pageTitle = "NaCRRI Fleet - Operational FAQ";
        document.title = pageTitle;

        if (state.activeView === "login" || !state.currentUser) {
            if (loginWrapper) loginWrapper.classList.remove("hidden");
            if (mainAppShell) mainAppShell.classList.add("hidden");
            return;
        } else {
            if (loginWrapper) loginWrapper.classList.add("hidden");
            if (mainAppShell) mainAppShell.classList.remove("hidden");
        }

        // Update Header user tags
        document.querySelectorAll(".current-user-name").forEach(el => el.textContent = state.currentUser.name);
        document.querySelectorAll(".current-user-role").forEach(el => el.textContent = state.currentUser.role);
        document.querySelectorAll(".current-user-programme").forEach(el => el.textContent = state.getProgrammeName(state.currentUser.programmeId));

        // Highlight Active Sidebar Links
        document.querySelectorAll(".sidebar-nav a").forEach(link => {
            const view = link.getAttribute("data-view");
            if (view === state.activeView) link.classList.add("active");
            else link.classList.remove("active");
        });

        // Hide/Show View Sections
        const views = ["overview", "workspace", "reports", "settings", "faq", "privacy", "terms", "404"];
        views.forEach(v => {
            const container = document.getElementById(`view-${v}`);
            if (container) {
                if (v === state.activeView) container.classList.remove("hidden");
                else container.classList.add("hidden");
            }
        });

        // Role restriction visibility
        const settingsLink = document.querySelector('[data-view="settings"]')?.closest("li");
        if (settingsLink) {
            settingsLink.style.display = state.currentUser.role === "Super Admin" ? "block" : "none";
        }

        const overviewLink = document.querySelector('[data-view="overview"]')?.closest("li");
        if (overviewLink) {
            overviewLink.style.display = state.currentUser.role === "Programme Admin" ? "none" : "block";
        }

        // Render Active View
        if (state.activeView === "overview") this.renderOverview();
        else if (state.activeView === "workspace") this.renderWorkspace();
        else if (state.activeView === "reports") this.renderReports();
        else if (state.activeView === "settings") this.renderSettings();
    }

    renderOverview() {
        const container = document.getElementById("programmes-grid");
        if (!container) return;
        container.innerHTML = "";

        const progIcons = {
            "admin": "icons/icon_programme_admin.png",
            "horticulture": "icons/icon_programme_horticulture.png",
            "legumes": "icons/icon_programme_legumes.png",
            "root_crops": "icons/icon_programme_rootcrops.png",
            "cereals": "icons/icon_programme_cereals.png",
            "workshop": "icons/icon_programme_workshop.png"
        };

        state.programmes.forEach(p => {
            const stats = state.getProgrammeStats(p.id);
            const iconPath = progIcons[p.id] || "icons/icon_programme_admin.png";

            const card = document.createElement("div");
            card.className = "programme-card";
            card.onclick = () => this.openProgrammeWorkspace(p.id);
            card.innerHTML = `
                <div class="prog-card-header">
                    <h3 class="prog-card-title">${escapeHTML(p.name)}</h3>
                    <span class="prog-card-tag">${stats.total} Motors</span>
                </div>
                <div class="prog-metrics-grid">
                    <div class="metric-cell">
                        <div class="metric-val" style="color:var(--status-serviced-bg)">${stats.serviced}</div>
                        <div class="metric-lbl">Serviced</div>
                    </div>
                    <div class="metric-cell">
                        <div class="metric-val" style="color:var(--status-pending-bg)">${stats.pending}</div>
                        <div class="metric-lbl">Pending</div>
                    </div>
                    <div class="metric-cell">
                        <div class="metric-val" style="color:var(--status-overdue-bg)">${stats.overdue}</div>
                        <div class="metric-lbl">Overdue</div>
                    </div>
                    <div class="metric-cell">
                        <div class="metric-val">${stats.field}</div>
                        <div class="metric-lbl">In Field</div>
                    </div>
                </div>
                <div class="prog-card-ratios">
                    <span>Operational Ratios</span>
                    <div class="ratio-bar-bg">
                        <div class="ratio-fill-serviced" style="width: ${(stats.serviced/(stats.total||1))*100}%"></div>
                        <div class="ratio-fill-pending" style="width: ${(stats.pending/(stats.total||1))*100}%"></div>
                        <div class="ratio-fill-overdue" style="width: ${(stats.overdue/(stats.total||1))*100}%"></div>
                    </div>
                </div>
                <div class="prog-card-footer">
                    <span>Open Register Workspace</span>
                    <span>&rarr;</span>
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

        document.querySelectorAll(".workspace-tabs a").forEach(link => {
            const tab = link.getAttribute("data-tab");
            if (tab === state.activeWorkspaceTab) link.classList.add("active");
            else link.classList.remove("active");
        });

        const tabs = ["dashboard", "register", "service", "location", "entry-form"];
        tabs.forEach(t => {
            const section = document.getElementById(`workspace-${t}`);
            if (section) {
                if (t === state.activeWorkspaceTab) section.classList.remove("hidden");
                else section.classList.add("hidden");
            }
        });

        if (state.activeWorkspaceTab === "dashboard") this.renderWorkspaceDashboard();
        else if (state.activeWorkspaceTab === "register") this.renderWorkspaceRegister();
        else if (state.activeWorkspaceTab === "service") this.renderWorkspaceServiceTracker();
        else if (state.activeWorkspaceTab === "location") this.renderWorkspaceLocationTracker();
    }

    renderWorkspaceDashboard() {
        const stats = state.getProgrammeStats(state.selectedProgrammeId);

        document.getElementById("dash-total-motors").textContent = stats.total;
        document.getElementById("dash-serviced-motors").textContent = stats.serviced;
        document.getElementById("dash-pending-motors").textContent = stats.pending;
        document.getElementById("dash-overdue-motors").textContent = stats.overdue;

        const typeContainer = document.getElementById("dash-type-stats");
        if (typeContainer) {
            const total = stats.total || 1;
            typeContainer.innerHTML = `
                <div class="bar-stat-item">
                    <div class="bar-label-flex"><span>Vehicles</span><span>${stats.vehicles}</span></div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${(stats.vehicles/total)*100}%; background: var(--category-field-bg);"></div></div>
                </div>
                <div class="bar-stat-item">
                    <div class="bar-label-flex"><span>Motorcycles</span><span>${stats.motorcycles}</span></div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${(stats.motorcycles/total)*100}%; background: var(--status-pending-bg);"></div></div>
                </div>
                <div class="bar-stat-item">
                    <div class="bar-label-flex"><span>Tractors</span><span>${stats.tractors}</span></div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${(stats.tractors/total)*100}%; background: var(--primary-green);"></div></div>
                </div>
            `;
        }

        const statusContainer = document.getElementById("dash-status-stats");
        if (statusContainer) {
            const total = stats.total || 1;
            statusContainer.innerHTML = `
                <div class="bar-stat-item">
                    <div class="bar-label-flex"><span>Serviced</span><span>${stats.serviced}</span></div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${(stats.serviced/total)*100}%; background: var(--status-serviced-bg);"></div></div>
                </div>
                <div class="bar-stat-item">
                    <div class="bar-label-flex"><span>Pending Service</span><span>${stats.pending}</span></div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${(stats.pending/total)*100}%; background: var(--status-pending-bg);"></div></div>
                </div>
                <div class="bar-stat-item">
                    <div class="bar-label-flex"><span>Overdue Service</span><span>${stats.overdue}</span></div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${(stats.overdue/total)*100}%; background: var(--status-overdue-bg);"></div></div>
                </div>
            `;
        }

        const locContainer = document.getElementById("dash-location-stats");
        if (locContainer) {
            const total = stats.total || 1;
            locContainer.innerHTML = `
                <div class="bar-stat-item">
                    <div class="bar-label-flex"><span>Field Locations</span><span>${stats.field}</span></div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${(stats.field/total)*100}%; background: var(--category-field-bg);"></div></div>
                </div>
                <div class="bar-stat-item">
                    <div class="bar-label-flex"><span>On Station</span><span>${stats.onStation}</span></div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${(stats.onStation/total)*100}%; background: var(--category-onstation-bg);"></div></div>
                </div>
                <div class="bar-stat-item">
                    <div class="bar-label-flex"><span>Off Station</span><span>${stats.offStation}</span></div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${(stats.offStation/total)*100}%; background: var(--category-offstation-bg);"></div></div>
                </div>
            `;
        }

        // Recent Logs
        const logsList = document.getElementById("dash-recent-logs");
        if (logsList) {
            logsList.innerHTML = "";
            const progMotors = state.getMotorsByProgramme(state.selectedProgrammeId);
            const motorIds = progMotors.map(m => m.id);
            const recentServices = state.service_records
                .filter(r => motorIds.includes(r.motor_id))
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5);

            if (recentServices.length === 0) {
                logsList.innerHTML = '<li class="log-item"><span>No recent log entries for this programme.</span></li>';
            } else {
                recentServices.forEach(r => {
                    const motor = state.motors.find(m => m.id === r.motor_id);
                    const reg = motor ? motor.registration_number : "Unknown";
                    const li = document.createElement("li");
                    li.className = "log-item";
                    li.innerHTML = `
                        <div>
                            <span class="log-reg">${escapeHTML(reg)}</span>
                            <span class="log-details">&bull; Status: ${escapeHTML(r.status)}</span>
                        </div>
                        <span class="log-details">${escapeHTML(r.created_at)}</span>
                    `;
                    logsList.appendChild(li);
                });
            }
        }
    }

    renderWorkspaceRegister() {
        const tbody = document.getElementById("register-table-body");
        if (!tbody) return;

        tbody.innerHTML = "";
        const motors = state.getMotorsByProgramme(state.selectedProgrammeId);

        const searchVal = document.getElementById("reg-search")?.value.toLowerCase() || "";
        const filterType = document.getElementById("reg-filter-type")?.value || "";
        const filterStatus = document.getElementById("reg-filter-status")?.value || "";

        const filtered = motors.filter(m => {
            const custodian = state.getPersonName(m.responsible_person_id).toLowerCase();
            const reg = m.registration_number.toLowerCase();
            const status = state.getMotorLatestStatus(m.id).status;

            const matchesSearch = reg.includes(searchVal) || custodian.includes(searchVal) || m.make_of_motor.toLowerCase().includes(searchVal);
            const matchesType = filterType === "" || m.motor_type === filterType;
            const matchesStatus = filterStatus === "" || status === filterStatus;

            return matchesSearch && matchesType && matchesStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 20px; color: var(--text-muted)">No motor assets match your filter criteria.</td></tr>`;
            return;
        }

        filtered.forEach((m, index) => {
            const tr = document.createElement("tr");
            const custodian = state.getPersonName(m.responsible_person_id);
            const iconHTML = getMotorIconHTML(m.motor_type);

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><span class="table-reg-badge">${escapeHTML(m.registration_number)}</span></td>
                <td>${escapeHTML(m.make_of_motor)}</td>
                <td><div class="motor-type-cell">${iconHTML} <span>${escapeHTML(m.motor_type)}</span></div></td>
                <td>${escapeHTML(custodian)}</td>
                <td>${escapeHTML(m.remarks || '-')}</td>
                <td><button class="tbl-action-btn" onclick="app.openDetailsDrawer('${escapeHTML(m.id)}')">Details &rarr;</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderWorkspaceServiceTracker() {
        const tbody = document.getElementById("service-table-body");
        if (!tbody) return;

        tbody.innerHTML = "";
        const motors = state.getMotorsByProgramme(state.selectedProgrammeId);

        motors.forEach(m => {
            const latest = state.getMotorLatestStatus(m.id);
            const tr = document.createElement("tr");

            let reasonText = "-";
            if (latest.status === "Pending") reasonText = latest.reason_pending || "Pending service authorization";
            else if (latest.status === "Overdue") reasonText = latest.reason_overdue || "Scheduled date passed";

            let odoText = "-";
            if (latest.status === "Serviced" && latest.odometer_reading) {
                odoText = `${latest.odometer_reading} km (${latest.service_station || 'Workshop'})`;
            }

            tr.innerHTML = `
                <td><span class="table-reg-badge">${escapeHTML(m.registration_number)}</span></td>
                <td>${escapeHTML(m.motor_type)}</td>
                <td><span class="table-status-pill ${latest.status.toLowerCase()}">${escapeHTML(latest.status)}</span></td>
                <td>${escapeHTML(reasonText)}</td>
                <td>${escapeHTML(odoText)}</td>
                <td>${escapeHTML(latest.created_at || '-')}</td>
                <td>${escapeHTML(latest.recorded_by || '-')}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderWorkspaceLocationTracker() {
        const tbody = document.getElementById("location-table-body");
        if (!tbody) return;

        tbody.innerHTML = "";
        const motors = state.getMotorsByProgramme(state.selectedProgrammeId);

        motors.forEach(m => {
            const latestLoc = state.getMotorLatestLocation(m.id);
            const custodian = state.getPersonName(m.responsible_person_id);
            const tr = document.createElement("tr");

            const dateRange = (latestLoc.start_date && latestLoc.end_date) 
                ? `${latestLoc.start_date} to ${latestLoc.end_date}` 
                : "Stationary";

            tr.innerHTML = `
                <td><span class="table-reg-badge">${escapeHTML(m.registration_number)}</span></td>
                <td>${escapeHTML(custodian)}</td>
                <td>${escapeHTML(latestLoc.location_name)}</td>
                <td><span class="table-cat-pill ${latestLoc.category.toLowerCase().replace(' ', '')}">${escapeHTML(latestLoc.category)}</span></td>
                <td>${escapeHTML(dateRange)}</td>
                <td><span class="stay-days-badge">${escapeHTML(latestLoc.period_days)} days</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderReports() {
        const head = document.getElementById("reports-table-head");
        const body = document.getElementById("reports-table-body");
        const reportType = document.getElementById("report-type")?.value || "by_programme";
        const progFilter = document.getElementById("report-programme-filter")?.value || "";

        if (!head || !body) return;

        head.innerHTML = "";
        body.innerHTML = "";

        let motors = state.motors;
        if (progFilter) {
            motors = motors.filter(m => m.programme_id === progFilter);
        }

        if (reportType === "by_programme" || reportType === "by_status") {
            head.innerHTML = `
                <tr>
                    <th>Reg Number</th>
                    <th>Programme</th>
                    <th>Type</th>
                    <th>Custodian</th>
                    <th>Service Status</th>
                    <th>Current Location</th>
                </tr>
            `;
            motors.forEach(m => {
                const status = state.getMotorLatestStatus(m.id);
                const loc = state.getMotorLatestLocation(m.id);
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${escapeHTML(m.registration_number)}</strong></td>
                    <td>${escapeHTML(state.getProgrammeName(m.programme_id))}</td>
                    <td>${escapeHTML(m.motor_type)}</td>
                    <td>${escapeHTML(state.getPersonName(m.responsible_person_id))}</td>
                    <td><span class="status-badge ${status.status.toLowerCase()}">${escapeHTML(status.status)}</span></td>
                    <td>${escapeHTML(loc.location_name)}</td>
                `;
                body.appendChild(tr);
            });
        } else if (reportType === "pending" || reportType === "overdue") {
            const targetStatus = reportType === "pending" ? "Pending" : "Overdue";
            head.innerHTML = `
                <tr>
                    <th>Reg Number</th>
                    <th>Programme</th>
                    <th>Type</th>
                    <th>Reason Logged</th>
                    <th>Log Date</th>
                    <th>Logged By</th>
                </tr>
            `;
            motors.forEach(m => {
                const status = state.getMotorLatestStatus(m.id);
                if (status.status === targetStatus) {
                    const tr = document.createElement("tr");
                    const reason = targetStatus === "Pending" ? status.reason_pending : status.reason_overdue;
                    tr.innerHTML = `
                        <td><strong>${escapeHTML(m.registration_number)}</strong></td>
                        <td>${escapeHTML(state.getProgrammeName(m.programme_id))}</td>
                        <td>${escapeHTML(m.motor_type)}</td>
                        <td>${escapeHTML(reason || 'N/A')}</td>
                        <td>${escapeHTML(status.created_at)}</td>
                        <td>${escapeHTML(status.recorded_by)}</td>
                    `;
                    body.appendChild(tr);
                }
            });
        } else if (reportType === "serviced") {
            head.innerHTML = `
                <tr>
                    <th>Reg Number</th>
                    <th>Programme</th>
                    <th>Odometer Reading</th>
                    <th>Next Due Odo</th>
                    <th>Service Workshop</th>
                    <th>Service Date</th>
                </tr>
            `;
            motors.forEach(m => {
                const status = state.getMotorLatestStatus(m.id);
                if (status.status === "Serviced") {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><strong>${escapeHTML(m.registration_number)}</strong></td>
                        <td>${escapeHTML(state.getProgrammeName(m.programme_id))}</td>
                        <td>${escapeHTML(status.odometer_reading || 0)} km</td>
                        <td>${escapeHTML(status.next_service_odometer || 0)} km</td>
                        <td>${escapeHTML(status.service_station || 'Main Workshop')}</td>
                        <td>${escapeHTML(status.created_at)}</td>
                    `;
                    body.appendChild(tr);
                }
            });
        } else {
            head.innerHTML = `
                <tr>
                    <th>Reg Number</th>
                    <th>Custodian</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Stay Duration (Days)</th>
                </tr>
            `;
            motors.forEach(m => {
                const loc = state.getMotorLatestLocation(m.id);
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${escapeHTML(m.registration_number)}</strong></td>
                    <td>${escapeHTML(state.getPersonName(m.responsible_person_id))}</td>
                    <td>${escapeHTML(loc.location_name)}</td>
                    <td>${escapeHTML(loc.category)}</td>
                    <td>${escapeHTML(loc.period_days)} days</td>
                `;
                body.appendChild(tr);
            });
        }
    }

    exportCSV() {
        const reportType = document.getElementById("report-type")?.value || "report";
        const table = document.querySelector(".reports-preview-table");
        if (!table) return;

        let csv = [];
        const rows = table.querySelectorAll("tr");
        rows.forEach(row => {
            const cols = row.querySelectorAll("th, td");
            const rowData = [];
            cols.forEach(col => rowData.push(`"${col.textContent.trim().replace(/"/g, '""')}"`));
            csv.push(rowData.join(","));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `nacrri_fleet_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast("CSV report generated and downloaded.", "success");
    }

    renderSettings() {
        if (state.currentUser.role !== "Super Admin") return;

        const typesArea = document.getElementById("set-motor-types");
        const stationsArea = document.getElementById("set-service-stations");
        const pendingArea = document.getElementById("set-pending-reasons");
        const overdueArea = document.getElementById("set-overdue-reasons");
        const locationsArea = document.getElementById("set-locations");

        if (typesArea) typesArea.value = state.dropdowns.motorTypes.join("\n");
        if (stationsArea) stationsArea.value = state.dropdowns.serviceStations.join("\n");
        if (pendingArea) pendingArea.value = state.dropdowns.pendingReasons.join("\n");
        if (overdueArea) overdueArea.value = state.dropdowns.overdueReasons.join("\n");
        if (locationsArea) {
            locationsArea.value = state.dropdowns.locations.map(l => `${l.name} | ${l.category}`).join("\n");
        }
    }

    saveSettings() {
        if (state.currentUser.role !== "Super Admin") {
            this.showToast("Access Denied: Settings update restricted to Super Admin.", "warning");
            return;
        }

        const parseLines = (id) => (document.getElementById(id)?.value || "").split("\n").map(s => s.trim()).filter(Boolean);

        state.dropdowns.motorTypes = parseLines("set-motor-types");
        state.dropdowns.serviceStations = parseLines("set-service-stations");
        state.dropdowns.pendingReasons = parseLines("set-pending-reasons");
        state.dropdowns.overdueReasons = parseLines("set-overdue-reasons");

        const locationLines = parseLines("set-locations");
        state.dropdowns.locations = locationLines.map(line => {
            const parts = line.split("|").map(p => p.trim());
            return {
                name: parts[0] || "Unknown Location",
                category: parts[1] || "On station"
            };
        });

        state.saveToStorage();
        this.showToast("Dropdown list configuration saved.", "success");
    }

    initEntryForm() {
        const form = document.getElementById("motor-entry-form");
        if (!form) return;

        form.reset();
        const dateInput = document.getElementById("form-entry-date");
        const userRef = document.getElementById("form-recorded-by");

        if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
        if (userRef) userRef.value = state.currentUser.name;

        const progSelect = document.getElementById("form-programme");
        if (progSelect) {
            progSelect.value = state.selectedProgrammeId;
            progSelect.disabled = state.currentUser.role === "Programme Admin";
        }

        this.populateEntryFormFilters();
        this.handleFormConditionalVisibility();
    }

    populateEntryFormFilters() {
        const progId = document.getElementById("form-programme")?.value || state.selectedProgrammeId;
        const motorType = document.getElementById("form-motor-type")?.value || "";

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

        if (pendingGroup) pendingGroup.classList.add("hidden");
        if (overdueGroup) overdueGroup.classList.add("hidden");
        if (servicedGroupOdo) servicedGroupOdo.classList.add("hidden");
        if (servicedGroupStation) servicedGroupStation.classList.add("hidden");

        if (serviceStatus === "Serviced") {
            if (servicedGroupOdo) servicedGroupOdo.classList.remove("hidden");
            if (servicedGroupStation) servicedGroupStation.classList.remove("hidden");
        } else if (serviceStatus === "Pending") {
            if (pendingGroup) pendingGroup.classList.remove("hidden");
        } else if (serviceStatus === "Overdue") {
            if (overdueGroup) overdueGroup.classList.remove("hidden");
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
        submitBtn.disabled = !form.checkValidity();
    }

    handleMotorEntrySubmit(e) {
        e.preventDefault();
        if (state.currentUser.role === "Management Viewer") {
            this.showToast("Access Denied: Read-only accounts cannot submit entry updates.", "warning");
            return;
        }

        const formData = {
            motor_id: document.getElementById("form-registration").value,
            responsible_person_id: document.getElementById("form-responsible-person").value,
            service_status: document.getElementById("form-service-status").value,
            reason_pending: document.getElementById("form-pending-reason").value,
            reason_overdue: document.getElementById("form-overdue-reason").value,
            odometer_reading: document.getElementById("form-odometer").value,
            next_service_odometer: Number(document.getElementById("form-odometer").value) + 5000,
            service_station: document.getElementById("form-service-station").value,
            location_name: document.getElementById("form-location").value,
            location_category: document.getElementById("form-location-category").value,
            start_date: document.getElementById("form-start-date").value,
            end_date: document.getElementById("form-end-date").value,
            period_days: document.getElementById("form-period-days").value
        };

        if (!formData.motor_id) {
            this.showToast("Please select a valid motor registration number.", "error");
            return;
        }

        state.saveMotorEntry(formData);
        this.showToast("Motor status and location details recorded successfully.", "success");
        this.switchWorkspaceTab("register");
    }
}

const app = new AppController();
window.app = app;

document.addEventListener("DOMContentLoaded", () => {
    app.init();

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Rate Limiting Check
            if (app.lockoutUntil && Date.now() < app.lockoutUntil) {
                const secs = Math.ceil((app.lockoutUntil - Date.now()) / 1000);
                const errBox = document.getElementById("login-error-msg");
                if (errBox) {
                    errBox.textContent = `Too many failed attempts. Account locked. Please wait ${secs} seconds.`;
                    errBox.classList.remove("hidden");
                }
                return;
            }

            const role = document.getElementById("login-role").value;
            const programmeId = document.getElementById("login-programme").value;
            const nameField = document.getElementById("login-name").value.trim();
            const pinField = document.getElementById("login-pin").value.trim();

            // PIN Authentication Validation
            let validPin = false;
            if (role === "Super Admin" && (pinField === "phrao2026" || pinField === "admin123")) validPin = true;
            else if (role === "Programme Admin" && (pinField === "prog2026" || pinField === "admin123")) validPin = true;
            else if (role === "Management Viewer") validPin = true;

            if (!validPin) {
                app.failedAttempts = (app.failedAttempts || 0) + 1;
                const errBox = document.getElementById("login-error-msg");
                if (app.failedAttempts >= 5) {
                    app.lockoutUntil = Date.now() + 30000;
                    if (errBox) {
                        errBox.textContent = "Maximum PIN attempts exceeded. Portal access locked for 30 seconds.";
                        errBox.classList.remove("hidden");
                    }
                } else if (errBox) {
                    errBox.textContent = `Invalid Security PIN. Attempt ${app.failedAttempts} of 5.`;
                    errBox.classList.remove("hidden");
                }
                return;
            }

            // Successful Auth Reset Rate Limiter
            app.failedAttempts = 0;
            app.lockoutUntil = 0;
            const errBox = document.getElementById("login-error-msg");
            if (errBox) errBox.classList.add("hidden");

            state.currentUser = {
                role,
                programmeId,
                name: nameField || `${role} User`
            };

            if (role === "Programme Admin") {
                state.selectedProgrammeId = programmeId;
                app.switchView("workspace", programmeId);
            } else {
                app.switchView("overview");
            }

            app.showToast(`Authenticated as ${state.currentUser.name} (${role})`, 'success');
        });
    }
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
            console.log('PWA ServiceWorker notice: ', err);
        });
    });
}
