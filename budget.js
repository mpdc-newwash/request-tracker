const sheetURL = 'https://docs.google.com/spreadsheets/d/1ckq0Tqba3_7ZZf3DjqlYLH7WWikDrFM0KNw0gZ-n-FU/gviz/tq?tqx=out:json';
const endpointURL = 'https://script.google.com/macros/s/AKfycbwhlf_hdwcarqnHy4PxqcQ3SCO1j56mObyMJ_WzETZNlBrKr81_hk7au8WE0u6uY8W5qA/exec';


fetch(sheetURL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;
    const table = document.querySelector("#budgetTable tbody");

    rows.forEach((row, i) => {
      if (!row.c[2]) return; // Skip empty rows

      const title = row.c[2]?.v || "";
      const fund = row.c[6]?.v || "";
      const status = row.c[18]?.v || "";
      const remarks = row.c[19]?.v || "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${title}</td>
        <td>${fund}</td>
        <td>
          <select id="status-${i}" class="form-select">
            <option value="Pending" ${status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Approved" ${status === "Approved" ? "selected" : ""}>Approved</option>
            <option value="Not Approved" ${status === "Not Approved" ? "selected" : ""}>Not Approved</option>
          </select>
        </td>
        <td><input type="text" class="form-control" id="remarks-${i}" value="${remarks}"></td>
        <td><button class="btn btn-primary" id="submit-btn-${i}" onclick="submitUpdate(${i})">Submit</button></td>
      `;
      table.appendChild(tr);
    });
  });

function submitUpdate(rowIndex) {
  const status = document.querySelector(`#status-${rowIndex}`).value;
  const remarks = document.querySelector(`#remarks-${rowIndex}`).value;
  const submitBtn = document.querySelector(`#submit-btn-${rowIndex}`);

  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

  fetch(endpointURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateBudgetStatus",
      row: rowIndex + 2,
      status,
      remarks
    })
  })
    .then(res => res.text())
    .then(response => {
      if (response.includes("Success")) {
        submitBtn.classList.remove("btn-primary");
        submitBtn.classList.add("btn-success");
        submitBtn.innerText = "Saved!";
      } else {
        throw new Error("Unexpected response: " + response);
      }
    })
    .catch(err => {
      submitBtn.classList.remove("btn-primary");
      submitBtn.classList.add("btn-danger");
      submitBtn.innerText = "Error!";
      console.error("Submission failed:", err);
      alert("Failed to save. Please try again or contact MPDC.");
    })
    .finally(() => {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove("btn-success", "btn-danger");
        submitBtn.classList.add("btn-primary");
        submitBtn.innerText = "Submit";
      }, 2000);
    });
}
