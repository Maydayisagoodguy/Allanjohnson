const employees = [
  { id: "CA1", name: "Arjun", nozzles: "N1 + N3", zone: "Dispenser 1 Side A", status: "assigned", x: 18, y: 32 },
  { id: "CA2", name: "Sameer", nozzles: "N2 + N4", zone: "Dispenser 1 Side B", status: "assigned", x: 25, y: 36 },
  { id: "CA3", name: "Navas", nozzles: "N5 + N7", zone: "Dispenser 2 Side A", status: "assigned", x: 43, y: 34 },
  { id: "CA4", name: "Rafi", nozzles: "N6 + N8", zone: "Dispenser 2 Side B", status: "assigned", x: 50, y: 38 },
  { id: "CA5", name: "Biju", nozzles: "N9 + N11", zone: "Dispenser 3 Side A", status: "assigned", x: 18, y: 62 },
  { id: "CA6", name: "Shabeer", nozzles: "N10 + N12", zone: "Dispenser 3 Side B", status: "assigned", x: 25, y: 66 },
  { id: "CA7", name: "Manoj", nozzles: "N13 + N15", zone: "Dispenser 4 Side A", status: "assigned", x: 43, y: 63 },
  { id: "CA8", name: "Jithin", nozzles: "N14 + N16", zone: "Dispenser 4 Side B", status: "assigned", x: 50, y: 67 },
  { id: "CA9", name: "Fasil", nozzles: "N17 + N18", zone: "CNG Dispenser 1", status: "break", x: 75, y: 44 },
  { id: "CA10", name: "Akhil", nozzles: "N19 + N20", zone: "CNG Dispenser 2", status: "danger", x: 93, y: 83 }
];

const breakPlan = [
  { group: "CA1 - CA2", tea1: "9:30 AM", lunch: "1:00 PM", tea2: "4:15 PM" },
  { group: "CA3 - CA4", tea1: "9:45 AM", lunch: "1:15 PM", tea2: "4:30 PM" },
  { group: "CA5 - CA6", tea1: "10:00 AM", lunch: "1:30 PM", tea2: "4:45 PM" },
  { group: "CA7 - CA8", tea1: "10:15 AM", lunch: "1:45 PM", tea2: "5:00 PM" },
  { group: "CA9 - CA10", tea1: "10:30 AM", lunch: "2:00 PM", tea2: "5:15 PM" }
];

const statusCopy = {
  assigned: { label: "At Assigned Zone", className: "ok", detail: "Within assigned nozzle-pair tolerance" },
  cash: { label: "At Cash Counter", className: "warn", detail: "Allowed movement, return within 3 minutes" },
  restroom: { label: "At Restroom", className: "warn", detail: "Allowed movement, return within 3 minutes" },
  office: { label: "Office Visit", className: "warn", detail: "Supervisor-approved, return within 3 minutes" },
  break: { label: "Approved Break", className: "break", detail: "Outside compound allowed until break limit" },
  danger: { label: "Outside Compound", className: "danger", detail: "Not in approved break window" },
  outside: { label: "Outside Compound", className: "danger", detail: "Not in approved break window" }
};

let soundEnabled = true;
let demoTimer = null;

function statusBadge(status) {
  const item = statusCopy[status] || statusCopy.assigned;
  return `<span class="status-badge ${item.className}">${item.label}</span>`;
}

function renderSupervisor() {
  const rows = document.querySelector("#employeeRows");
  if (!rows) return;

  rows.innerHTML = employees
    .map((employee, index) => {
      const actionLabel = employee.status === "break" ? "Track return" : "Approve break";
      return `
        <tr>
          <td><strong>${employee.name}</strong><br><span>${employee.id}</span></td>
          <td>${employee.nozzles}<br><span>${employee.zone}</span></td>
          <td>7 AM - 7 PM</td>
          <td>${statusBadge(employee.status)}</td>
          <td><button class="row-action" data-break-index="${index}" type="button">${actionLabel}</button></td>
        </tr>
      `;
    })
    .join("");

  rows.querySelectorAll("[data-break-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.breakIndex);
      employees[index].status = employees[index].status === "break" ? "assigned" : "break";
      if (employees[index].status === "break") {
        employees[index].x = 12;
        employees[index].y = 86;
      }
      renderSupervisor();
    });
  });

  renderMapMarkers();
  renderAlerts();
  renderMetrics();
  renderBreakCards();
}

function renderMetrics() {
  const atZone = employees.filter((employee) => employee.status === "assigned").length;
  const alerts = employees.filter((employee) => ["danger", "restroom", "cash", "office"].includes(employee.status)).length;
  const breaks = employees.filter((employee) => employee.status === "break").length;

  setText("#activeCount", employees.length);
  setText("#atZoneCount", atZone);
  setText("#alertCount", alerts);
  setText("#breakCount", breaks);
  setText("#reportViolations", `${alerts} today`);
}

function renderMapMarkers() {
  const markerLayer = document.querySelector("#mapMarkers");
  if (!markerLayer) return;

  markerLayer.innerHTML = employees
    .map((employee) => {
      const item = statusCopy[employee.status] || statusCopy.assigned;
      return `
        <div class="ca-marker ${item.className}" style="left:${employee.x}%; top:${employee.y}%;" title="${employee.name}: ${item.label}">
          ${employee.id.replace("CA", "")}
        </div>
      `;
    })
    .join("");
}

