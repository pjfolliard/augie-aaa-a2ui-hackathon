---
name: augie-a2ui-design
description: Official Augustana University (Sioux Falls, SD) A2UI + Google ADK Academic Advising Interface Design Skill. Enforces AI best-practice A2UI layout archetypes (Inverted-Pyramid, Split Action Dashboard, Table-First Focus), Brand Guidelines (PMS 282 Navy #081E3F & PMS 109 Yellow #FED102, ITC Garamond & Myriad Pro/Gotham, logo clear-field rules), WCAG 2.2 AA/AAA accessibility (blind screen-reader captions/row headers, color-blind icon+text badges, deaf visual parity), international student F-1 12-credit guardrails + multilingual jargon decoder, and Zion Cloud Solutions schema mapping. Use whenever designing, generating, reviewing, or updating A2UI views, tables, personas, or ADK prompts in this repository.
---

# Augustana University (Sioux Falls, SD) — A2UI + ADK Best-Practices Skill

This skill encodes the complete UI/UX, brand, accessibility, international student, and data-mapping best practices for the **Augustana University Academic Advising Agent (AAA)**.

---

## 1. Philosophy: Start with the AI Best-Practice Baseline ("Edit, Don't Invent from Scratch")

During a 2-hour design sprint across **10 Personas × 10 Questions = 100 Views**, campus stakeholders (Deans, Registrar, Advisors, Students) should never start from a blank canvas:
1. **Generate the AI Best-Practice View First:** Automatically select the optimal **Layout Archetype**, **4 KPI Cards**, **5–7 High-Signal Table Columns**, **Row Actions**, and **ActionFormCard** tailored to the persona's RBAC scope and active question (`Q1`–`Q10`).
2. **Human-in-the-Loop Refinement:** Stakeholders react to the live rendered surface—adding/removing a column in the Visual Table Designer or tweaking an action button—while the agent guarantees zero regressions in accessibility or brand compliance.

---

## 2. Optimal A2UI Layout Archetype Matrix (By Persona & Task)

Always choose the layout mode that matches the persona's cognitive workflow:

| Layout Mode (`layoutMode`) | Component Structure | Default Personas | Why AI Recommends This Layout |
| :--- | :--- | :--- | :--- |
| **`inverted-pyramid`** *(Triage Stack)* | `AlertBanner` → `KPIStatRow` → `DataTable` → `DegreeProgressCard` / `ActionFormCard` | `student`, `provost`, `admin` *(and all 125%–150% Low-Vision Zoom or Screen-Reader sessions)* | Puts critical blockers (`⛔ Hold`, `🌐 F-1 <12 Cr Warning`) at the top, followed by 4 summary KPIs, the primary table, and the action form. Strictly linear DOM order for JAWS/NVDA/VoiceOver. |
| **`split-dashboard`** *(Side-by-Side Action Grid)* | Top: `AlertBanner` + `KPIStatRow`<br>Split (`Row` `1.65fr : 1fr`): Left `DataTable` \| Right `DegreeProgressCard` + `ActionFormCard` | `advisor`, `deans`, `area_chair`, `program_director` | Allows an advisor, chair, or dean to inspect a student/course row on the left while simultaneously submitting a Prerequisite Override, Hold Clearance, or Course Substitution on the right without scrolling. Automatically reflows to 1 column at 125%–150% zoom (`WCAG 2.2 SC 1.4.10`). |
| **`table-first`** *(High-Density Roster Focus)* | `DataTable` pinned at top → `AlertBanner` → `KPIStatRow` → `ActionFormCard` | `registrar`, `student_success`, `department_chair` | Maximizes above-the-fold rows for high-density compliance audits (graduation clearance, DFW bottleneck tables, caseload rosters, and section waitlists). |

### Column & Component Density Rules
* **5 to 7 Columns Maximum per `DataTable`:** Keeps tables readable on 13"–15" laptops without horizontal clipping.
* **Column 1 = `rowHeaderKey`:** Always put the primary entity identifier (`student_name`, `course_code`, `department`, `unit_name`) in Column 1 so it renders as `<th scope="row">`.
* **Rightmost Column = `rowActions`:** Limit row-level buttons to **1–2 high-frequency actions** (44px+ tap height) so rows do not wrap excessively.
* **4 Cards per `KPIStatRow`:** Each KPI card must include `label`, `value`, `delta` (with non-color directional prefix `▲`, `▼`, `✓`, `⚠`, `⛔`), `status`, and `icon`.

---

## 3. Official Augustana University (Sioux Falls, SD) Brand Guidelines (`augie.edu`)

Follow the [Augustana University Brand Guidelines & Requirements](https://issuu.com/augustanacollegesd/docs/augustana_university_brand_guidelines_requiremen) (pp. 4, 11, 16–20, 26–28, 35):

1. **Approved Color Palette (pp. 17–18):**
   * **Primary Blue (Navy — `PMS 282`):** `CMYK 100/82/10/64` · `RGB 9/31/64` · **`#081E3F`** (`--augie-navy`)
   * **Primary Yellow (Gold — `PMS 109`):** `CMYK 0/10/100/0` · `RGB 255/209/0` · **`#FED102`** (`--augie-gold`)
   * **Secondary Light Blue (`PMS 535`):** `CMYK 40/30/5/0` · `RGB 141/158/188` · **`#8D9EBC`** (`--augie-light-blue`)
   * **Approved Accents (p. 18 — highlight use only, never dominant):**
     * Green (`PMS 576`): `#789D4A`
     * Orange (`PMS 124`): `#EAAA00`
     * Light Gray (`PMS Cool Gray 3`): `#C8C9C7`
     * Dark Gray (`PMS Cool Gray 9`): `#A7A8A9`
     * Brown (`PMS 466`): `#C6AA76`
   * *(Never use Augustana College Rock Island colors or refer to the university as "Augustana College" — p. 4.)*
2. **Logo Usage & Color Breaks (pp. 16, 19, 26, 27, 35):**
   * **On Navy (`#081E3F`) Background:** `"A"` is **PMS 109 Yellow (`#FED102`)**; interlocking `"U"` and `"AUGUSTANA UNIVERSITY"` are **White (`#FFFFFF`)** (`docs/assets/augustana-university-logo.png`). Never invert the `"A"` and `"U"` color break (p. 26).
   * **On White (`#FFFFFF`) Background:** `"A"` and `"AUGUSTANA UNIVERSITY"` are **PMS 282 Navy (`#081E3F`)**; interlocking `"U"` is **PMS 109 Yellow (`#FED102`)** (`docs/assets/augustana-logo-on-white.png`).
   * **No Enclosing Shapes & Clear Field (pp. 16, 27):** Never enclose the `AU` logo in a box/shape that suggests it is part of the logo, and preserve a clear field around the logo at least equal to the height of the `"A"` in `"Augustana"`.
   * **Academic vs. Athletic Marks (p. 35):** Never substitute the athletic Viking head (`docs/assets/viking-logo.png`) for the institutional `AU AUGUSTANA UNIVERSITY` logo in academic headers.
3. **Typography (p. 28):**
   * **Serif (`--font-serif`):** `ITC Garamond Std` / `ITC Garamond` (with `EB Garamond` / `Garamond` fallback).
   * **Sans-Serif (`--font-sans`):** `Myriad Pro` and approved alternative `Gotham` (with `Inter` fallback).

---

## 4. Universal Accessibility & International Student Rules (WCAG 2.2 AA/AAA)

1. **Blind & Screen-Reader Users:**
   * Every `DataTable` MUST define `a11yCaption` (spoken purpose of the table), `a11ySummary` (keyboard sorting & navigation instructions), and `rowHeaderKey` (`<th scope="row">`).
2. **Visually Impaired & Color-Blind Users:**
   * Every status badge (`type: "badge"`) and KPI delta MUST lead with a semantic icon + explicit label (`✓ Clear`, `⚠ Watch`, `⛔ Hold / Action Required`, `🌐 F-1 International`) so status is never conveyed by color alone.
   * Maintain `16.6:1` (Navy `#081E3F` on White `#FFFFFF`) and `11.3:1` (Navy `#081E3F` on Gold `#FED102`) contrast (> `7.0:1` WCAG 2.2 AAA).
3. **Deaf & Hard-of-Hearing Users:**
   * 100% visual and text parity—all alerts, holds, and action confirmations must appear as persistent visual banners/toasts and text transcripts (never audio-only cues).
4. **International Students (F-1 Visa & Plain-Language Jargon):**
   * Tag US higher-ed terminology (`SOPHIA`, `DFW Rate`, `SAP`, `Hold`, `F-1 Full-Time Load`, `Prerequisite Override`, `Residency Requirement`) via `jargon` on table columns and `jargonTerms` on `AlertBanner` so the multilingual decoder (English, Spanish, Mandarin, Nepali, Amharic) renders inline explanations.
   * Always surface the **12-credit F-1 full-time enrollment guardrail** whenever course drops, credit loads, or registration blocks are shown for international students.

---

## 5. Zion Cloud Solutions — A2UI v0.9 in Gemini Enterprise Specification ("What You Can and Can't Do")

Every A2UI view and ADK agent configuration in this repository follows **Zion Cloud Solutions'** official Gemini Enterprise A2UI v0.9 architecture specification:

### A. Protocol Version, Catalog ID & A2A Extension
* **Version:** Always declare `"version": "v0.9"` on every A2UI message (`v0.9.1` is **not** supported in Gemini Enterprise).
* **Composite Catalog ID:** `https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json`
* **A2A Extension (`adk_agent/agent_card.json`):** `https://a2ui.org/a2a-extension/a2ui/v0.9` on **A2A v0.3**.
* **Four Messages Out, One Back (`docs/assets/a2ui-v09-lifecycle.png`):**
  1. `createSurface` — opens a named surface with `catalogId` and `sendDataModel: true`.
  2. `updateComponents` (`surfaceUpdate`) — streams the flat component list (`root` + parent/child IDs).
  3. `updateDataModel` (`dataModelUpdate`) — populates or mutates JSON Pointer paths (`/rows`, `/kpis`).
  4. `deleteSurface` — removes the surface when the workflow concludes.
  * **Inbound:** `action` — returns the user's button click or form submission (`name`, `surfaceId`, `sourceComponentId`, `context`).

### B. 69 Built-In Gemini Enterprise Catalog Components
| Family | Official Components | Augustana AAA Advising Mapping |
| :--- | :--- | :--- |
| **Basic** | `Text`, `Image`, `Icon`, `Video`, `AudioPlayer`, `Row`, `Column`, `List`, `Card`, `Tabs`, `Modal`, `Divider`, `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput` | Structural layout containers (`Column`, `Row`) & accessible text/inputs |
| **Material layout** | `MaterialCard`, `MaterialRow`, `MaterialColumn`, `MaterialDialog`, `MaterialDivider`, `MaterialExpansionPanel`, `MaterialGridList` | `KPIStatRow` (`MaterialGridList` + `MaterialCard`), `Split Action Dashboard` (`MaterialRow`) |
| **Material display** | `MaterialText`, `MaterialIcon`, `MaterialImage`, `MaterialBadge`, `MaterialProgressBar`, `MaterialProgressSpinner`, `MaterialTable` | **`DataTable` (`MaterialTable`)**, **`DegreeProgressCard` (`MaterialProgressBar`)**, non-color status badges (`MaterialBadge`) |
| **Material actions** | `MaterialButton`, `MaterialIconButton`, `MaterialMenu`, `MaterialTabs`, `MaterialTab` | Table `rowActions` (`MaterialButton`) & form submit actions |
| **Material input** | `MaterialInput`, `MaterialCheckbox`, `MaterialSelect`, `MaterialRadioButton`, `MaterialChips`, `MaterialButtonToggle`, `MaterialSlideToggle`, `MaterialSlider`, `MaterialDatepicker`, `MaterialTimepicker` | **`ActionFormCard`** (`MaterialSelect`, `MaterialInput`, `MaterialDatepicker`) |
| **Gemini Enterprise extras** | `Canvas` (opens the side panel), `IFrameSrcdoc` (sandboxed HTML), `IFrameUrl` (allowlisted sites only) | Side-panel degree audit & schedule simulator (`Canvas`) |

*(Note: 19 additional undocumented components such as `VegaChart`, `FileUpload`, and `GoogleMap` exist in the catalog JSON—always test in your target Gemini Enterprise environment before relying on them.)*

### C. What You Can't Do in Gemini Enterprise A2UI v0.9 (And What to Do Instead)
| Limitation | What to Do Instead in Augustana AAA |
| :--- | :--- |
| **Use A2UI `v0.9.1`** | Stick to `"version": "v0.9"`. |
| **Host A2UI on Vertex AI Agent Engine** | Host as an **A2A v0.3 agent on Google Cloud Run** (`roles/run.invoker` for Discovery Engine service agent, or OAuth behind custom domain/LB/Apigee). |
| **Define new custom component types** | Compose layouts from the 69 built-in components (`MaterialTable`, `MaterialCard`, `MaterialProgressBar`, `Canvas`), or use `IFrameSrcdoc` only when custom HTML is unavoidable. |
| **Put links or images inside `Text`** | Use `Image`/`MaterialImage` for images and `MaterialButton`/`MaterialCard` with an `openUrl` action for links. |
| **Rely on Gemini Enterprise Model Armor automatically** | Call **Model Armor** directly inside the Cloud Run ADK agent and re-validate all incoming `action` form values server-side. |
| **Deliver files via ADK `save_artifact`** | Send downloadable files (PDF degree audits, SAP CSV exports) as **A2A file parts**. |

---

## 6. Zion Cloud Solutions — Jenzabar J1 (`J1PRD`) Connector API Reference v1.0 (26 Endpoints)

Reference PDF: [`data/Zion_AAA_Connector_API_Reference.pdf`](../../../data/Zion_AAA_Connector_API_Reference.pdf) (*Augustana University and Zion Clouds, Version 1.0, 24 September 2026*).

### A. Core Architecture, Authentication & Read-Only Contract
* **Base URL:** `https://connector-api-385429559879.us-central1.run.app` (Google Cloud Run, `us-central1`, project `fit-stream-495320-f6`)
* **Data Source:** Live read-only queries over site-to-site VPN against **Jenzabar J1 (`J1PRD`)**. Zero student data is cached or copied.
* **Read-Only Guarantee:** All **26 endpoints** are `GET` and return JSON. **No endpoint writes to J1** (the API cannot register, drop, or modify records in J1 directly; any `ActionFormCard` or row action in A2UI either triggers an advisory simulation via `/schedule-conflicts` / `/course-eligibility` or initiates an advising workflow handoff).
* **Two-Layer Authentication (Both Required):**
  1. **Google Cloud IAM:** `Authorization: Bearer <Google OIDC identity token>` (caller requires `roles/run.invoker`).
  2. **Identity Headers (derived via `GET /identity/resolve?email=...`):**
     * `X-User-Id`: User's J1 `ID_NUM` (e.g., `400001`).
     * `X-User-Role`: `student` (own record only), `advisor` (assigned caseload only; non-owned advisees return `404`), or `advising_admin` (`ACCESS_TYP='M'` in `ADVISING_ACCESS`; institution-wide). Anything else is `anonymous` (catalog & terms only).
* **Term Key Convention:** Two-part key `yr` (4-digit academic year starting in autumn, so `yr=2026&trm=SP` is **Spring 2027**) and `trm` (`FA`, `SP`, `SU`, `IN`). Always call `GET /terms/resolve?q=...` rather than constructing term keys by hand.

### B. All 26 Official Endpoints & Returned JSON Fields
1. **Catalog Endpoints (6 — No identity headers required):**
   * `GET /health` → `status`, `db.server`, `db.database` (`"J1PRD"`), `db.time`
   * `GET /terms?yr=&limit=` → `count`, `terms[]` (`yr`, `trm`, `term_name`, `label`, `begins`, `ends`)
   * `GET /terms/resolve?q=` → `interpreted`, `matches[]` (`yr`, `trm`, `term_name`, `label`, `begins`, `ends`)
   * `GET /catalog/courses?subject=&level=&active_only=true&limit=` → `count`, `courses[]` (`crs_cde`, `title`, `credit_hrs`, `division`, `school`, `active`)
   * `GET /catalog/sections?yr=&trm=&subject=&level=&open_only=true&min_seats=&limit=` → `count`, `term`, `sections[]` (`yr`, `trm`, `crs_cde`, `request_num`, `title`, `status`, `capacity`, `enrolled`, `seats_left`, `waitlisted`, `credit_hrs`, `instructor_id`, `instructor`, `prerequisites_raw`)
   * `GET /catalog/section?yr=&trm=&crs=` → `section` (adds `cancelled`, `section_notes`)
2. **Identity Endpoints (2):**
   * `GET /identity/resolve?email=` → `id_num`, `role` (`student` | `advisor` | `advising_admin` | `null`)
   * `GET /me/profile` → `id`, `first_name`, `last_name`, `name`, `display_name`
3. **Student Endpoints (8 — `X-User-Role: student`, scoped to `X-User-Id`):**
   * `GET /students/me/registration?yr=&trm=` → `count`, `term`, `registration[]` (`crs_cde`, `title`, `status`, `status_label` [`registered`|`completed`|`dropped`|`withdrawn`], `credit_hrs`, `instructor`, `meetings[]` [`seq`, `days`, `begin`, `end`, `building_code`, `building`, `room`])
   * `GET /students/me/holds` → `count`, `holds[]` (`hold_cde`, `hold_desc`, `hold_type`, `display_text`, `start_dte`, `end_dte`, `blocks_registration`, `allow_web_reg`)
   * `GET /students/me/registration-window?yr=&trm=` → `term`, `found`, `count`, `windows[]` (`group_code`, `group_name`, `add_begin`, `add_end`, `drop_begin`, `drop_end`, `add_open_now`, `drop_open_now`, `requires_clearance`, `requires_advisor_approval`)
   * `GET /students/me/gpa` → `cumulative_gpa`, `institution_gpa`, `transfer_gpa`, `by_area[]` (`area`, `label`, `gpa`)
   * `GET /students/me/schedule-conflicts?yr=&trm=&candidate=&candidates=` → `term`, `candidate`, `has_conflict`, `conflicts[]`, `current_meetings[]`
   * `GET /students/me/course-eligibility?yr=&trm=&crs=` → `crs_cde`, `yr`, `trm`, `prerequisites_raw`, `status` (`met`|`not_met`|`verify`), `missing[]`, `note`, `already_completed.taken`, `advisory`
   * `GET /students/me/recommend-next-term?yr=&trm=` → `available`, `term`, `as_of`, `items[]` (`code`, `title`, `satisfies`, `kind`, `status`, `open`, `seats_left`), `open_requirements[]` (`requirement`, `kind`, `count_needed`, `reason`)
   * `GET /students/me/degree-progress?detail=true&checklist=true&rules=true` → `declared`, `audit` (`summary`, `gen_ed` [`Sophia Core`, `hrs_earned`, `hrs_needed: 45`], `programs[]`, `total_credits` [`earned`, `needed: 124`, `met`, `requirements_complete`], `overall_gpa`, `checklist`), `plan` (`available: false`, `"AVStudentPlan not populated at AugU"`), `degree_rules` (`min_grade.below_c_minus[]`, `residency.meets_50`, `degree.cum_gpa_ok`, `retake`)
4. **Advisor & Administrator Endpoints (9 Advisor + 2 Admin = 11):**
   * `GET /advisors/me/caseload?yr=&trm=&status=unregistered` → `count`, `term`, `status`, `advisees[]` (`advisee_id`, `advisee_name`, `registered_count`, `registered_credits`, `active_holds`)
   * `GET /advisors/me/advisees/{adviseeId}/...` → 8 routes mirroring `/students/me/...` (`/registration`, `/holds`, `/registration-window`, `/gpa`, `/schedule-conflicts`, `/course-eligibility`, `/recommend-next-term`, `/degree-progress`)
   * `GET /students/search?q=&limit=` *(Admin only)* → `count`, `query`, `students[]` (`id_num`, `name`)
   * `GET /advisors/me/caseload?yr=&trm=&scope=all&limit=&offset=` *(Admin only)* → `count`, `term`, `scope: "all"`, `total` (`3424`), `limit`, `offset`, `advisees[]`

### C. Three Easy-to-Misread J1 Degree Audit Fields (Always Enforce in UI & Prompts)
1. **`credits_met` vs. `incomplete_requirements`:** `credits_met` covers only the credit count. A program can be `met: "not_met"` while `credits_met` is `true`. Always check `incomplete_requirements` before calling a program complete.
2. **`total_credits.met` vs. `requirements_complete`:** `total_credits.met` only means `earned >= needed` (`124`). If `requirements_complete` is `false`, the degree is **not** finished.
3. **`plan.available` is always `false`:** J1 holds no forward term-by-term plans (`AVStudentPlan`) at Augustana. Use `/students/me/recommend-next-term` + `/students/me/degree-progress` instead.
4. **Data Privacy Boundary (`BIOGRAPH_MASTER` Excluded):** Connector API v1.0 does not read `BIOGRAPH_MASTER`, address/telephone tables, or free-text notes. International F-1 12-credit checks evaluate `registered_credits >= 12` from `/registration` or `/caseload`.
