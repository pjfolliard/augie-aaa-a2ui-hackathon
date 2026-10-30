# AGENTS.md — Universal Coding-Agent Instructions (Augustana University AAA A2UI Hackathon)

Welcome, Coding Agent (Antigravity, Google Gemini CLI, Claude Code, Cursor, GitHub Copilot, Windsurf, or OpenAI Codex)!

## Project Purpose
This repository powers the **Augustana University (Sioux Falls, South Dakota)** **2-Hour A2UI + Google ADK Design Hackathon** for the **Academic Advising Agent (AAA)**.

When a user asks you to **"build/modify a table or view for Persona X"** or **"update the fields from Zion Cloud Solutions"**:

1. **Read the Persona Definition:** Check [`data/personas.json`](./data/personas.json) for the persona's `role`, `advisingScope`, `systemPrompt`, and 10 canonical `questions` (`q1`–`q10`).
2. **Read the Field & Glossary Dictionary:** Check [`data/zion_schema_mapping.json`](./data/zion_schema_mapping.json) for available hypothetical/Zion fields and higher-ed jargon glossary keys (`SOPHIA`, `DFW Rate`, `SAP`, `Hold`, `F-1 Full-Time Load`, `Prerequisite Override`, `Residency Requirement`).
3. **Edit the A2UI View:** Update the corresponding persona object in [`docs/views/default-views.js`](./docs/views/default-views.js) following the A2UI component schema in [`adk_agent/a2ui_catalog.json`](./adk_agent/a2ui_catalog.json).
4. **Enforce Accessibility & Sioux Falls Branding:**
   * Use **Augustana University (Sioux Falls, SD)** Navy (`#081E3F`) and Gold (`#FED102`).
   * Ensure every `DataTable` has `a11yCaption`, `a11ySummary`, and `rowHeaderKey` for blind screen-reader users.
   * Prefix status values with `✓`, `⚠`, `⛔`, or `🌐` for color-blind/low-vision users.
   * Keep 100% visual parity for deaf/hard-of-hearing users.
   * Include plain-language `jargon` tags and F-1 12-credit full-time checks for international students.
5. **Validate Your Changes:** Run `python3 scripts/validate_project.py` to confirm zero schema or accessibility regressions.
