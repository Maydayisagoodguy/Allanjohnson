const boundary = [
  { name: "B1", lat: 10.091776, lng: 76.345603 },
  { name: "B2", lat: 10.091763, lng: 76.345831 },
  { name: "B3", lat: 10.091247, lng: 76.345600 },
  { name: "B4", lat: 10.091333, lng: 76.345304 }
];

const nozzles = [
  { name: "N1", lat: 10.091389, lng: 76.345498, x: 455, y: 725 },
  { name: "N2", lat: 10.091441, lng: 76.345518, x: 492, y: 640 },
  { name: "N3", lat: 10.091483, lng: 76.345555, x: 515, y: 545 },
  { name: "N4", lat: 10.091547, lng: 76.345589, x: 535, y: 455 },
  { name: "N5", lat: 10.091583, lng: 76.345628, x: 555, y: 360 },
  { name: "N6", lat: 10.091681, lng: 76.345666, x: 575, y: 250 }
];

const statusCard = document.querySelector("#statusCard");
const statusText = document.querySelector("#statusText");
const statusHint = document.querySelector("#statusHint");
const latText = document.querySelector("#latText");
const lngText = document.querySelector("#lngText");
const accuracyText = document.querySelector("#accuracyText");
const nearestNozzle = document.querySelector("#nearestNozzle");
const nearestDistance = document.querySelector("#nearestDistance");
const phoneMarker = document.querySelector("#phoneMarker");

let watchId = null;
let audioContext = null;
let alarmTimer = null;

document.querySelector("#startTracking").addEventListener("click", async () => {
  unlockAudio();

  if (!navigator.geolocation) {
    setStatus("GPS unavailable", "This browser does not support live location.", "waiting");
    return;
  }

  if (watchId !== null) navigator.geolocation.clearWatch(watchId);

  setStatus("Tracking...", "Allow location access and keep this page open.", "waiting");
  watchId = navigator.geolocation.watchPosition(
    handlePosition,
    (error) => {
      setStatus("Location error", error.message, "outside");
      startAlarm();
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    }
  );
});

document.querySelector("#stopAlarm").addEventListener("click", stopAlarm);

function handlePosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  const inside = pointInPolygon({ lat, lng }, boundary);
  const nearest = getNearestNozzle(lat, lng);

  latText.textContent = lat.toFixed(6);
  lngText.textContent = lng.toFixed(6);
  accuracyText.textContent = accuracy ? `+/- ${Math.round(accuracy)} m` : "--";
  nearestNozzle.textContent = nearest.name;
  nearestDistance.textContent = `${Math.round(nearest.distance)} m`;

  setStatus(
    inside ? "INSIDE BOUNDARY" : "OUTSIDE BOUNDARY",
    inside
      ? `Phone is inside the petrol pump geofence and nearest to ${nearest.name}.`
      : "Phone crossed the green boundary. Alarm is active.",
    inside ? "inside" : "outside"
  );

  moveMarker(lat, lng, inside);

  if (inside) {
    stopAlarm();
  } else {
    startAlarm();
  }
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersects =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function getNearestNozzle(lat, lng) {
  return nozzles
    .map((nozzle) => ({
      ...nozzle,
      distance: distanceMeters(lat, lng, nozzle.lat, nozzle.lng)
    }))
    .sort((a, b) => a.distance - b.distance)[0];
}

function moveMarker(lat, lng, inside) {
  const bounds = {
    minLat: Math.min(...boundary.map((point) => point.lat)),
    maxLat: Math.max(...boundary.map((point) => point.lat)),
    minLng: Math.min(...boundary.map((point) => point.lng)),
    maxLng: Math.max(...boundary.map((point) => point.lng))
  };

  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 505 + 345;
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 660 + 165;
  const clampedX = Math.max(250, Math.min(920, x));
  const clampedY = Math.max(120, Math.min(880, y));

  phoneMarker.style.left = `${(clampedX / 1400) * 100}%`;
  phoneMarker.style.top = `${(clampedY / 1000) * 100}%`;
  phoneMarker.className = `phone-marker ${inside ? "inside" : "outside"}`;
}

function setStatus(title, hint, state) {
  statusText.textContent = title;
  statusHint.textContent = hint;
  statusCard.className = `status-card ${state}`;
}

function unlockAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioContext) audioContext = new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();
  } catch {
    audioContext = null;
  }
}

function startAlarm() {
  if (alarmTimer || !audioContext) return;
  alarmTimer = window.setInterval(() => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.09;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.18);
  }, 650);
}

function stopAlarm() {
  if (alarmTimer) {
    window.clearInterval(alarmTimer);
    alarmTimer = null;
  }
}

function distanceMeters(lat1, lon1, lat2, lon2) {
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
