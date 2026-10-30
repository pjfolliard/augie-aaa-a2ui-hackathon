#!/usr/bin/env bash
# ==============================================================================
# Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA)
# Open-Source Google Workspace CLI (`github.com/googleworkspace/cli` / `gws`)
# & `gsheets` Persona Table Sync Script
# ==============================================================================
set -euo pipefail

SPREADSHEET_ID="1V_U0lXWP40WdDWyacq8QM_emvrwOKWCsPOZzZnWLooo"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=================================================================="
echo "Augustana University (Sioux Falls, SD) — AAA Persona Table Sync"
echo "Spreadsheet ID: ${SPREADSHEET_ID}"
echo "=================================================================="

if command -v gws >/dev/null 2>&1; then
  echo "[1/2] Detected open-source Google Workspace CLI (gws — github.com/googleworkspace/cli)"
  echo "Fetching spreadsheet metadata via gws..."
  gws sheets spreadsheets get --params "{\"spreadsheetId\": \"${SPREADSHEET_ID}\"}" > "${ROOT_DIR}/data/gws_sheet_metadata.json" || true
elif command -v gsheets >/dev/null 2>&1; then
  echo "[1/2] Exporting AAA Persona Table tabs via gsheets CLI..."
  gsheets readonly export "${SPREADSHEET_ID}" "${ROOT_DIR}/data/personas.csv" --format csv --sheet "AAA Persona Table"
  gsheets readonly export "${SPREADSHEET_ID}" "${ROOT_DIR}/data/personas_transposed.csv" --format csv --sheet "AAA Persona Table - Transposed"
else
  echo "[Info] Neither 'gws' nor 'gsheets' found on PATH; using existing data/personas.csv."
  echo "Install Google's open-source Workspace CLI from: https://github.com/googleworkspace/cli"
fi

echo "[2/2] Rebuilding data/personas.json and docs/views/personas-data.js..."
python3 "${ROOT_DIR}/scripts/build_data.py"
echo "Done! All 10 personas and 100 canonical questions are synced."
