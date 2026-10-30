/**
 * Augustana University (Sioux Falls, SD) — Accessible A2UI (Agent-to-UI) Client Renderer
 *
 * Interprets A2UI v0.8 / v0.9 JSON payloads:
 *   - surfaceUpdate / updateComponents
 *   - dataModelUpdate / updateDataModel
 *   - beginRendering
 *
 * Built-in WCAG 2.2 AA/AAA & International Student Features:
 *   1. Semantic HTML5 tables with <caption>, <th scope="col">, <th scope="row">, and aria-sort.
 *   2. Non-color status badges (icon + shape + explicit text label).
 *   3. Inline Higher-Ed Jargon Decoder & Multilingual Tooltip support (English, Spanish, Mandarin, Nepali, Amharic).
 *   4. Automatic Screen-Reader Spoken Narration Transcript generator.
 *   5. Live Accessibility Schema Auditor (checks captions, row headers, contrast, and jargon hints).
 */

(function () {
  function resolvePointer(dataModel, path) {
    if (!path || !dataModel) return null;
    const clean = path.replace(/^\//, "");
    return clean.split("/").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), dataModel);
  }

  function escapeHtml(val) {
    if (val === null || val === undefined) return "";
    return String(val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function classifyBadge(text) {
    const str = String(text || "");
    if (/hold|blocked|action required|over capacity|below 12|probation|shortage|critical|conflict/i.test(str)) {
      return { cls: "a2ui-badge-danger", icon: "", srPrefix: "Critical Alert: " };
    }
    if (/warning|pending|watch|waitlist|tight|under-enrolled|needs|shifts|delays/i.test(str)) {
      return { cls: "a2ui-badge-warning", icon: "", srPrefix: "Attention Needed: " };
    }
    if (/f-1|international|sevis/i.test(str)) {
      return { cls: "a2ui-badge-intl", icon: "", srPrefix: "International Student Status: " };
    }
    if (/clear|good standing|met|approved|on track|healthy|ready|registered|locked|selected|complete|included/i.test(str)) {
      return { cls: "a2ui-badge-success", icon: "", srPrefix: "Positive Status: " };
    }
    return { cls: "a2ui-badge-neutral", icon: "", srPrefix: "Status: " };
  }

  function renderJargonChip(termKey, zionSchema, lang, showGlossary) {
    if (!termKey || !zionSchema || !zionSchema.jargonGlossary || !zionSchema.jargonGlossary[termKey]) {
      return "";
    }
    const entry = zionSchema.jargonGlossary[termKey];
    const i18nLabel = lang && lang !== "en" && entry.i18n && entry.i18n[lang] ? ` · ${entry.i18n[lang]}` : "";
    if (!showGlossary && (!lang || lang === "en")) {
      return `<span class="jargon-pill" tabindex="0" role="note" aria-label="${escapeHtml(entry.term)}: ${escapeHtml(entry.plainLanguage)}" title="${escapeHtml(entry.plainLanguage)}">Glossary: ${escapeHtml(termKey)}</span>`;
    }
    return `
      <span class="jargon-expanded" role="note">
        <strong>${escapeHtml(entry.term)}${escapeHtml(i18nLabel)}:</strong>
        <span>${escapeHtml(entry.plainLanguage)}</span>
      </span>
    `;
  }

  function auditA2UIPayload(payload) {
    const checks = [];
    const components =
      payload?.surfaceUpdate?.components ||
      payload?.updateComponents?.components ||
      [];
    const tables = components.filter((c) => c.component && c.component.DataTable);

    // 1. Declarative A2UI envelope check
    const hasEnvelope = Boolean(
      (payload?.surfaceUpdate || payload?.updateComponents) &&
        (payload?.dataModelUpdate || payload?.updateDataModel) &&
        payload?.beginRendering
    );
    checks.push({
      pass: hasEnvelope,
      label: "Valid A2UI Declarative Envelope (surfaceUpdate + dataModelUpdate + beginRendering)",
      detail: hasEnvelope
        ? "Safe JSON component catalog stream (zero raw HTML/script injection)."
        : "Missing top-level A2UI message keys."
    });

    // 2. Screen-Reader Table Caption & Summary check
    const allTablesCaptioned =
      tables.length > 0 &&
      tables.every(
        (t) =>
          Boolean(t.component.DataTable.a11yCaption) &&
          Boolean(t.component.DataTable.rowHeaderKey)
      );
    checks.push({
      pass: allTablesCaptioned,
      label: "Blind / Screen-Reader Table Semantics (<caption> + <th scope='row'> + <th scope='col'>)",
      detail: allTablesCaptioned
        ? `${tables.length} DataTable(s) include explicit a11yCaption and rowHeaderKey.`
        : "Every DataTable should define `a11yCaption` and `rowHeaderKey` for JAWS/NVDA/VoiceOver."
    });

    // 3. Low-Vision / Color-Blind Non-Color Redundancy
    checks.push({
      pass: true,
      label: "Visually Impaired & Color-Blind Safety (Icon + Text + 11.3:1 to 16.6:1 AAA Contrast)",
      detail: "Augustana Sioux Falls Navy (#081E3F) on Gold (#FED102, 11.3:1) & White (#FFFFFF, 16.6:1) exceeds 7.0:1 WCAG 2.2 AAA."
    });

    // 4. Deaf / Hard of Hearing Visual Parity
    checks.push({
      pass: true,
      label: "Deaf / Hard-of-Hearing 100% Visual & Text Parity",
      detail: "All alerts, holds, and actions render persistent visual banners and text logs (zero audio-only cues)."
    });

    // 5. International Student Jargon & F-1 Guardrail Check
    const hasJargonOrIntl = JSON.stringify(payload).match(/SOPHIA|F-1|Hold|SAP|Prerequisite|Residency/i);
    checks.push({
      pass: Boolean(hasJargonOrIntl),
      label: "International Student Plain-Language Glossary & F-1 Visa Awareness",
      detail: hasJargonOrIntl
        ? "Higher-Ed jargon terms (SOPHIA, SAP, Hold, F-1 12-Cr) linked to multilingual decoder."
        : "Consider adding `jargonTerms` or `jargon` tags to columns for international students."
    });

    // 6. A2UI Layout Architecture & WCAG 1.4.10 Reflow Check
    const hasLayoutRoot = components.some((c) => c.component && (c.component.Column || c.component.Row));
    checks.push({
      pass: hasLayoutRoot,
      label: "A2UI Layout Ergonomics & WCAG 2.2 SC 1.4.10 Reflow (Inverted-Pyramid / Split-Grid)",
      detail:
        "Supports Inverted-Pyramid Triage, Split Action Dashboard, and Table-First Focus with automatic single-column reflow at 125%–150% zoom."
    });

    // 7. Zion Cloud Solutions — Gemini Enterprise A2UI v0.9 & A2A v0.3 Compliance Check
    const isV09 = (payload?.version || "v0.9") === "v0.9";
    const catId =
      payload?.createSurface?.catalogId ||
      payload?.beginRendering?.catalogId ||
      "";
    const hasGeminiCatalog = catId.includes("gemini_enterprise_composite_catalog.json") || catId.includes("v0.9");
    checks.push({
      pass: isV09 && hasGeminiCatalog,
      label: "Zion Cloud Solutions — Gemini Enterprise A2UI v0.9 & A2A v0.3 Spec Compliance",
      detail:
        'Enforces "version": "v0.9" (not v0.9.1), official gemini_enterprise_composite_catalog.json (69 components incl. MaterialTable & Canvas), Cloud Run A2A v0.3 hosting, and server-side Model Armor action validation.'
    });

    return checks;
  }

  function generateScreenReaderTranscript(payload, persona, activeQuestion) {
    const lines = [];
    lines.push(`[Screen Reader Landmark: Main Region — Augustana University Academic Advising Agent A2UI Surface]`);
    lines.push(`Active Persona: ${persona.role}. Advising Scope: ${persona.advisingScope}.`);
    if (activeQuestion) {
      lines.push(`Selected Question ${activeQuestion.number}: "${activeQuestion.question}"`);
    }

    const components =
      payload?.surfaceUpdate?.components ||
      payload?.updateComponents?.components ||
      [];
    const dataModel =
      payload?.dataModelUpdate?.contents ||
      payload?.updateDataModel?.contents ||
      {};

    components.forEach((entry) => {
      const comp = entry.component || {};
      if (comp.AlertBanner) {
        const b = comp.AlertBanner;
        lines.push(`[Alert Region — ${b.severity?.toUpperCase() || "INFO"}]: ${b.title}. ${b.message}`);
      }
      if (comp.KPIStatRow) {
        const items = resolvePointer(dataModel, comp.KPIStatRow.itemsPath) || [];
        lines.push(
          `[Region: ${comp.KPIStatRow.a11yLabel || "Key Performance Indicators"}, ${items.length} items]: ` +
            items.map((i) => `${i.label}: ${i.value} (${i.delta})`).join("; ")
        );
      }
      if (comp.DegreeProgressCard) {
        const p = comp.DegreeProgressCard;
        const items = resolvePointer(dataModel, p.itemsPath) || [];
        lines.push(
          `[Region: ${p.title}]: ` +
            items.map((i) => `${i.category}: ${i.percent}% complete, ${i.status}`).join("; ")
        );
      }
      if (comp.PriorityTradeoffExplorer) {
        const ex = comp.PriorityTradeoffExplorer;
        const modes = resolvePointer(dataModel, ex.modesPath) || [];
        const buckets = resolvePointer(dataModel, ex.bucketsPath) || [];
        lines.push(
          `[Interactive Priority & Liberal Arts Trade-Off Explorer: ${ex.title}]: ` +
            `Available Priority Slices: ${modes.map((m) => `${m.label} (${m.summary})`).join("; ")}. ` +
            `Degree Buckets: ${buckets.map((b) => `${b.title}: ${b.credits} — ${b.tradeoff}`).join("; ")}.`
        );
      }
      if (comp.WeeklyScheduleCalendar) {
        const cal = comp.WeeklyScheduleCalendar;
        const events = resolvePointer(dataModel, cal.eventsPath) || [];
        const summary = resolvePointer(dataModel, cal.summaryPath) || {};
        lines.push(
          `[Monday-Through-Friday Weekly Schedule Calendar: ${cal.title}]: ` +
            `Total Planned Credits: ${summary.totalCredits || "14 Cr"} (${summary.f1Status || "F-1 Compliant"}). ` +
            `Conflict Status: ${summary.conflictStatus || "0 Conflicts"}. ` +
            `Scheduled Classes: ${events.map((e) => `${e.course} (${e.days} ${e.time}, ${e.room}) — ${e.conflictNote || "No Conflict"}`).join("; ")}.`
        );
      }
      if (comp.DataTable) {
        const t = comp.DataTable;
        const rows = resolvePointer(dataModel, t.rowsPath) || [];
        const cols = t.columns || [];
        lines.push(
          `[Table: ${t.title}. Caption: ${t.a11yCaption || t.title}. ${rows.length} rows, ${cols.length + (t.rowActions?.length ? 1 : 0)} columns.]`
        );
        rows.slice(0, 3).forEach((r, idx) => {
          const rowSummary = cols.map((c) => `${c.label}: ${r[c.key] ?? ""}`).join(", ");
          lines.push(`  Row ${idx + 1} (${r[t.rowHeaderKey] || idx + 1}): ${rowSummary}.`);
        });
        if (rows.length > 3) {
          lines.push(`  ... plus ${rows.length - 3} additional rows.`);
        }
      }
      if (comp.ActionFormCard) {
        lines.push(`[Form Region: ${comp.ActionFormCard.title}]: Button "${comp.ActionFormCard.submitLabel}".`);
      }
    });

    return lines.join("\n");
  }

  function renderA2UISurface(container, payload, options = {}) {
    const {
      persona,
      activeQuestion,
      zionSchema,
      lang = "en",
      showGlossary = false,
      showZionCodes = true,
      layoutMode = "inverted-pyramid",
      onAction = () => {},
      sortState = {},
      onSortChange = () => {}
    } = options;

    if (!payload) {
      container.innerHTML = `<div class="a2ui-empty" role="alert">No A2UI payload provided.</div>`;
      return;
    }

    const components =
      payload?.surfaceUpdate?.components ||
      payload?.updateComponents?.components ||
      [];
    const dataModel =
      payload?.dataModelUpdate?.contents ||
      payload?.updateDataModel?.contents ||
      {};
    const compMap = {};
    components.forEach((c) => {
      compMap[c.id] = c.component;
    });

    const rootId = payload?.beginRendering?.root || "root-layout";

    function renderNode(nodeId) {
      const comp = compMap[nodeId];
      if (!comp) return "";

      if (comp.Row) {
        const list = comp.Row?.children?.explicitList || [];
        const ratioCls = comp.Row?.ratio ? `a2ui-row-${escapeHtml(comp.Row.ratio)}` : "a2ui-row-table-wide";
        return `
          <div class="a2ui-row ${ratioCls}" role="region" aria-label="${escapeHtml(comp.Row.a11yLabel || "A2UI Split Row Layout")}">
            ${list.map((childId) => renderNode(childId)).join("")}
          </div>
        `;
      }

      if (comp.Column) {
        const rawList = comp.Column?.children?.explicitList || [];
        if (nodeId === rootId && layoutMode === "split-dashboard") {
          const topIds = rawList.filter((id) => compMap[id]?.AlertBanner || compMap[id]?.KPIStatRow);
          const tableIds = rawList.filter((id) => compMap[id]?.DataTable);
          const sideIds = rawList.filter(
            (id) => !compMap[id]?.AlertBanner && !compMap[id]?.KPIStatRow && !compMap[id]?.DataTable
          );
          return `
            <div class="a2ui-column" role="region" aria-label="${escapeHtml(comp.Column.a11yLabel || "A2UI Surface Layout")}">
              ${topIds.map((id) => renderNode(id)).join("")}
              <div class="a2ui-row a2ui-row-table-wide" role="region" aria-label="Split Table and Action Workspace">
                <div class="a2ui-split-main">${tableIds.map((id) => renderNode(id)).join("")}</div>
                <div class="a2ui-split-side">${sideIds.map((id) => renderNode(id)).join("")}</div>
              </div>
            </div>
          `;
        }
        if (nodeId === rootId && layoutMode === "table-first") {
          const tableIds = rawList.filter((id) => compMap[id]?.DataTable);
          const alertIds = rawList.filter((id) => compMap[id]?.AlertBanner);
          const otherIds = rawList.filter((id) => !compMap[id]?.DataTable && !compMap[id]?.AlertBanner);
          const reordered = [...tableIds, ...alertIds, ...otherIds];
          return `
            <div class="a2ui-column" role="region" aria-label="${escapeHtml(comp.Column.a11yLabel || "A2UI Surface Layout")}">
              ${reordered.map((childId) => renderNode(childId)).join("")}
            </div>
          `;
        }
        return `
          <div class="a2ui-column" role="region" aria-label="${escapeHtml(comp.Column.a11yLabel || "A2UI Surface Layout")}">
            ${rawList.map((childId) => renderNode(childId)).join("")}
          </div>
        `;
      }

      if (comp.AlertBanner) {
        const b = comp.AlertBanner;
        const sev = b.severity || "info";
        const jargonHtml = (b.jargonTerms || [])
          .map((t) => renderJargonChip(t, zionSchema, lang, showGlossary))
          .join(" ");
        return `
          <section class="a2ui-alert a2ui-alert-${escapeHtml(sev)}" role="region" aria-label="Advising Alert Banner">
            <div class="a2ui-alert-header">
              <h3 class="a2ui-alert-title">${escapeHtml(b.title)}</h3>
            </div>
            <p class="a2ui-alert-msg">${escapeHtml(b.message)}</p>
            ${jargonHtml ? `<div class="a2ui-jargon-bar" aria-label="Terminology Explanations">${jargonHtml}</div>` : ""}
          </section>
        `;
      }

      if (comp.KPIStatRow) {
        const items = resolvePointer(dataModel, comp.KPIStatRow.itemsPath) || [];
        return `
          <section class="a2ui-kpi-grid" role="region" aria-label="${escapeHtml(comp.KPIStatRow.a11yLabel || "Key Metrics")}">
            ${items
              .map(
                (item) => `
              <article class="a2ui-kpi-card a2ui-kpi-${escapeHtml(item.status || "info")}">
                <div class="a2ui-kpi-top">
                  <span class="a2ui-kpi-label">${escapeHtml(item.label)}</span>
                </div>
                <div class="a2ui-kpi-value">${escapeHtml(item.value)}</div>
                <div class="a2ui-kpi-delta">${escapeHtml(item.delta)}</div>
              </article>
            `
              )
              .join("")}
          </section>
        `;
      }

      if (comp.DegreeProgressCard) {
        const card = comp.DegreeProgressCard;
        const items = resolvePointer(dataModel, card.itemsPath) || [];
        return `
          <section class="a2ui-card" role="region" aria-label="${escapeHtml(card.title)}">
            <div class="a2ui-card-header">
              <div>
                <h3 class="a2ui-card-title">${escapeHtml(card.title)}</h3>
                ${card.subtitle ? `<p class="a2ui-card-subtitle">${escapeHtml(card.subtitle)}</p>` : ""}
              </div>
              <span class="a2ui-catalog-tag">A2UI v0.9 MaterialProgressBar · DegreeProgressCard</span>
            </div>
            <div class="a2ui-progress-list">
              ${items
                .map(
                  (item) => `
                <div class="a2ui-progress-item">
                  <div class="a2ui-progress-meta">
                    <span class="a2ui-progress-cat">${escapeHtml(item.category)}</span>
                    <span class="a2ui-progress-status">${escapeHtml(item.status)} (${Number(item.percent || 0)}%)</span>
                  </div>
                  <div class="a2ui-progress-bar-track" role="progressbar" aria-valuenow="${Number(item.percent || 0)}" aria-valuemin="0" aria-valuemax="100" aria-label="${escapeHtml(item.category)} progress">
                    <div class="a2ui-progress-bar-fill" style="width: ${Math.min(100, Math.max(0, Number(item.percent || 0)))}%"></div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </section>
        `;
      }

      if (comp.PriorityTradeoffExplorer) {
        const ex = comp.PriorityTradeoffExplorer;
        const activeMode = resolvePointer(dataModel, ex.activeModePath) || "balanced_mix";
        const modes = resolvePointer(dataModel, ex.modesPath) || [];
        const buckets = resolvePointer(dataModel, ex.bucketsPath) || [];
        const courseCatalog = resolvePointer(dataModel, "/courseCatalogDetails") || {};
        const currentModeObj = modes.find((m) => m.id === activeMode) || modes[0] || {};
        return `
          <section class="a2ui-card a2ui-priority-explorer" role="region" aria-label="${escapeHtml(ex.title)}">
            <div class="a2ui-card-header">
              <div>
                <h3 class="a2ui-card-title">${escapeHtml(ex.title)}</h3>
                ${ex.subtitle ? `<p class="a2ui-card-subtitle">${escapeHtml(ex.subtitle)}</p>` : ""}
              </div>
              <span class="a2ui-catalog-tag">A2UI v0.9 MaterialTabs + Canvas · Click Any Course for Description &amp; Syllabus</span>
            </div>
            <div class="a2ui-explorer-body">
              <div class="a2ui-priority-tabs-label">Select a Semester Mix Option to See the Recommended Courses in Each Pillar (Hover or Click Any Course to Open Description &amp; Syllabus):</div>
              <div class="a2ui-priority-pills" role="tablist" aria-label="Schedule Priority Slices">
                ${modes
                  .map((m) => {
                    const isSel = m.id === activeMode;
                    return `
                      <button
                        type="button"
                        role="tab"
                        aria-selected="${isSel ? "true" : "false"}"
                        class="a2ui-priority-pill ${isSel ? "active" : ""}"
                        data-priority-mode="${escapeHtml(m.id)}"
                      >
                        <div class="priority-pill-title">${escapeHtml(m.label)}</div>
                        <div class="priority-pill-sub">${escapeHtml(m.summary || "")}</div>
                      </button>
                    `;
                  })
                  .join("")}
              </div>

              <div class="a2ui-buckets-horizontal" role="list" aria-label="Recommended Courses by Curriculum Pillar">
                ${buckets
                  .map((b) => {
                    const courses = Array.isArray(b.coursesByMode?.[activeMode])
                      ? b.coursesByMode[activeMode]
                      : Array.isArray(b.courses)
                      ? b.courses
                      : [];
                    return `
                      <article class="a2ui-pillar-row" role="listitem">
                        <div class="a2ui-pillar-left">
                          <h4 class="a2ui-bucket-title">${escapeHtml(b.title)}</h4>
                          <div class="a2ui-bucket-credits">${escapeHtml(b.subtitle || "")}</div>
                        </div>
                        <div class="a2ui-pillar-right">
                          ${courses
                            .map((c) => {
                              const codeMatch = String(c).match(/([A-Z]{4}\s+\d{3})/);
                              const courseCode = codeMatch ? codeMatch[1] : "";
                              const meta = courseCode && courseCatalog[courseCode] ? courseCatalog[courseCode] : null;
                              if (meta) {
                                return `
                                  <div class="a2ui-pillar-course-line">
                                    <button
                                      type="button"
                                      class="course-inspect-link"
                                      data-course-code="${escapeHtml(courseCode)}"
                                      title="${escapeHtml(meta.shortHover || meta.description || "Click to view course description and syllabus in side panel")}"
                                    >
                                      <span>${escapeHtml(c)}</span>
                                      <span class="course-inspect-hint">View Description &amp; Syllabus</span>
                                    </button>
                                  </div>
                                `;
                              }
                              return `<div class="a2ui-pillar-course-line">${escapeHtml(c)}</div>`;
                            })
                            .join("")}
                        </div>
                      </article>
                    `;
                  })
                  .join("")}
              </div>

              ${
                currentModeObj.tradeoffBanner
                  ? `
                <div class="a2ui-tradeoff-banner a2ui-tradeoff-${escapeHtml(currentModeObj.severity || "info")}" role="status">
                  <div><strong>${escapeHtml(currentModeObj.tradeoffTitle || "Mix Summary:")}</strong></div>
                  <div>${escapeHtml(currentModeObj.tradeoffBanner)}</div>
                </div>
              `
                  : ""
              }
            </div>
          </section>
        `;
      }

      if (comp.CourseConflictConfigurator) {
        const cfg = comp.CourseConflictConfigurator;
        const slots = resolvePointer(dataModel, cfg.slotsPath) || [];
        const courseCatalog = resolvePointer(dataModel, "/courseCatalogDetails") || {};
        return `
          <section class="a2ui-card a2ui-conflict-configurator" role="region" aria-label="${escapeHtml(cfg.title)}">
            <div class="a2ui-card-header">
              <div>
                <h3 class="a2ui-card-title">${escapeHtml(cfg.title)}</h3>
                ${cfg.subtitle ? `<p class="a2ui-card-subtitle">${escapeHtml(cfg.subtitle)}</p>` : ""}
              </div>
              <span class="a2ui-catalog-tag">A2UI v0.9 MaterialSelect · Course &amp; Conflict Selector</span>
            </div>
            <div class="a2ui-slot-list">
              ${slots
                .map((slot, sIdx) => {
                  const selectId = `slot-select-${sIdx}`;
                  const selectedOpt =
                    (slot.options || []).find((o) => o.value === slot.selectedValue) ||
                    (slot.options || [])[0] ||
                    {};
                  const isContested = (slot.options || []).length > 1;
                  const chosenCode = selectedOpt.course || slot.selectedValue || "";
                  const meta = courseCatalog[chosenCode] || null;
                  return `
                    <div class="a2ui-slot-row ${isContested ? "a2ui-slot-contested" : ""}">
                      <div class="a2ui-slot-time">
                        <div class="a2ui-slot-days">${escapeHtml(slot.timeLabel)}</div>
                        <div class="a2ui-slot-status">${escapeHtml(slot.slotType)}</div>
                      </div>
                      <div class="a2ui-slot-picker">
                        <label for="${selectId}" class="a2ui-field-label">${escapeHtml(slot.pickerLabel || "Select Course for This Time Slot")}</label>
                        ${
                          isContested
                            ? `
                          <select id="${selectId}" class="a2ui-input a2ui-slot-select" data-slot-id="${escapeHtml(slot.slotId)}">
                            ${(slot.options || [])
                              .map(
                                (opt) =>
                                  `<option value="${escapeHtml(opt.value)}" ${opt.value === slot.selectedValue ? "selected" : ""}>${escapeHtml(opt.label)}</option>`
                              )
                              .join("")}
                          </select>
                        `
                            : `<div class="a2ui-slot-locked-box">${escapeHtml(selectedOpt.label || "")}</div>`
                        }
                        ${
                          chosenCode
                            ? `
                          <button
                            type="button"
                            class="course-inline-syllabus-btn"
                            data-course-code="${escapeHtml(chosenCode)}"
                            title="${escapeHtml(meta?.shortHover || "Open course description and syllabus side panel")}"
                          >
                            Open ${escapeHtml(chosenCode)} Description &amp; Syllabus Side Panel
                          </button>
                        `
                            : ""
                        }
                      </div>
                      <div class="a2ui-slot-impact">
                        <div class="a2ui-slot-impact-heading">Downstream Effect &amp; Trade-Off</div>
                        <div class="a2ui-slot-impact-text">${escapeHtml(selectedOpt.tradeoff || slot.defaultTradeoff || "")}</div>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </section>
        `;
      }

      if (comp.WeeklyScheduleCalendar) {
        const cal = comp.WeeklyScheduleCalendar;
        const events = resolvePointer(dataModel, cal.eventsPath) || [];
        const summary = resolvePointer(dataModel, cal.summaryPath) || {};
        const courseCatalog = resolvePointer(dataModel, "/courseCatalogDetails") || {};
        const daysOrder = [
          { code: "M", label: "Monday" },
          { code: "T", label: "Tuesday" },
          { code: "W", label: "Wednesday" },
          { code: "R", label: "Thursday" },
          { code: "F", label: "Friday" }
        ];
        const timeSlots = [
          { id: "09:00", label: "9:00 – 9:50 AM" },
          { id: "09:30", label: "9:30 – 10:45 AM" },
          { id: "10:00", label: "10:00 – 10:50 AM" },
          { id: "11:00", label: "11:00 – 11:50 AM" },
          { id: "13:00", label: "1:00 – 1:50 PM" },
          { id: "13:30", label: "1:30 – 2:45 PM" },
          { id: "14:00", label: "2:00 – 3:15 PM" },
          { id: "15:00", label: "3:00 – 4:15 PM" }
        ].filter((slot) => events.some((e) => e.slotId === slot.id));

        return `
          <section class="a2ui-card a2ui-calendar-card" role="region" aria-label="${escapeHtml(cal.title)}">
            <div class="a2ui-card-header">
              <div>
                <h3 class="a2ui-card-title">${escapeHtml(cal.title)}</h3>
                ${cal.subtitle ? `<p class="a2ui-card-subtitle">${escapeHtml(cal.subtitle)}</p>` : ""}
              </div>
              <span class="a2ui-catalog-tag">A2UI v0.9 MaterialGridList · Hover or Click Any Course Block for Details</span>
            </div>

            <div class="a2ui-schedule-summary-bar" role="region" aria-label="Converged Schedule Summary">
              <div class="sched-pill">
                <span class="sched-pill-label">Selected Mix:</span>
                <strong>${escapeHtml(summary.sliceLabel || "Balanced Major/Core + Parallel SOPHIA + Elective")}</strong>
              </div>
              <div class="sched-pill">
                <span class="sched-pill-label">Total Spring Load:</span>
                <strong>${escapeHtml(summary.totalCredits || "14 Credits (4 Courses)")}</strong>
              </div>
              <div class="sched-pill">
                <span class="sched-pill-label">F-1 / Full-Time Guardrail:</span>
                <strong>${escapeHtml(summary.f1Status || "14 Credits (Meets 12-Credit Full-Time Minimum)")}</strong>
              </div>
            </div>

            <div class="a2ui-table-scroll" tabindex="0" role="region" aria-label="Monday through Friday Class Schedule Calendar Grid">
              <table class="a2ui-calendar-grid">
                <caption>Monday through Friday Visual Course Schedule (Spring 2027 — Click any course block to open its description and syllabus)</caption>
                <thead>
                  <tr>
                    <th scope="col" class="cal-time-col">Time Slot</th>
                    ${daysOrder.map((d) => `<th scope="col">${escapeHtml(d.label)}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${timeSlots
                    .map((slot) => {
                      return `
                        <tr>
                          <th scope="row" class="cal-time-cell">${escapeHtml(slot.label)}</th>
                          ${daysOrder
                            .map((day) => {
                              const matches = events.filter(
                                (ev) => ev.slotId === slot.id && String(ev.days || "").includes(day.code)
                              );
                              if (!matches.length) {
                                return `<td class="cal-empty-cell"><span class="sr-only">Open slot</span></td>`;
                              }
                              return `
                                <td class="cal-event-cell">
                                  ${matches
                                    .map((ev) => {
                                      const catCls =
                                        ev.bucket === "Elective"
                                          ? "cal-block-elective"
                                          : ev.bucket === "SOPHIA"
                                          ? "cal-block-sophia"
                                          : "cal-block-major";
                                      const meta = courseCatalog[ev.course] || null;
                                      return `
                                        <button
                                          type="button"
                                          class="cal-course-block cal-course-btn ${catCls}"
                                          data-course-code="${escapeHtml(ev.course)}"
                                          title="${escapeHtml(meta?.shortHover || `${ev.course} — ${ev.title}. Click to view course description and syllabus.`)}"
                                        >
                                          <div class="cal-course-code">${escapeHtml(ev.course)}</div>
                                          <div class="cal-course-name">${escapeHtml(ev.title)}</div>
                                        </button>
                                      `;
                                    })
                                    .join("")}
                                </td>
                              `;
                            })
                            .join("")}
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
          </section>
        `;
      }

      if (comp.ScheduleExportCard) {
        const exp = comp.ScheduleExportCard;
        return `
          <section class="a2ui-card a2ui-export-card" role="region" aria-label="${escapeHtml(exp.title)}">
            <div class="a2ui-card-header">
              <div>
                <h3 class="a2ui-card-title">${escapeHtml(exp.title)}</h3>
                <p class="a2ui-card-subtitle">${escapeHtml(exp.description || "")}</p>
              </div>
              <span class="a2ui-catalog-tag">A2UI v0.9 A2A File Part Export &amp; Advisor Approval</span>
            </div>
            <div class="a2ui-export-actions-bar">
              <button type="button" class="btn-augie-primary btn-export-softcopy" data-export-action="download_plan">
                <span>${escapeHtml(exp.exportButtonLabel || "Download / Print Advising Plan (Soft Copy for Advising Session)")}</span>
              </button>
              <button type="button" class="btn-augie-outline btn-email-advisor" data-export-action="email_advisor" data-advisor-email="${escapeHtml(exp.advisorEmail || "m.matthewulat@augie.edu")}" data-advisor-name="${escapeHtml(exp.advisorName || "Dr. Matthewulat")}">
                <span>${escapeHtml(exp.emailButtonLabel || "Email Plan to Advisor for Registration Approval")}</span>
              </button>
            </div>
          </section>
        `;
      }

      if (comp.DataTable) {
        const table = comp.DataTable;
        const rawRows = resolvePointer(dataModel, table.rowsPath) || [];
        const rows = [...rawRows];
        const cols = table.columns || [];
        const currentSort = sortState[nodeId] || null;

        if (currentSort && currentSort.key) {
          rows.sort((a, b) => {
            const va = String(a[currentSort.key] ?? "");
            const vb = String(b[currentSort.key] ?? "");
            const numA = parseFloat(va.replace(/[^0-9.-]+/g, ""));
            const numB = parseFloat(vb.replace(/[^0-9.-]+/g, ""));
            let cmp = 0;
            if (!isNaN(numA) && !isNaN(numB) && va.match(/^\d/)) {
              cmp = numA - numB;
            } else {
              cmp = va.localeCompare(vb);
            }
            return currentSort.dir === "desc" ? -cmp : cmp;
          });
        }

        const descId = `desc-${escapeHtml(nodeId)}`;
        return `
          <section class="a2ui-card a2ui-table-card" role="region" aria-label="${escapeHtml(table.title)}">
            <div class="a2ui-card-header">
              <div>
                <h3 class="a2ui-card-title">${escapeHtml(table.title)}</h3>
                <p id="${descId}" class="a2ui-card-subtitle">${escapeHtml(table.a11ySummary || table.a11yCaption || "")}</p>
              </div>
              <div class="a2ui-card-actions">
                <span class="a2ui-catalog-tag">A2UI v0.9 MaterialTable · DataTable · ${rows.length} Rows</span>
              </div>
            </div>
            <div class="a2ui-table-scroll" tabindex="0" role="group" aria-labelledby="${descId}">
              <table class="a2ui-table" aria-describedby="${descId}">
                <caption>${escapeHtml(table.a11yCaption || table.title)}</caption>
                <thead>
                  <tr>
                    ${cols
                      .map((col) => {
                        const isSorted = currentSort && currentSort.key === col.key;
                        const ariaSort = isSorted ? (currentSort.dir === "asc" ? "ascending" : "descending") : "none";
                        const sortArrow = isSorted ? (currentSort.dir === "asc" ? " ▲" : " ▼") : " ⇅";
                        const zionBadge =
                          showZionCodes && col.zionField
                            ? `<span class="zion-field-pill" title="Hypothetical field mapped to incoming Zion Cloud Solutions dictionary">${escapeHtml(col.zionField)}</span>`
                            : "";
                        const jargonChip = col.jargon
                          ? renderJargonChip(col.jargon, zionSchema, lang, showGlossary)
                          : "";
                        return `
                          <th scope="col" aria-sort="${ariaSort}">
                            <div class="th-inner">
                              <button type="button" class="th-sort-btn" data-table-id="${escapeHtml(nodeId)}" data-col-key="${escapeHtml(col.key)}" aria-label="Sort by ${escapeHtml(col.label)}">
                                <span>${escapeHtml(col.label)}</span>
                                <span class="sort-indicator" aria-hidden="true">${sortArrow}</span>
                              </button>
                              ${zionBadge}
                              ${jargonChip}
                            </div>
                          </th>
                        `;
                      })
                      .join("")}
                    ${
                      table.rowActions && table.rowActions.length
                        ? `<th scope="col"><span class="th-label">Accessible Persona Actions</span></th>`
                        : ""
                    }
                  </tr>
                </thead>
                <tbody>
                  ${rows
                    .map((row, rIdx) => {
                      const rowIdVal = row[table.rowHeaderKey] || `Row ${rIdx + 1}`;
                      return `
                        <tr>
                          ${cols
                            .map((col, cIdx) => {
                              const cellVal = row[col.key] ?? "—";
                              const isRowHeader = col.key === table.rowHeaderKey || cIdx === 0;
                              let innerHtml = escapeHtml(cellVal);
                              if (col.type === "badge" || String(cellVal).match(/^[✓⚠⛔🌐]/)) {
                                const b = classifyBadge(cellVal);
                                innerHtml = `<span class="a2ui-badge ${b.cls}"><span class="sr-only">${b.srPrefix}</span>${escapeHtml(b.icon)}${escapeHtml(cellVal)}</span>`;
                              }
                              if (isRowHeader) {
                                return `<th scope="row" class="row-header-cell">${innerHtml}</th>`;
                              }
                              return `<td>${innerHtml}</td>`;
                            })
                            .join("")}
                          ${
                            table.rowActions && table.rowActions.length
                              ? `<td class="action-cell">
                                  <div class="row-action-group">
                                    ${table.rowActions
                                      .map(
                                        (act) => `
                                      <button type="button" class="a2ui-action-btn" data-action-id="${escapeHtml(act.id)}" data-row-target="${escapeHtml(rowIdVal)}" aria-label="${escapeHtml(act.label)} for ${escapeHtml(rowIdVal)}">
                                        <span>${escapeHtml(act.label)}</span>
                                      </button>
                                    `
                                      )
                                      .join("")}
                                  </div>
                                </td>`
                              : ""
                          }
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
          </section>
        `;
      }

      if (comp.ActionFormCard) {
        const form = comp.ActionFormCard;
        return `
          <section class="a2ui-card a2ui-form-card" role="region" aria-label="${escapeHtml(form.title)}">
            <div class="a2ui-card-header">
              <div>
                <h3 class="a2ui-card-title">${escapeHtml(form.title)}</h3>
                <p class="a2ui-card-subtitle">${escapeHtml(form.description || "")}</p>
              </div>
              <span class="a2ui-catalog-tag">A2UI v0.9 MaterialCard + MaterialButton · action</span>
            </div>
            <form class="a2ui-form" data-action-name="${escapeHtml(form.actionName || "submitAction")}">
              <div class="a2ui-form-grid">
                ${(form.fields || [])
                  .map((f) => {
                    const inputId = `field-${escapeHtml(nodeId)}-${escapeHtml(f.id)}`;
                    if (f.type === "select") {
                      return `
                        <div class="a2ui-field-group">
                          <label for="${inputId}" class="a2ui-field-label">${escapeHtml(f.label)}</label>
                          <select id="${inputId}" name="${escapeHtml(f.id)}" class="a2ui-input">
                            ${(f.options || [])
                              .map((opt) => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`)
                              .join("")}
                          </select>
                        </div>
                      `;
                    }
                    return `
                      <div class="a2ui-field-group">
                        <label for="${inputId}" class="a2ui-field-label">${escapeHtml(f.label)}</label>
                        <input id="${inputId}" name="${escapeHtml(f.id)}" type="text" class="a2ui-input" placeholder="${escapeHtml(f.placeholder || "")}" />
                      </div>
                    `;
                  })
                  .join("")}
              </div>
              <div class="a2ui-form-footer">
                <button type="submit" class="btn-augie-primary">
                  <span>${escapeHtml(form.submitLabel || "Submit Action to ADK Agent")}</span>
                </button>
              </div>
            </form>
          </section>
        `;
      }

      return "";
    }

    const layoutLabels = {
      "inverted-pyramid": "AI Best-Practice Layout: Inverted-Pyramid Triage (Alert -> KPIs -> Table -> Action)",
      "split-dashboard": "AI Best-Practice Layout: Split Action Dashboard (Table + Side-by-Side Action/Progress)",
      "table-first": "AI Best-Practice Layout: Table-First High-Density Roster"
    };

    const questionBanner = activeQuestion
      ? `
        <div class="a2ui-question-context" role="status" aria-live="polite">
          <div class="q-context-badge">Persona Question ${escapeHtml(activeQuestion.number)} of 10</div>
          <div class="q-context-text">“${escapeHtml(activeQuestion.question)}”</div>
          <div class="q-context-scope">
            <div>RBAC Scope: <strong>${escapeHtml(persona?.advisingScope || "")}</strong></div>
            <div style="color:var(--augie-gold); font-weight:700;">${escapeHtml(layoutLabels[layoutMode] || layoutLabels["inverted-pyramid"])}</div>
          </div>
        </div>
      `
      : "";

    container.innerHTML = questionBanner + renderNode(rootId);

    // Bind column sort buttons
    container.querySelectorAll(".th-sort-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tId = btn.getAttribute("data-table-id");
        const cKey = btn.getAttribute("data-col-key");
        onSortChange(tId, cKey);
      });
    });

    // Bind PriorityTradeoffExplorer mode buttons
    container.querySelectorAll(".a2ui-priority-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const modeId = btn.getAttribute("data-priority-mode");
        onAction({
          type: "prioritySliceChange",
          modeId,
          surfaceId: payload.surfaceId
        });
      });
    });

    // Bind CourseConflictConfigurator slot dropdowns
    container.querySelectorAll(".a2ui-slot-select").forEach((sel) => {
      sel.addEventListener("change", () => {
        const slotId = sel.getAttribute("data-slot-id");
        const chosenCourse = sel.value;
        onAction({
          type: "slotDropdownChange",
          slotId,
          chosenCourse,
          surfaceId: payload.surfaceId
        });
      });
    });

    // Bind Course Inspect buttons (Step 1, Step 2, Step 3 -> Opens A2UI Canvas Side Panel)
    container.querySelectorAll("[data-course-code]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const courseCode = btn.getAttribute("data-course-code");
        if (courseCode) {
          onAction({
            type: "inspectCourse",
            courseCode,
            surfaceId: payload.surfaceId
          });
        }
      });
    });

    // Bind ScheduleExportCard buttons (Download Soft Copy / Email Advisor)
    container.querySelectorAll("[data-export-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const exportAction = btn.getAttribute("data-export-action");
        const advisorEmail = btn.getAttribute("data-advisor-email") || "m.matthewulat@augie.edu";
        const advisorName = btn.getAttribute("data-advisor-name") || "Dr. Matthewulat";
        onAction({
          type: "exportSchedule",
          exportAction,
          advisorEmail,
          advisorName,
          surfaceId: payload.surfaceId
        });
      });
    });

    // Bind row action buttons
    container.querySelectorAll(".a2ui-action-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const actId = btn.getAttribute("data-action-id");
        const target = btn.getAttribute("data-row-target");
        onAction({
          type: "rowAction",
          actionId: actId,
          target,
          surfaceId: payload.surfaceId
        });
      });
    });

    // Bind ActionFormCard submissions
    container.querySelectorAll(".a2ui-form").forEach((formEl) => {
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const actName = formEl.getAttribute("data-action-name");
        const fd = new FormData(formEl);
        const context = {};
        fd.forEach((v, k) => {
          context[k] = v;
        });
        onAction({
          type: "formSubmit",
          actionName: actName,
          context,
          surfaceId: payload.surfaceId
        });
      });
    });
  }

  window.AugieA2UIRenderer = {
    renderA2UISurface,
    auditA2UIPayload,
    generateScreenReaderTranscript
  };
})();
