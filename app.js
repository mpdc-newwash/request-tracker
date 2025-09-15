const sheetID = '1ckq0Tqba3_7ZZf3DjqlYLH7WWikDrFM0KNw0gZ-n-FU';
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

let tableData = [];
let filteredData = [];
const rowsPerPage = 20;
let currentPage = 1;

fetch(sheetURL)
  .then(res => res.text())
  .then(data => {
    const json = JSON.parse(data.substr(47).slice(0, -2));
    const rows = json.table.rows;

    // --- Map rows to objects ---
    tableData = rows.map(row => ({
      timestamp: row.c[0]?.f || '',
      title: row.c[2]?.v || '',
      description: row.c[3]?.v || '',
      fundSource: row.c[6]?.v || '',
      office: row.c[10]?.v || '',
      submittedBy: row.c[11]?.v || '',
      status: row.c[13]?.v || ''
    }));

    // --- Sort by timestamp (latest first) ---
    tableData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Set filteredData initially to full dataset
    filteredData = [...tableData];

    renderTable();
    renderPagination();

    // --- Search filter ---
    document.getElementById('search').addEventListener('input', function () {
      const keyword = this.value.toLowerCase();
      filteredData = tableData.filter(item =>
        Object.values(item).some(val => val.toLowerCase().includes(keyword))
      );

      currentPage = 1; // reset to page 1 after search
      renderTable();
      renderPagination();
    });
  });

// --- Render Table Function ---
function renderTable() {
  const table = document.getElementById("data-table");
  table.innerHTML = '';

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredData.slice(start, end);

  if (pageData.length === 0) {
    table.innerHTML = `<tr id="no-results">
      <td colspan="7" class="text-center text-muted">No matching results found.</td>
    </tr>`;
    return;
  }

  pageData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.timestamp}</td>
      <td>${item.title}</td>
      <td>${item.description}</td>
      <td>${item.fundSource}</td>
      <td>${item.office}</td>
      <td>${item.submittedBy}</td>
      <td><span class="badge ${getStatusClass(item.status)}">${item.status}</span></td>
    `;
    table.appendChild(tr);
  });
}

// --- Render Pagination Buttons ---
function renderPagination() {
  let container = document.getElementById("pagination");
  if (!container) {
    container = document.createElement("div");
    container.id = "pagination";
    container.className = "d-flex justify-content-center gap-2 my-3 flex-wrap";
    document.querySelector(".container").appendChild(container);
  }
  container.innerHTML = '';

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable();
      renderPagination();
    });
    container.appendChild(btn);
  }
}

// --- Status Badge Helper ---
function getStatusClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'pending': return 'bg-warning text-dark';
    case 'in progress': return 'bg-primary';
    case 'done': return 'bg-success';
    default: return 'bg-secondary';
  }
}
