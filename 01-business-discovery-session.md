# Geofencing Workforce Monitoring - Business Discovery Session

## Purpose

This discovery session is the first step before designing or building the demo application. The goal is to understand the petrol pump operation well enough to recommend the right workforce monitoring approach, without assuming that GPS-only, mobile-app-only, or hardware-heavy tracking is automatically the best solution.

The system should help management monitor whether employees remain within the petrol pump premises, stay reasonably close to assigned work zones, follow break rules, and remain visible during working hours.

## How To Respond

Please answer each section using the option that best matches the petrol pump's reality. If none of the options fit, describe the actual situation. After your response, the next steps will be:

1. Architecture options
2. Recommended solution
3. System design
4. UI wireframes
5. Application build plan
6. HTML/CSS/JavaScript prototype
7. Future production implementation plan

---

## 1. Petrol Pump Layout

**Question:** Do you have a rough site layout showing the position of petrol/diesel dispensers, CNG dispensers, office, cash counter, restroom, break area, entry/exit, and compound boundary?

**Why this matters:** Geofencing depends heavily on physical layout. The system must know the compound boundary, work zones, authorized movement areas, and places where an employee may legitimately be away from the assigned dispenser.

**Possible answers:**

- **A. Exact digital layout available**
  - Advantage: Most accurate demo and future system design.
  - Disadvantage: May take time to collect or convert into a usable format.
- **B. Hand-drawn layout or rough sketch available**
  - Advantage: Enough for a realistic demo and early planning.
  - Disadvantage: Measurements may be approximate.
- **C. No layout available yet**
  - Advantage: We can still create an assumption-based demo.
  - Disadvantage: Production accuracy cannot be validated yet.

**Recommendation:** Start with a rough sketch for the demo. For production, later capture a measured layout or satellite/map-based boundary.

**Your answer:**

---

## 2. Work Zones

**Question:** Should each dispenser be treated as a separate employee work zone, or should nearby dispensers be grouped into larger zones?

**Why this matters:** Very small zones can create false alerts because location tracking is never perfectly accurate. Larger zones are easier to monitor but less precise.

**Possible answers:**

- **A. One zone per dispenser**
  - Advantage: Strong accountability for assigned positions.
  - Disadvantage: More false alerts if tracking accuracy is weak.
- **B. Petrol/diesel area as one combined zone, CNG area as another**
  - Advantage: More practical for GPS or basic tracking.
  - Disadvantage: Cannot confirm exact dispenser presence.
- **C. Hybrid zones: assigned dispenser plus nearby tolerance area**
  - Advantage: Balances accountability and real-world movement.
  - Disadvantage: Requires slightly more detailed design.

**Recommendation:** Use hybrid zones: assigned dispenser zones with a reasonable tolerance area around each dispenser.

**Your answer:**

---

## 3. Employee Movement Rules

**Question:** During a shift, where is an employee allowed to move without triggering an alert?

**Why this matters:** Employees may need to visit the cash counter, restroom, break area, office, drinking water point, storage room, or another dispenser. The system should distinguish normal movement from unauthorized absence.

**Possible answers:**

- **A. Employees must stay near assigned dispenser except official breaks**
  - Advantage: Simple policy and strict accountability.
  - Disadvantage: May not reflect operational reality.
- **B. Employees can move to selected authorized areas**
  - Advantage: More realistic and reduces false alerts.
  - Disadvantage: Requires defining authorized areas clearly.
- **C. Employees can move anywhere inside the compound**
  - Advantage: Easy to implement.
  - Disadvantage: Weak dispenser-level monitoring.

**Recommendation:** Allow selected authorized areas: assigned zone, cash counter, restroom, office when required, and break area during approved breaks.

**Your answer:**

---

## 4. Shift Structure

**Question:** How many shifts are operated per day, and what are the shift timings?

**Why this matters:** Attendance, late arrival, shift not started, zone absence, and unauthorized break alerts all depend on shift timing.

**Possible answers:**

- **A. Fixed shifts every day**
  - Advantage: Easiest to configure and demonstrate.
  - Disadvantage: Less flexible if staffing changes often.
- **B. Rotating shifts**
  - Advantage: Matches many real operations.
  - Disadvantage: Requires shift roster management.
- **C. Flexible/ad hoc shifts**
  - Advantage: Operationally flexible.
  - Disadvantage: Harder to automate without supervisor input.

**Recommendation:** For the demo, use fixed or roster-based shifts. For production, support rotating shift rosters.

**Your answer:**

---

## 5. Employee Assignment

**Question:** Are employees permanently assigned to specific dispensers, or does the assignment change by shift/day?

**Why this matters:** The system needs to know which employee should be near which dispenser at any given time.

**Possible answers:**

- **A. Fixed dispenser assignment**
  - Advantage: Simple setup and easier monitoring.
  - Disadvantage: Less flexible for real staffing changes.
