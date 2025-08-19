const sheetID = '1ckq0Tqba3_7ZZf3DjqlYLH7WWikDrFM0KNw0gZ-n-FU';
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

fetch(sheetURL)
  .then(res => res.text())
  .then(data => {
    const json = JSON.parse(data.substr(47).slice(0, -2));
    const rows = json.table.rows;
    const table = document.getElementById("data-table");

    rows.forEach(row => {
      const timestamp = row.c[0]?.f || '';         // Timestamp
      const title = row.c[2]?.v || '';             // Program Title
     // const description = row.c[3]?.v || '';       // Program Description
      const fundSource = row.c[6]?.v || '';        // Budget Source
      const office = row.c[10]?.v || '';           // Requesting Office
      const submittedBy = row.c[11]?.v || '';      // Submitted By
      const status = row.c[13]?.v || '';           // Status

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${timestamp}</td>
        <td>${title}</td>
        <td>${description}</td>
        <td>${fundSource}</td>
        <td>${office}</td>
        <td>${submittedBy}</td>
        <td><span class="badge ${getStatusClass(status)}">${status}</span></td>
      `;
      table.appendChild(tr);
    });

    // Search filter
    document.getElementById('search').addEventListener('input', function () {
      const keyword = this.value.toLowerCase();
      const rows = table.getElementsByTagName('tr');
      let matchFound = false;

      Array.from(rows).forEach(row => {
        const text = row.innerText.toLowerCase();
        const isMatch = text.includes(keyword);
        row.style.display = isMatch ? '' : 'none';
        if (isMatch) matchFound = true;
      });

      const noResultsRow = document.getElementById('no-results');
      if (noResultsRow) {
        noResultsRow.style.display = matchFound ? 'none' : '';
      }
    });
  });

function getStatusClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'pending': return 'bg-warning text-dark';
    case 'in progress': return 'bg-primary';
    case 'done': return 'bg-success';
    default: return 'bg-secondary';
  }
}
