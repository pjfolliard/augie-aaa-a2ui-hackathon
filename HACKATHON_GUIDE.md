# Augustana University (Sioux Falls, SD) — 2-Hour A2UI + Google ADK Design Hackathon Guide

**Initiative:** Gemini Enterprise Campus-Wide Rollout — Academic Advising Agent (AAA)  
**Leadership:** VP for Innovation & Director of Future Operations (Terence)  
**Institution:** Augustana University, Sioux Falls, South Dakota (`augie.edu`)  
**Brand Identity:** Official Sioux Falls Navy (`#081E3F`, PMS 289 C) & Gold (`#FED102`, PMS 109 C)  
**Data Schema Status:** Hypothetical Pre-Zion Schema (Ready for tonight/tomorrow's official **Zion Cloud Solutions** field dictionary)

---

## 1. Plain-Language Briefing: What Are ADK and A2UI?

### What is the Google Agent Development Kit (ADK)?
**Google ADK** ([`github.com/google/adk-python`](https://github.com/google/adk-python)) is Google's open-source framework for building production AI agents on **Gemini Enterprise**.
* Think of **ADK** as the **brain, identity router, and security guardrail** of the Academic Advising Agent.
* When a user signs in with their `@augie.edu` Google Workspace for Education Plus account, ADK:
  1. Identifies which of the **10 Advising Personas** they hold (`Admin`, `Provost`, `Registrar`, `Student Success`, `Deans`, `Area Chair`, `Program Director`, `Department Chair`, `Advisor`, or `Student`).
  2. Loads that persona's **Companion System Message / Prompt** from the AAA Persona Table.
  3. Enforces their **Advising Scope (Role-Based Access Control)**—ensuring a Student only ever sees `Self Only` records, an Advisor sees `Assigned Advisees Only`, a Department Chair sees `All in Department`, and the Provost/Admin see `All (University-Wide)`.

### What is A2UI (Agent-to-UI)?
**A2UI (Agent-to-UI)** ([`github.com/google/A2UI`](https://github.com/google/A2UI) / [a2ui.org](https://a2ui.org)) is Google's open-source declarative user interface protocol for AI agents.
* Traditional AI chatbots reply with **walls of Markdown prose**—which are slow to read, hard to compare across dozens of advisees, and frustrating for screen-reader or mobile users.
* With **A2UI**, the ADK agent streams lightweight **JSON messages** (`surfaceUpdate` to declare UI components + `dataModelUpdate` to supply the scoped data rows).
* The browser or Workspace client renders those JSON messages into native, accessible **Augustana University UI components**:
  * **`DataTable`**: Sortable tables with Zion field mappings, status badges, and row-level action buttons.
  * **`KPIStatRow`**: At-a-glance metric cards with trend indicators.
  * **`AlertBanner`**: High-priority hold, bottleneck, or F-1 international credit-load alerts.
  * **`DegreeProgressCard`**: Visual & screen-reader progress bars for 124-credit graduation and **SOPHIA** Core requirements.
  * **`ActionFormCard`**: Interactive forms (e.g., *Release Advising Pin*, *Approve Substitution*, *Book Advisor Appointment*) that send an `actionResponse` back to the ADK agent.

---

## 2. Minute-by-Minute 2-Hour Hackathon Runbook

This 120-minute sprint is designed so **you and Terence** (and future campus groups using Google Workspace for Education Plus or any coding agent of their choice) can focus 100% on **what each persona needs to see**—not backend database wiring.

### Phase 1: Vision, Persona Matrix & A2UI Walkthrough (`0:00 – 0:20` · 20 mins)
1. Open the live **A2UI Design Workbench** (`docs/index.html` or the GitHub Pages URL) alongside the [AAA Persona Table Google Sheet](https://docs.google.com/spreadsheets/d/1V_U0lXWP40WdDWyacq8QM_emvrwOKWCsPOZzZnWLooo/edit?gid=917434374#gid=917434374).
2. Click across the **10 Persona Pills** (`1. Admin` → `10. Student`) and notice how the **same synthetic Augustana student records** (*Amina Tesfaye*, *Lucas Sorenson*, *Priya Gurung*, *Jordan Rivera*) surface completely different columns, KPIs, and actions depending on the persona's **Advising Scope**.
3. Open the **Zion Cloud Solutions Field Mapper** button in the top bar to review the current hypothetical fields (`PENDING_ZION_*`).

### Phase 2: Priority Persona Deep-Dive & Table Design Sprint (`0:20 – 1:25` · 65 mins)
Split the 10 personas into two tracks (e.g., **Pete** takes *Executive & Unit Leadership: Provost, Deans, Area Chair, Department Chair, Student*; **Terence** takes *Systems, Operations & Direct Care: Admin, Registrar, Student Success, Program Director, Advisor*—or tackle priority personas together):

For each persona:
1. **Review Questions Q1–Q10** in the left sidebar. Ask: *"If this persona asks Q1 through Q10 during registration week, what exact table columns, badges, and 1-click buttons do they need on screen?"*
2. **Option A — No-Code Visual Table Designer:**
   * Click the **`🛠️ Visual Table & Column Designer`** tab.
   * Add, remove, or rename columns from the Hypothetical/Zion Field Catalog and click **Add Column & Update Live A2UI View**.
3. **Option B — Use Any Coding Agent (`gemini-cli`, Antigravity, Workspace Gemini, Claude Code, Cursor):**
   * Click **`🤖 Copy Prompt for Any Coding Agent`** in the top header.
   * Paste the prompt into your preferred coding agent and ask it to tailor the table or add a new card for a specific question.
   * Paste the generated JSON into the **`{ } A2UI JSON Stream Editor`** tab (or let your coding agent edit `docs/views/default-views.js` directly).

### Phase 3: 360° Accessibility & International Student Pressure Test (`1:25 – 1:45` · 20 mins)
Every persona view at Augustana University must serve **blind, deaf, visually impaired, and international students and staff**. Test each view against the 5 built-in controls in the top utility bar:
1. **Blind / Screen-Reader Check:** Switch to the **`♿ Accessibility & Screen-Reader Audit`** tab. Verify all 5 checks pass (`✅`) and click **`🔊 Speak Screen-Reader Narration Aloud`** to hear how JAWS/NVDA/VoiceOver reads the table caption, headers, and rows.
2. **Visually Impaired / Low-Vision Check:** Toggle **`◐ High-Contrast AAA`**, **`🔍 Zoom: 150%`**, and **`↔ Wide Reading Spacing`**. Verify that every status cell uses an icon (`✓`, `⚠`, `⛔`, `🌐`) + text label rather than color alone.
3. **Deaf / Hard-of-Hearing Check:** Confirm that every alert, hold, and action confirmation has 100% visual and written parity (zero audio-only cues).
4. **International Student Check:** Toggle **`🌐 Plain-Language Jargon Decoder`** and test switching the glossary language (`Español`, `中文`, `नेपाली`, `አማርኛ`). Confirm that **F-1 International 12-credit full-time guardrails** appear clearly on Student, Advisor, and Student Success views.

### Phase 4: Side-by-Side Alignment & Zion Cloud Solutions Handoff Prep (`1:45 – 2:00` · 15 mins)
1. Walk through a single student journey across 4 personas:
   * **Student (*Amina Tesfaye*):** Sees her remaining 32 credits, 1 remaining SOPHIA R2 course, F-1 14-credit status, and requests a `COSC 450` Capstone Prerequisite Override.
   * **Advisor:** Sees Amina's request in their `Assigned Advisees Only` table and endorses the override.
   * **Program Director / Department Chair:** Approves the prerequisite override and checks `COSC 210` / `COSC 450` seat capacity.
   * **Registrar:** Posts the approved override to the degree audit.
2. Click **`📥 Download .json`** (or commit changes to GitHub) so your finalized table designs are ready to bind to the **Zion Cloud Solutions** field list when it arrives tonight/tomorrow.

---

## 3. How to Plug In the Zion Cloud Solutions Field List (Tonight / Tomorrow)

When **Zion Cloud Solutions** sends the official field list:
1. **In the Browser Workbench:** Click **`🗂️ Zion Cloud Solutions Field Mapper`** in the top bar, paste the official Zion field codes next to each hypothetical field, and click **Apply Zion Field Mappings Live**.
2. **Or via Coding Agent / Git:** Drop the file from Zion Cloud Solutions into `data/` and tell **Google Gemini CLI** (`gemini`) or **Antigravity**:
   > *"Map the new Zion Cloud Solutions field list into `data/zion_schema_mapping.json` and update all `zionField` references in `docs/views/default-views.js`, then run `python3 scripts/validate_project.py`."*
