const caList = [
  { id: "CA1", name: "Arjun", assigned: "N1", nearest: "N1", status: "inside", alert: "Normal", x: 31, y: 75 },
  { id: "CA2", name: "Sameer", assigned: "N3", nearest: "N3", status: "inside", alert: "Normal", x: 43, y: 54 },
  { id: "CA3", name: "Navas", assigned: "N5", nearest: "N5", status: "inside", alert: "Normal", x: 55, y: 35 },
  { id: "CA4", name: "Rafi", assigned: "N6", nearest: "N6", status: "outside", alert: "Outside boundary", x: 108, y: 64 }
];

const normalPositions = [
  { x: 31, y: 75, nearest: "N1" },
  { x: 43, y: 54, nearest: "N3" },
  { x: 55, y: 35, nearest: "N5" },
  { x: 61, y: 23, nearest: "N6" }
];

function render() {
  const markerLayer = document.querySelector("#caMarkers");
  const rows = document.querySelector("#caRows");
  const inside = caList.filter((ca) => ca.status === "inside").length;
  const alerts = caList.filter((ca) => ca.status !== "inside").length;

  document.querySelector("#totalCount").textContent = caList.length;
  document.querySelector("#insideCount").textContent = inside;
  document.querySelector("#alertCount").textContent = alerts;

  markerLayer.innerHTML = caList.map((ca) => {
    const markerClass = ca.status === "outside" ? "danger" : ca.status === "away" ? "warn" : "";
    return `<span class="ca-marker ${markerClass}" style="left:${ca.x}%;top:${ca.y}%;" title="${ca.name}">${ca.id.replace("CA", "")}</span>`;
  }).join("");

  rows.innerHTML = caList.map((ca) => {
    const badgeClass = ca.status === "outside" ? "danger" : ca.status === "away" ? "warn" : "good";
    const statusText = ca.status === "outside" ? "Outside boundary" : ca.status === "away" ? "Away from assigned nozzle" : "Inside boundary";
    return `
      <tr>
        <td><strong>${ca.name}</strong><br>${ca.id}</td>
        <td>${ca.assigned}</td>
        <td>${ca.nearest}</td>
        <td><span class="badge ${badgeClass}">${statusText}</span></td>
        <td><span class="badge ${badgeClass}">${ca.alert}</span></td>
      </tr>
    `;
  }).join("");
}

document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.demo === "inside") {
      caList.forEach((ca, index) => {
        ca.status = "inside";
        ca.alert = "Normal";
        ca.x = normalPositions[index].x;
        ca.y = normalPositions[index].y;
        ca.nearest = normalPositions[index].nearest;
      });
    }

    if (button.dataset.demo === "outside") {
      caList[1].status = "outside";
      caList[1].alert = "Outside boundary";
      caList[1].x = 111;
      caList[1].y = 58;
      caList[1].nearest = "N3";
    }

    if (button.dataset.demo === "away") {
      caList[2].status = "away";
      caList[2].alert = "Away 5 min";
      caList[2].x = 82;
      caList[2].y = 78;
      caList[2].nearest = "N1";
    }

    render();
  });
});

render();
