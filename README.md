MPDC Program Design Request Tracker - Technical Documentation
Overview
This system automates LGU New Washington's Municipal Planning and Development Office's
(MPDC) program proposal intake and documentation workflow using a Google Forms-based
frontend, Google Apps Script automation, and a Bootstrap-styled frontend dashboard.
Tech Stack:
- Google Forms and Google Sheets
- Google Apps Script (serverless automation)
- HTML/CSS with Bootstrap 5
- Vanilla JS using Google Sheets JSON API (GViz)
- GitHub version control
- Local static hosting (for dashboard)
Google Form Structure
The Google Form accepts the following fields (indexed for processing):
0: Timestamp
1: Email Address
2: Program Design Title
3: Program Description
4: Total Budget Needed
5: Financial Requirements
6: Budget/Source of Fund
7: Date of your Event
8: Participants/Beneficiaries Info
9: Resource Speaker Info
10: Requesting Office
11: Submitted By
12: Status (auto-handled)
13: Generated File ID (auto-handled)
14: Approval Email Sent?
15: Client Approval Response
16: Location or Venue of Project
Google Apps Script - onFormSubmit Trigger
function onFormSubmit(e) {
 const responses = e.values;
 const fieldMap = {
 "{{Timestamp}}": responses[0],
 "{{Program_Title}}": responses[2]?.toUpperCase(),
 ...
 };
MPDC Program Design Request Tracker - Technical Documentation
 const copy = DriveApp.getFileById(TEMPLATE_ID).makeCopy(...);
 const doc = DocumentApp.openById(copy.getId());
 const body = doc.getBody();
 for (const key in fieldMap) {
 body.replaceText(key, fieldMap[key]);
 }
 ...
}
Google Apps Script - onEdit Logic
Triggers on manual edits in the 'Status' or 'Client Approval Response' columns.
- If Status is changed to 'for checking': sends draft email to client.
- If Client Approval Response is 'yes': moves file to Approved folder.
Dashboard Frontend - app.js
fetch(sheetURL)
 .then(res => res.text())
 .then(data => {
 const json = JSON.parse(data.substr(47).slice(0, -2));
 const rows = json.table.rows;
 rows.forEach(row => {
 const status = row.c[13]?.v || "";
 table.appendChild(...);
 });
 });
Deployment Notes
- Google Sheet must be published to the web to expose JSON endpoint.
- Google Apps Script must be deployed as Editor-level for Docs/Drive access.
- GitHub repo is private; local HTML dashboard is viewed via browser.
Maintenance
- Add/remove fields via Form, then update index references in onFormSubmit()
- Document template IDs and folder IDs must be updated if moved.
- Check Apps Script executions for errors if mail/file actions fail.
