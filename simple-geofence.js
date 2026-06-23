const centerLatInput = document.querySelector("#centerLat");
const centerLngInput = document.querySelector("#centerLng");
const radiusInput = document.querySelector("#radius");
const statusCard = document.querySelector("#statusCard");
const statusText = document.querySelector("#statusText");
const statusHint = document.querySelector("#statusHint");
const currentLat = document.querySelector("#currentLat");
const currentLng = document.querySelector("#currentLng");
const distanceText = document.querySelector("#distanceText");
const accuracyText = document.querySelector("#accuracyText");
const person = document.querySelector("#person");

let watchId = null;

document.querySelector("#useCurrentAsCenter").addEventListener("click", () => {
  if (!navigator.geolocation) {
    setStatus("Location not supported", "This browser does not support GPS location.", "waiting");
    return;
  }

  setStatus("Getting center...", "Please allow location access.", "waiting");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      centerLatInput.value = position.coords.latitude.toFixed(6);
      centerLngInput.value = position.coords.longitude.toFixed(6);
      setStatus("Geofence center set", "Now press Start Tracking.", "waiting");
    },
    (error) => setStatus("Location blocked", error.message, "outside"),
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
});

document.querySelector("#startTracking").addEventListener("click", () => {
  const center = getCenter();
  if (!center) {
    setStatus("Set geofence first", "Enter the compound coordinates or use current location as center.", "waiting");
    return;
  }

  if (!navigator.geolocation) {
    setStatus("Location not supported", "This browser does not support GPS location.", "waiting");
    return;
  }

  if (watchId !== null) navigator.geolocation.clearWatch(watchId);

  setStatus("Tracking...", "Waiting for live GPS update.", "waiting");
  watchId = navigator.geolocation.watchPosition(
    updatePosition,
    (error) => setStatus("Location error", error.message, "outside"),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
  );
});

function updatePosition(position) {
  const center = getCenter();
  if (!center) return;

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const radius = Number(radiusInput.value) || 80;
  const distance = distanceInMeters(center.lat, center.lng, lat, lng);
  const inside = distance <= radius;

  currentLat.textContent = lat.toFixed(6);
  currentLng.textContent = lng.toFixed(6);
  distanceText.textContent = `${Math.round(distance)} m`;
  accuracyText.textContent = position.coords.accuracy ? `+/- ${Math.round(position.coords.accuracy)} m` : "--";

  setStatus(
    inside ? "INSIDE GEOFENCE" : "OUTSIDE GEOFENCE",
    inside
      ? "The phone is inside the designated petrol pump area."
      : "The phone has moved outside the designated petrol pump area.",
    inside ? "inside" : "outside"
  );

  moveMarker(distance, radius, lat >= center.lat ? -1 : 1, lng >= center.lng ? 1 : -1, inside);
}

function getCenter() {
  const lat = Number(centerLatInput.value);
  const lng = Number(centerLngInput.value);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function setStatus(title, hint, state) {
  statusText.textContent = title;
  statusHint.textContent = hint;
  statusCard.className = `status-card ${state === "inside" ? "inside" : state === "outside" ? "outside" : ""}`;
}

function moveMarker(distance, radius, latDirection, lngDirection, inside) {
  const maxOffset = 170;
  const scale = Math.min(distance / radius, 1.45);
  const offset = scale * 84;
  const left = 50 + lngDirection * Math.min(offset, maxOffset);
  const top = 50 + latDirection * Math.min(offset, maxOffset);
  person.style.left = `${left}%`;
  person.style.top = `${top}%`;
  person.className = `person ${inside ? "inside" : "outside"}`;
}

function distanceInMeters(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}