function renderAlerts() {
  const list = document.querySelector("#alertList");
  if (!list) return;

  const alertEmployees = employees.filter((employee) => employee.status !== "assigned");
  if (!alertEmployees.length) {
    list.innerHTML = `<div class="alert-item"><div><strong>No active alerts</strong><span>All CAs are inside allowed zones.</span></div><time>Now</time></div>`;
    return;
  }

  list.innerHTML = alertEmployees
    .map((employee) => {
      const item = statusCopy[employee.status];
      const message = employee.status === "danger"
        ? `${employee.name} is outside the compound without approved break.`
        : `${employee.name}: ${item.detail}.`;
      return `
        <div class="alert-item ${item.className}">
          <div>
            <strong>${item.label}</strong>
            <span>${message}</span>
          </div>
          <time>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
        </div>
      `;
    })
    .join("");
}

function renderBreakCards() {
  const wrap = document.querySelector("#breakCards");
  if (!wrap) return;

  wrap.innerHTML = breakPlan
    .map((item) => `
      <article class="break-card">
        <span>${item.group}</span>
        <strong>Tea 1: ${item.tea1}</strong>
        <p>Lunch: ${item.lunch}</p>
        <p>Tea 2: ${item.tea2}</p>
      </article>
    `)
    .join("");
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.dataset.panel)?.classList.add("active");
    });
  });
}

function setupScenarios() {
  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = button.dataset.scenario;
      if (scenario === "outside") {
        Object.assign(employees[1], { status: "danger", x: 102, y: 78 });
        playAlert();
      }
      if (scenario === "restroom") {
        Object.assign(employees[4], { status: "restroom", x: 79, y: 81 });
      }
      if (scenario === "break") {
        Object.assign(employees[8], { status: "break", x: 9, y: 88 });
      }
      if (scenario === "cash") {
        Object.assign(employees[6], { status: "cash", x: 18, y: 80 });
      }
      renderSupervisor();
    });
  });

  document.querySelector("#acknowledgeAlerts")?.addEventListener("click", () => {
    employees.forEach((employee, index) => {
      const original = [
        { x: 18, y: 32 }, { x: 25, y: 36 }, { x: 43, y: 34 }, { x: 50, y: 38 },
        { x: 18, y: 62 }, { x: 25, y: 66 }, { x: 43, y: 63 }, { x: 50, y: 67 },
        { x: 75, y: 44 }, { x: 75, y: 63 }
      ][index];
      Object.assign(employee, { status: "assigned", ...original });
    });
    renderSupervisor();
  });
}

function setupDemoControls() {
  document.querySelector("#soundToggle")?.addEventListener("click", (event) => {
    soundEnabled = !soundEnabled;
    event.currentTarget.textContent = soundEnabled ? "Sound On" : "Sound Off";
  });

  document.querySelector("#resetDemo")?.addEventListener("click", () => {
    clearInterval(demoTimer);
    demoTimer = null;
    location.reload();
  });

  document.querySelector("#runDemo")?.addEventListener("click", () => {
    clearInterval(demoTimer);
    const steps = [
      () => Object.assign(employees[2], { status: "cash", x: 18, y: 80 }),
      () => Object.assign(employees[2], { status: "assigned", x: 43, y: 34 }),
      () => Object.assign(employees[8], { status: "break", x: 9, y: 88 }),
      () => Object.assign(employees[1], { status: "danger", x: 102, y: 78 }),
      () => Object.assign(employees[1], { status: "assigned", x: 25, y: 36 }),
      () => Object.assign(employees[8], { status: "assigned", x: 75, y: 44 })
    ];
    let step = 0;
    steps[step++]();
    renderSupervisor();
    demoTimer = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(demoTimer);
        demoTimer = null;
        return;
      }
      steps[step++]();
      if (step === 4) playAlert();
      renderSupervisor();
    }, 1600);
  });
}

function playAlert() {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 720;
    gain.gain.value = 0.06;
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.18);
  } catch {
    // Browser sound can be blocked until the first user interaction.
  }
}

function renderCA() {
  const select = document.querySelector("#caSelect");
  if (!select) return;

  select.innerHTML = employees
    .map((employee, index) => `<option value="${index}">${employee.name} - ${employee.nozzles}</option>`)
    .join("");

  const updateCA = () => {
    const employee = employees[Number(select.value)];
    setText("#caName", employee.name);
    setText("#caNozzles", employee.nozzles);
    updateCAState(employee.status);
  };

  select.addEventListener("change", updateCA);
  document.querySelectorAll("[data-ca-state]").forEach((button) => {
    button.addEventListener("click", () => updateCAState(button.dataset.caState));
  });
  updateCA();
}

function updateCAState(state) {
  const item = statusCopy[state] || statusCopy.assigned;
  const orb = document.querySelector("#caStatusOrb");
  const badge = document.querySelector("#caCompoundBadge");
  const marker = document.querySelector("#phoneMarker");
  if (!orb || !badge || !marker) return;

  setText("#caStatusText", item.label);
  orb.className = `status-orb ${item.className}`;
  badge.className = `status-badge ${state === "outside" || state === "danger" ? "danger" : item.className}`;
  badge.textContent = state === "outside" || state === "danger" ? "Outside compound" : "Inside compound";

  const positions = {
    assigned: { left: "52%", top: "44%", color: "var(--green)" },
    cash: { left: "18%", top: "72%", color: "var(--amber)" },
    restroom: { left: "78%", top: "72%", color: "var(--amber)" },
    outside: { left: "-26%", top: "76%", color: "var(--red)" },
    danger: { left: "-26%", top: "76%", color: "var(--red)" }
  };
  const position = positions[state] || positions.assigned;
  marker.style.left = position.left;
  marker.style.top = position.top;
  marker.style.background = position.color;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupScenarios();
  setupDemoControls();
  renderSupervisor();
  renderCA();
});
