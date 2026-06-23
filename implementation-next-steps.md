# Geofencing Demo - What To Build Next

## The Correct Structure

You need two HTML pages:

1. **Supervisor Geofence HTML**
   - Used by the supervisor.
   - Shows all Collection Assistants.
   - Shows whether each CA is inside or outside B1-B2-B3-B4.
   - Shows which nozzle each CA is nearest to.
   - Shows alert if a CA goes outside the boundary or stays away from assigned nozzle too long.

2. **CA Tracking HTML**
   - Used by each Collection Assistant on their phone.
   - Gets the phone GPS location.
   - Checks whether the CA is inside the boundary.
   - Checks whether the CA is near assigned nozzle.
   - Alerts the CA if they go outside or stay away too long.
   - Sends the phone location to the supervisor dashboard.

## Important Point

Plain HTML can read **its own phone location** using the browser Geolocation API.

But the supervisor cannot see the CA phone location unless the CA page sends that location somewhere.

So the real demo needs:

- **Netlify** for HTTPS hosting.
- **Firebase Realtime Database** or **Supabase** for live location sharing.

Netlify alone is only the website host. It does not store or broadcast live phone locations by itself.

## Best Demo Setup

For your current goal, use:

- **Netlify**: hosts the HTML pages with HTTPS.
- **Firebase Realtime Database**: stores each CA's latest GPS location.

Why Firebase is best for this first demo:

- Simple for live location updates.
- Works well with plain HTML and JavaScript.
- Supervisor dashboard can receive live updates quickly.
- No custom server needed.

## How The Live Flow Works

1. CA opens `ca-tracker.html` on phone.
2. CA taps Start Tracking.
3. Phone asks for location permission.
4. CA phone gets GPS location.
5. CA page checks:
   - inside/outside B1-B2-B3-B4
   - nearest nozzle
   - distance from assigned nozzle
6. CA page writes latest location to Firebase.
7. Supervisor opens `supervisor-geofence.html`.
8. Supervisor page reads all CA locations from Firebase.
9. Supervisor sees live status and alerts.

## Demo Thresholds

For management demo, use short thresholds so the demo is easy to show:

- Outside boundary: alert immediately or after 10 seconds.
- Away from assigned nozzle: alert after 30 seconds.

For real production:

- Outside boundary: alert after 1-2 minutes, unless approved break.
- Away from assigned nozzle: alert after 3-5 minutes.
- Approved lunch: allow outside boundary for 1 hour.
- Tea break: allow outside boundary for 10 minutes.

## Files Needed

Minimum live demo files:

- `supervisor-geofence.html`
- `ca-tracker.html`
- `geofence-live.css`
- `geofence-live.js`
- Firebase project configuration

## Deployment Choice

Use Netlify first.

Steps:

1. Create the HTML files.
2. Add Firebase configuration.
3. Upload the folder to Netlify.
4. Open CA page on phone.
5. Open supervisor page on laptop.
6. Walk around the petrol pump and test live updates.

