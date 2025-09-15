const sheetID = '1ckq0Tqba3_7ZZf3DjqlYLH7WWikDrFM0KNw0gZ-n-FU';
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

fetch(sheetURL)
  .then(res => res.text())
  .then(data => {
    const json = JSON.parse(data.substr(47).slice(0, -2));
    let rows = json.table.rows;

    // --- Map rows to objects for easier handling ---
    let tableData = rows.map(row => ({
      timestamp: row.c[0]?.f || '',
      title: row.c[2]?.v || '',
      description: row.c[3]?.v || '',
      fundSource: row.c[6]?.v || '',
      office: row.c[10]?.v || '',
      submittedBy: row.c[11]?.v || '',
      status: row.c[13]?.v || ''
    }));

    // --- Sort by timestamp descending (latest first) ---
    tableData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // --- Limit to latest 20 entries ---
    tableData = tableData.slice(0, 20);

    const table = document.getElementById("data-table");
    renderTable(tableData, table);

    // --- Search filter ---
    document.getElementById('search').addEventListener('input', function () {
      const keyword = this.value.toLowerCase();
      let matchFound = false;

      Array.from(table.getElementsByTagName('tr')).forEach(row => {
        const text = row.innerText.toLowerCase();
        const isMatch = text.includes(keyword);
        row.style.display = isMatch ? '' : 'none';
        if (isMatch) matchFound = true;
      });

      const noResultsRow = document.getElementById('no-results');
      if (noResultsRow) noResultsRow.style.display = matchFound ? 'none' : '';
    });
  });

// --- Render Table Function ---
function renderTable(data, table) {
  table.innerHTML = ''; // Clear existing rows
  data.forEach(item => {
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

function getStatusClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'pending': return 'bg-warning text-dark';
    case 'in progress': return 'bg-primary';
    case 'done': return 'bg-success';
    default: return 'bg-secondary';
  }
}
