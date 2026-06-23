const GeofenceCore = (() => {
  const boundary = [
    { name: "B1", lat: 10.091776, lng: 76.345603 },
    { name: "B2", lat: 10.091763, lng: 76.345831 },
    { name: "B3", lat: 10.091247, lng: 76.345600 },
    { name: "B4", lat: 10.091333, lng: 76.345304 }
  ];

  const nozzles = {
    N1: { lat: 10.091389, lng: 76.345498 },
    N2: { lat: 10.091441, lng: 76.345518 },
    N3: { lat: 10.091483, lng: 76.345555 },
    N4: { lat: 10.091547, lng: 76.345589 },
    N5: { lat: 10.091583, lng: 76.345628 },
    N6: { lat: 10.091681, lng: 76.345666 }
  };

  function pointInPolygon(point, polygon = boundary) {
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

  function nearestNozzle(lat, lng) {
    return Object.entries(nozzles)
      .map(([name, point]) => ({
        name,
        distance: distanceMeters(lat, lng, point.lat, point.lng)
      }))
      .sort((a, b) => a.distance - b.distance)[0];
  }

  function distanceToNozzle(lat, lng, nozzleName) {
    const nozzle = nozzles[nozzleName];
    if (!nozzle) return null;
    return distanceMeters(lat, lng, nozzle.lat, nozzle.lng);
  }

  function mapPosition(lat, lng) {
    const minLat = Math.min(...boundary.map((point) => point.lat));
    const maxLat = Math.max(...boundary.map((point) => point.lat));
    const minLng = Math.min(...boundary.map((point) => point.lng));
    const maxLng = Math.max(...boundary.map((point) => point.lng));
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(-12, Math.min(112, x)),
      y: Math.max(-12, Math.min(112, y))
    };
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
    return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function toRadians(value) {
    return (value * Math.PI) / 180;
  }

  return { boundary, nozzles, pointInPolygon, nearestNozzle, distanceToNozzle, mapPosition };
})();
