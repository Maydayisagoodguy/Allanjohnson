const ablyConfig = window.GEOFENCE_ABLY_CONFIG || {};
const ablyReady = ablyConfig.apiKey && !ablyConfig.apiKey.startsWith("PASTE_");

let channel = null;
let watchId = null;
let caId = null;
let awayStartedAt = null;
let lastPublishAt = 0;

const assignedRadiusMeters = 18;
const awayAlertSeconds = 300;
const publishEveryMs = 1000;

const statusCard = document.querySelector("#statusCard");
const statusText = document.querySelector("#statusText");
const statusHint = document.querySelector("#statusHint");
const nearestNozzle = document.querySelector("#nearestNozzle");
const assignedDistance = document.querySelector("#assignedDistance");
const accuracyText = document.querySelector("#accuracyText");
const lastSent = document.querySelector("#lastSent");

if (ablyReady) {
  const client = new Ably.Realtime({ key: ablyConfig.apiKey, clientId: "ca-phone" });
  channel = client.channels.get(ablyConfig.channelName || "mn-moopen-geofence-demo");
} else {
  setStatus("Ably key not set", "Paste your Ably API key in ably-config.js first.", "away");
}

document.querySelector("#startTracking").addEventListener("click", () => {
  if (!channel) {
    setStatus("Ably key not set", "The tracker cannot send live data until Ably is configured.", "away");
    return;
  }

  if (!navigator.geolocation) {
    setStatus("GPS unavailable", "This phone browser does not support location.", "away");
    return;
  }

  const name = document.querySelector("#caName").value.trim() || "CA";
  caId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ca";

  if (watchId !== null) navigator.geolocation.clearWatch(watchId);

  setStatus("Tracking", "Location is being sent live through Ably.", "inside");
  watchId = navigator.geolocation.watchPosition(handlePosition, handleLocationError, {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 500
  });
});

async function handlePosition(position) {
  const now = Date.now();
  if (now - lastPublishAt < publishEveryMs) return;
  lastPublishAt = now;

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const assigned = document.querySelector("#assignedNozzle").value;
  const nearest = GeofenceCore.nearestNozzle(lat, lng);
  const assignedDistanceMeters = GeofenceCore.distanceToNozzle(lat, lng, assigned);
  const inside = GeofenceCore.pointInPolygon({ lat, lng });
  const away = assignedDistanceMeters > assignedRadiusMeters;

  if (away && !awayStartedAt) awayStartedAt = now;
  if (!away) awayStartedAt = null;

  const awaySeconds = awayStartedAt ? Math.round((now - awayStartedAt) / 1000) : 0;
  const alertType = !inside ? "outside" : awaySeconds >= awayAlertSeconds ? "away" : "inside";

  nearestNozzle.textContent = nearest.name;
  assignedDistance.textContent = `${Math.round(assignedDistanceMeters)} m`;
  accuracyText.textContent = position.coords.accuracy ? `+/- ${Math.round(position.coords.accuracy)} m` : "--";
  lastSent.textContent = new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  if (alertType === "outside") {
    setStatus("OUTSIDE BOUNDARY", "Return inside B1-B2-B3-B4.", "outside");
  } else if (alertType === "away") {
    setStatus("AWAY FROM NOZZLE", `Return near assigned ${assigned}.`, "away");
  } else {
    setStatus("INSIDE BOUNDARY", `Nearest nozzle is ${nearest.name}.`, "inside");
  }

  await channel.publish("location-update", {
    caId,
    name: document.querySelector("#caName").value.trim() || "CA",
    assigned,
    lat,
    lng,
    nearest: nearest.name,
    assignedDistanceMeters: Math.round(assignedDistanceMeters),
    accuracyMeters: position.coords.accuracy ? Math.round(position.coords.accuracy) : null,
    inside,
    alertType,
    awaySeconds,
    updatedAt: now
  });
}

function handleLocationError(error) {
  setStatus("Location error", error.message, "away");
}

function setStatus(title, hint, state) {
  statusText.textContent = title;
  statusHint.textContent = hint;
  statusCard.className = `phone-card status-card ${state}`;
}
