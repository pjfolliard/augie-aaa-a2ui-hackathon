# AGENTS.md — Universal Coding-Agent Instructions (Augustana University AAA A2UI Hackathon)

Welcome, Coding Agent (Antigravity, Google Gemini CLI, Claude Code, Cursor, GitHub Copilot, Windsurf, or OpenAI Codex)!

## Project Purpose & Links
This repository powers the **Augustana University (Sioux Falls, South Dakota)** **2-Hour A2UI + Google ADK Design Hackathon** for the **Academic Advising Agent (AAA)**.

* **GitHub Repository:** [`https://github.com/pjfolliard/augie-aaa-a2ui-hackathon`](https://github.com/pjfolliard/augie-aaa-a2ui-hackathon)
* **Live GitHub Pages Workbench:** [`https://pjfolliard.github.io/augie-aaa-a2ui-hackathon/`](https://pjfolliard.github.io/augie-aaa-a2ui-hackathon/)
* **Official Brand Guidelines:** [Augustana University Brand Guidelines & Requirements (Issuu)](https://issuu.com/augustanacollegesd/docs/augustana_university_brand_guidelines_requiremen)
* **Built-In Best-Practices Skill:** [`.agents/skills/augie-a2ui-design/SKILL.md`](./.agents/skills/augie-a2ui-design/SKILL.md) (and [`.gemini/skills/augie-a2ui-design/SKILL.md`](./.gemini/skills/augie-a2ui-design/SKILL.md))

When a user asks you to **"build/modify a table or view for Persona X / Question Q#"** or **"update the fields from Zion Cloud Solutions"**:

0. **Load the Design Skill First:** Read [`.agents/skills/augie-a2ui-design/SKILL.md`](./.agents/skills/augie-a2ui-design/SKILL.md) for the AI-recommended A2UI Layout Archetype matrix (`inverted-pyramid`, `split-dashboard`, `table-first`), 5–7 column density rule, and official Brand Guidelines (pp. 4, 16–28, 35).
1. **Read the Persona Definition:** Check [`data/personas.json`](./data/personas.json) for the persona's `role`, `advisingScope`, `systemPrompt`, and 10 canonical `questions` (`q1`–`q10`).
2. **Read the Field & Glossary Dictionary:** Check [`data/zion_schema_mapping.json`](./data/zion_schema_mapping.json) for available hypothetical/Zion fields and higher-ed jargon glossary keys (`SOPHIA`, `DFW Rate`, `SAP`, `Hold`, `F-1 Full-Time Load`, `Prerequisite Override`, `Residency Requirement`).
3. **Edit the A2UI View:** Update the corresponding persona object in [`docs/views/default-views.js`](./docs/views/default-views.js) or the question-specific blueprint in [`docs/views/question-views.js`](./docs/views/question-views.js) following the A2UI component schema in [`adk_agent/a2ui_catalog.json`](./adk_agent/a2ui_catalog.json).
4. **Enforce Accessibility & Sioux Falls Branding:**
   * Use **Augustana University (Sioux Falls, SD)** Primary Blue (`#081E3F`, `PMS 282`) and Primary Yellow (`#FED102`, `PMS 109`).
   * Ensure every `DataTable` has `a11yCaption`, `a11ySummary`, and `rowHeaderKey` for blind screen-reader users.
   * Prefix status values with `✓`, `⚠`, `⛔`, or `🌐` for color-blind/low-vision users.
   * Keep 100% visual parity for deaf/hard-of-hearing users.
   * Include plain-language `jargon` tags and F-1 12-credit full-time checks for international students.
5. **Validate Your Changes:** Run `python3 scripts/validate_project.py` to confirm zero schema or accessibility regressions.