- **B. Assignment changes by shift**
  - Advantage: More realistic and operationally useful.
  - Disadvantage: Requires roster/assignment entry.
- **C. Supervisor assigns employees at shift start**
  - Advantage: Practical for daily operations.
  - Disadvantage: Requires a supervisor workflow.

**Recommendation:** Use shift-wise assignments, with the supervisor able to adjust assignments at shift start.

**Your answer:**

---

## 6. Existing Attendance System

**Question:** How is employee attendance currently captured?

**Why this matters:** The demo can show attendance integration, but production design depends on whether there is already biometric, register-based, payroll, or app-based attendance.

**Possible answers:**

- **A. Manual register**
  - Advantage: Easy to understand and replace gradually.
  - Disadvantage: Less reliable and harder to audit.
- **B. Biometric device**
  - Advantage: Strong proof of arrival.
  - Disadvantage: Does not prove presence near assigned zone after check-in.
- **C. Existing software/app**
  - Advantage: Potential for integration.
  - Disadvantage: Integration may require access/API support.
- **D. No formal system**
  - Advantage: Demo can define a clean new workflow.
  - Disadvantage: Production rollout needs policy alignment.

**Recommendation:** Keep attendance and zone monitoring separate in the demo, then integrate attendance in production if a reliable source exists.

**Your answer:**

---

## 7. Device Availability

**Question:** Will employees carry company-owned devices, personal smartphones, RFID/Bluetooth tags, or no device at all?

**Why this matters:** The tracking method depends on what the employee can realistically carry.

**Possible answers:**

- **A. Personal smartphones**
  - Advantage: Lowest hardware cost.
  - Disadvantage: Battery, privacy, permissions, and compliance concerns.
- **B. Company-owned smartphones**
  - Advantage: Better control and consistency.
  - Disadvantage: Higher cost and device management effort.
- **C. Wearable tags/cards**
  - Advantage: Easier for employees and less privacy-sensitive.
  - Disadvantage: Requires receiver hardware or Bluetooth infrastructure.
- **D. No employee device**
  - Advantage: No employee device dependency.
  - Disadvantage: Monitoring becomes difficult unless using cameras or manual supervision.

**Recommendation:** For a practical production path, evaluate personal smartphones for the demo and company-owned phones or Bluetooth/RFID tags for production reliability.

**Your answer:**

---

## 8. Internet And Network Availability

**Question:** Is reliable internet/Wi-Fi available across the petrol pump premises?

**Why this matters:** Real-time dashboards and alerts require connectivity. Poor internet changes the architecture toward offline-first syncing or local network hardware.

**Possible answers:**

- **A. Reliable Wi-Fi across premises**
  - Advantage: Supports real-time monitoring.
  - Disadvantage: Wi-Fi coverage must still be validated near dispensers.
- **B. Mobile data available**
  - Advantage: No site Wi-Fi dependency.
  - Disadvantage: Device data plans and network quality vary.
- **C. Patchy connectivity**
  - Advantage: Still possible with delayed sync.
  - Disadvantage: Real-time alerts may be unreliable.
- **D. No reliable internet**
  - Advantage: Local-only system can be explored.
  - Disadvantage: More hardware/local server complexity.

**Recommendation:** For the demo, assume real-time connectivity. For production, conduct a Wi-Fi/mobile coverage check before final architecture.

**Your answer:**

---

## 9. Accuracy Requirement

**Question:** How precise does employee location need to be?

**Why this matters:** GPS may be enough for compound-level monitoring but may not reliably distinguish one dispenser from another, especially in a small area.

**Possible answers:**

- **A. Compound-level only**
  - Advantage: GPS is likely sufficient.
  - Disadvantage: Does not prove employee stayed near assigned dispenser.
- **B. Area-level: petrol/diesel/CNG/break/office**
  - Advantage: Practical balance of accuracy and cost.
  - Disadvantage: May not identify exact nozzle/dispenser.
- **C. Dispenser-level precision**
  - Advantage: Strong accountability.
  - Disadvantage: GPS alone may not be enough; may require Bluetooth beacons, RFID, or other sensors.

**Recommendation:** Aim for area-level accuracy for the demo, with dispenser-level monitoring shown as an advanced production option.

**Your answer:**

---

## 10. Break Policy

**Question:** What is the official break policy during shifts?

**Why this matters:** Unauthorized break alerts require defined break duration, frequency, approval rules, and break area.

**Possible answers:**

- **A. Fixed break times**
  - Advantage: Easy to monitor.
  - Disadvantage: Less flexible during rush hours.
- **B. Supervisor-approved breaks**
  - Advantage: Operationally realistic.
  - Disadvantage: Requires approval workflow.
- **C. Informal breaks**
  - Advantage: Matches many current operations.
  - Disadvantage: Hard to classify violations fairly.

**Recommendation:** Use supervisor-approved breaks in the system, with optional fixed break limits.

