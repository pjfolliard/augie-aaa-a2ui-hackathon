# GEMINI.md — Augustana University (Sioux Falls, SD) Academic Advising Agent (AAA) A2UI Hackathon

This file provides automatic repository context to **Google Gemini CLI** ([`google-gemini/gemini-cli`](https://github.com/google-gemini/gemini-cli)) and Gemini Code Assist.

## 1. Mission & Context
You are assisting the VP for Innovation and the Director of Future Operations at **Augustana University in Sioux Falls, South Dakota (`augie.edu`)** during a **2-Hour Design-Build Hackathon** to design the **A2UI (Agent-to-UI)** interface for the campus-wide **Academic Advising Agent (AAA)** built on the **Google Agent Development Kit (ADK)**.

* **Focus:** This is a **UI/table/view design sprint**—designing *what* each of the 10 campus personas sees and acts on when asking their 10 canonical questions (`10 Personas × 10 Questions = 100 Views`), rather than backend SQL query logic.
* **Hypothetical Schema Notice:** All fields in `data/zion_schema_mapping.json` and `docs/views/default-views.js` are **hypothetical** today, awaiting the official field dictionary from **Zion Cloud Solutions** (arriving tonight/tomorrow). Always map table columns to a `zionField` code so they can be swapped seamlessly.

## 2. The 10 Augustana AAA Personas (`data/personas.json`)
1. `admin` — **Admin** (`All (University-Wide)`)
2. `provost` — **Provost** (`All (University-Wide)`)
3. `registrar` — **Registrar** (`All (Systems & Compliance)`)
4. `student_success` — **Student Success** (`All (Systems & Compliance)`)
5. `deans` — **Deans** (`All in School/College`)
6. `area_chair` — **Area Chair** (`All in Area (Arts & Sciences)`)
7. `program_director` — **Program Director** (`All in Program`)
8. `department_chair` — **Department Chair** (`All in Department`)
9. `advisor` — **Advisor** (`Assigned Advisees Only`)
10. `student` — **Student** (`Self Only`)

## 3. Mandatory Brand, Accessibility & International Student Rules
1. **Official Augustana University (Sioux Falls, SD) Brand Palette (Brand Guidelines pp. 17–19):**
   * Primary Blue / Navy (`PMS 282`, CMYK `100/82/10/64`, RGB `9/31/64`): `#081E3F` (`--augie-navy`)
   * Primary Yellow / Gold (`PMS 109`, CMYK `0/10/100/0`, RGB `255/209/0`): `#FED102` (`--augie-gold`)
   * Secondary Light Blue (`PMS 535`, RGB `141/158/188`): `#8D9EBC`
   * Accent Green (`PMS 576`): `#789D4A`, Accent Orange (`PMS 124`): `#EAAA00`, Light Gray (`PMS Cool Gray 3`): `#C8C9C7`, Dark Gray (`PMS Cool Gray 9`): `#A7A8A9`, Brown (`PMS 466`): `#C6AA76`
   * *(Never use Augustana Rock Island colors, and follow Page 19 & Page 26 logo color-break rules!)*
2. **Blind & Screen-Reader Users (WCAG 2.2 AA/AAA):**
   * Every `DataTable` component in `docs/views/default-views.js` MUST define `a11yCaption`, `a11ySummary`, and `rowHeaderKey`.
3. **Visually Impaired & Color-Blind Users:**
   * Every status badge or cell MUST include a leading icon (`✓`, `⚠`, `⛔`, `🌐`) + text label so status is never conveyed by color alone.
4. **Deaf & Hard-of-Hearing Users:**
   * 100% visual and text parity—never design audio-only notifications or voice-only workflows.
5. **International Students:**
   * Link US higher-ed terminology (`SOPHIA`, `DFW Rate`, `SAP`, `Hold`, `F-1 Full-Time Load`, `Prerequisite Override`, `Residency Requirement`) via `jargon` or `jargonTerms` properties, and include **F-1 Visa 12-credit full-time enrollment guardrails** when displaying course loads or drop simulations.

## 4. Key Files to Edit When Designing Views
* `docs/views/default-views.js` — Contains the A2UI JSON payloads (`surfaceUpdate`, `dataModelUpdate`, `beginRendering`) for all 10 personas.
* `data/zion_schema_mapping.json` — Maps hypothetical field keys to incoming **Zion Cloud Solutions** official fields and multilingual glossary definitions.
* `scripts/validate_project.py` — Run `python3 scripts/validate_project.py` after any edit to verify schema and WCAG 2.2 AAA compliance.
