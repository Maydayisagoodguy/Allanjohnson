const firebaseReady =
  window.GEOFENCE_FIREBASE_CONFIG &&
  !window.GEOFENCE_FIREBASE_CONFIG.apiKey.startsWith("PASTE_");

let database = null;

if (firebaseReady) {
  firebase.initializeApp(window.GEOFENCE_FIREBASE_CONFIG);
  database = firebase.database();
  database.ref("liveLocations").on("value", (snapshot) => {
    render(Object.values(snapshot.val() || {}));
  });
} else {
  document.querySelector("#alertList").innerHTML =
    '<div class="alert">Firebase is not configured. Paste config in firebase-config.js.</div>';
}

function render(items) {
  const markerLayer = document.querySelector("#markerLayer");
  const rows = document.querySelector("#caRows");
  const alerts = items.filter((item) => item.alertType !== "inside");
  const inside = items.filter((item) => item.inside).length;

  document.querySelector("#totalCount").textContent = items.length;
  document.querySelector("#insideCount").textContent = inside;
  document.querySelector("#alertCount").textContent = alerts.length;

  markerLayer.innerHTML = items.map((item) => {
    const position = GeofenceCore.mapPosition(item.lat, item.lng);
    return `<span class="ca-marker ${item.alertType}" style="left:${position.x}%;top:${position.y}%;" title="${item.name}">${item.name.slice(0, 2).toUpperCase()}</span>`;
  }).join("");

  rows.innerHTML = items.map((item) => {
    const updated = item.updatedAt
      ? new Date(item.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : "--";
    const boundary = item.inside ? "Inside" : "Outside";
    return `
      <tr>
        <td><strong>${item.name}</strong><br>${item.caId}</td>
        <td>${item.assigned}</td>
        <td>${item.nearest}</td>
        <td><span class="badge ${item.alertType}">${boundary}</span></td>
        <td>${item.assignedDistanceMeters ?? "--"} m</td>
        <td>${updated}</td>
      </tr>
    `;
  }).join("");

  document.querySelector("#alertList").innerHTML = alerts.length
    ? alerts.map((item) => {
        const message = item.alertType === "outside"
          ? `${item.name} is outside the B1-B2-B3-B4 boundary.`
          : `${item.name} is away from assigned ${item.assigned}.`;
        return `<div class="alert">${message}</div>`;
      }).join("")
    : "<p>No active alerts.</p>";
}