**Your answer:**

---

## 11. Alert Types And Escalation

**Question:** What should happen when an employee leaves the compound or assigned zone?

**Why this matters:** Alerts can become noisy if every minor movement triggers management escalation. The system needs thresholds and escalation rules.

**Possible answers:**

- **A. Immediate alert to supervisor**
  - Advantage: Fast response.
  - Disadvantage: Can create false alert fatigue.
- **B. Alert only after a time threshold**
  - Advantage: Reduces false alerts.
  - Disadvantage: Slight delay in response.
- **C. Multi-level escalation**
  - Advantage: Best for serious cases.
  - Disadvantage: More workflow complexity.

**Recommendation:** Use thresholds: for example, zone absence after 3-5 minutes, outside compound after 1-2 minutes, and escalation if unresolved.

**Your answer:**

---

## 12. Supervisor Workflow

**Question:** Who will monitor the dashboard and respond to alerts?

**Why this matters:** The system should match actual accountability. If nobody owns alert review, the dashboard becomes passive.

**Possible answers:**

- **A. Site manager**
  - Advantage: Strong authority.
  - Disadvantage: Manager may not monitor continuously.
- **B. Shift supervisor**
  - Advantage: Best real-time operational owner.
  - Disadvantage: Requires supervisor discipline and training.
- **C. Owner/management remotely**
  - Advantage: Strong oversight.
  - Disadvantage: May be too delayed for operational action.
- **D. Combination**
  - Advantage: Best accountability structure.
  - Disadvantage: Requires role-based access and escalation.

**Recommendation:** Shift supervisor handles live alerts; manager/owner reviews reports and escalations.

**Your answer:**

---

## 13. Privacy And Employee Consent

**Question:** Has management considered employee consent and privacy expectations for location monitoring?

**Why this matters:** Workforce tracking can become sensitive. The policy should clearly state that tracking is limited to work hours and premises-related accountability.

**Possible answers:**

- **A. Track only during active shift**
  - Advantage: Most privacy-respecting and practical.
  - Disadvantage: Requires reliable shift start/end logic.
- **B. Track whenever employee is on premises**
  - Advantage: Useful for attendance.
  - Disadvantage: Needs clear policy.
- **C. Track continuously on company-owned device**
  - Advantage: Maximum control.
  - Disadvantage: Higher privacy concern and likely unnecessary.

**Recommendation:** Track only during active shifts, with clear employee communication and supervisor visibility.

**Your answer:**

---

## 14. Demo Scope

**Question:** For the management demo, should the prototype be realistic with sample data, or should it simulate live movement and alerts?

**Why this matters:** A static dashboard is faster to build, but a simulated live demo is more persuasive.

**Possible answers:**

- **A. Static dashboard with sample data**
  - Advantage: Fast and polished.
  - Disadvantage: Less impressive for operational demonstration.
- **B. Interactive prototype with simulated employee movement**
  - Advantage: Best for management presentation.
  - Disadvantage: More build effort.
- **C. Semi-functional MVP using browser/mobile location**
  - Advantage: Shows a real implementation path.
  - Disadvantage: Requires permissions and may be unreliable in a demo setting.

**Recommendation:** Build an interactive prototype with simulated employee movement, alerts, zones, reports, and management dashboard.

**Your answer:**

---

## 15. Production Direction

**Question:** If the demo is approved, what is the likely production goal?

**Why this matters:** A demo can be built quickly, but the production path should influence the demo's concepts so management sees a realistic roadmap.

**Possible answers:**

- **A. Low-cost mobile-based system**
  - Advantage: Fast deployment and low hardware cost.
  - Disadvantage: Accuracy and compliance challenges.
- **B. Hybrid system with mobile plus Bluetooth/RFID zones**
  - Advantage: Better reliability and zone accuracy.
  - Disadvantage: Moderate hardware and setup cost.
- **C. Full enterprise workforce platform**
  - Advantage: Strong scalability, reports, roles, integrations, and auditability.
  - Disadvantage: Higher cost and longer implementation.

**Recommendation:** Position the demo as a hybrid workforce monitoring platform, starting simple but showing a credible path to production.

**Your answer:**

---

## Initial Consultant Recommendation

Based on the current information, the most practical direction for the demo is:

**Hybrid Workforce Monitoring Prototype**

The demo should show:

- Compound boundary monitoring
- Work zones for petrol/diesel dispensers and CNG dispensers
- Authorized zones such as cash counter, restroom, break area, and office
- Employee statuses such as At Assigned Zone, In Authorized Area, On Break, Outside Compound, and Shift Not Started
- Alerts with time thresholds rather than instant false-positive alerts
- Reports for attendance, zone violations, and employee activity
- A dashboard suitable for management presentation

For the actual production system, the final technology should be selected after confirming layout, device availability, required accuracy, internet coverage, and privacy policy.

