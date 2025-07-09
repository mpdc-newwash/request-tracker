const sheetURL = 'https://docs.google.com/spreadsheets/d/1ckq0Tqba3_7ZZf3DjqlYLH7WWikDrFM0KNw0gZ-n-FU/gviz/tq?tqx=out:json';
const endpointURL = 'https://script.google.com/macros/s/AKfycbwhlf_hdwcarqnHy4PxqcQ3SCO1j56mObyMJ_WzETZNlBrKr81_hk7au8WE0u6uY8W5qA/exec';

fetch(sheetURL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;
    const table = document.querySelector("#budgetTable tbody");

    rows.forEach((row, i) => {
      if (!row.c[2]) return; // skip empty rows

      const title = row.c[2]?.v || "";
      const fund = row.c[6]?.v || "";
      const status = row.c[13]?.v || ""; // Adjust if you added columns after col 12
      const remarks = row.c[14]?.v || "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${title}</td>
        <td>${fund}</td>
        <td>
          <select id="status-${i}" class="form-select">
            <option value="Pending">Pending</option>
            <option value="Approved" ${status === "Approved" ? "selected" : ""}>Approved</option>
            <option value="Not Approved" ${status === "Not Approved" ? "selected" : ""}>Not Approved</option>
          </select>
        </td>
        <td><input type="text" class="form-control" id="remarks-${i}" value="${remarks}"></td>
        <td><button class="btn btn-primary" onclick="submitUpdate(${i})">Submit</button></td>
      `;
      table.appendChild(tr);
    });
  });

function submitUpdate(rowIndex) {
  const status = document.querySelector(`#status-${rowIndex}`).value;
  const remarks = document.querySelector(`#remarks-${rowIndex}`).value;

  fetch(endpointURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateBudgetStatus",
      row: rowIndex + 2, // +2 because of 0-index and header row
      status,
      remarks
    })
  }).then(res => alert("Submitted!"));
}
