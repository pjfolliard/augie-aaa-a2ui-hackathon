/**
 * Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA)
 * Google Workspace for Education Plus — Sheets A2UI Previewer Sidebar
 *
 * Compatible with Google's open-source Apps Script CLI (`clasp` — https://github.com/google/clasp).
 *
 * How to use in Google Sheets (`1V_U0lXWP40WdDWyacq8QM_emvrwOKWCsPOZzZnWLooo`):
 *   1. Open Extensions -> Apps Script.
 *   2. Paste this file into `Code.gs` and save.
 *   3. Reload the Google Sheet and click "Augustana AAA (A2UI)" -> "Open A2UI Persona Workbench".
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Augustana AAA (A2UI)")
    .addItem("Open A2UI Persona Workbench Sidebar", "showA2UISidebar")
    .addItem("Export Active Persona Row as A2UI Prompt", "exportSelectedRowPrompt")
    .addToUi();
}

function showA2UISidebar() {
  var html = HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<style>' +
    'body { font-family: Inter, Arial, sans-serif; margin: 0; padding: 14px; background: #f3f6fa; color: #081e3f; }' +
    '.hdr { background: #081e3f; color: #fff; padding: 12px; border-bottom: 4px solid #fed102; border-radius: 8px; margin-bottom: 12px; }' +
    '.badge { background: #fed102; color: #081e3f; font-weight: 700; padding: 2px 8px; border-radius: 99px; font-size: 11px; display: inline-block; }' +
    '.btn { display: block; width: 100%; min-height: 44px; padding: 10px; background: #081e3f; color: #fed102; font-weight: 700; text-align: center; text-decoration: none; border-radius: 8px; border: none; cursor: pointer; margin-top: 10px; box-sizing: border-box; }' +
    '.card { background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 10px; font-size: 13px; }' +
    '</style></head><body>' +
    '<div class="hdr">' +
    '<span class="badge">Sioux Falls, SD · WCAG 2.2 AA/AAA</span>' +
    '<h3 style="margin:6px 0 2px;">Augustana AAA — A2UI Studio</h3>' +
    '<div style="font-size:12px; color:#e2e8f0;">Google ADK + A2UI Hackathon Companion</div>' +
    '</div>' +
    '<div class="card">' +
    '<strong>Select any row (2–11) in the "AAA Persona Table" tab</strong> and click the button below to generate a ready-to-paste A2UI prompt for Gemini in Workspace or any coding agent.' +
    '<button class="btn" onclick="google.script.run.withSuccessHandler(renderPrompt).getSelectedPersonaPrompt()">Generate A2UI Prompt from Selected Row</button>' +
    '</div>' +
    '<div id="output" class="card" style="display:none; white-space:pre-wrap; font-family:monospace; font-size:11px; max-height:340px; overflow-y:auto;"></div>' +
    '<script>function renderPrompt(txt){ var el=document.getElementById("output"); el.style.display="block"; el.textContent=txt; }</script>' +
    '</body></html>'
  )
    .setTitle("Augustana AAA — A2UI Workbench")
    .setWidth(360);
  SpreadsheetApp.getUi().showSidebar(html);
}

function getSelectedPersonaPrompt() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AAA Persona Table");
  if (!sheet) return "Please switch to the 'AAA Persona Table' tab.";
  var row = sheet.getActiveRange().getRow();
  if (row < 2 || row > 11) row = 2;
  var values = sheet.getRange(row, 1, 1, 15).getValues()[0];
  var role = values[0];
  var scope = values[1];
  var sysPrompt = values[2];
  var questions = values.slice(5, 15).map(function(q, i) { return "Q" + (i + 1) + ": " + q; }).join("\n");

  return [
    "# Augustana University (Sioux Falls, SD) A2UI Persona Prompt",
    "Role: " + role,
    "Advising Scope: " + scope,
    "System Prompt: " + sysPrompt,
    "",
    "Canonical Questions:",
    questions,
    "",
    "Task: Design an accessible A2UI DataTable + KPIStatRow JSON view for this persona (using #081E3F Navy & #FED102 Gold, screen-reader <caption>, non-color status badges, plain-language higher-ed glossary, and F-1 12-credit safeguards)."
  ].join("\n");
}

function exportSelectedRowPrompt() {
  var prompt = getSelectedPersonaPrompt();
  SpreadsheetApp.getUi().alert("A2UI Coding-Agent Prompt", prompt, SpreadsheetApp.getUi().ButtonSet.OK);
}
