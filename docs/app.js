/**
 * Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA)
 * Interactive A2UI + ADK 2-Hour Hackathon Workbench Controller
 */

(function () {
  const personas = window.AUGIE_AAA_PERSONAS || [];
  const zionSchema = window.AUGIE_ZION_SCHEMA || { fields: [], jargonGlossary: {} };
  const baseViews = window.AUGIE_DEFAULT_A2UI_VIEWS || {};

  // Working copy of A2UI views per persona (persisted in sessionStorage during the hackathon sprint)
  const customViews = {};
  personas.forEach((p) => {
    const saved = sessionStorage.getItem(`augie_a2ui_view_${p.id}`);
    if (saved) {
      try {
        customViews[p.id] = JSON.parse(saved);
        return;
      } catch (e) {
        // fallback to default
      }
    }
    customViews[p.id] = JSON.parse(JSON.stringify(baseViews[p.id] || {}));
  });

  const state = {
    activePersonaId: personas[0]?.id || "admin",
    activeQuestionIdx: 0,
    activeTab: "surface", // 'surface' | 'visual-builder' | 'json-editor' | 'a11y-audit' | 'hackathon-guide'
    highContrast: false,
    textScale: "100", // '100' | '125' | '150'
    wideSpacing: false,
    showGlossary: false,
    showZionCodes: true,
    lang: "en", // 'en' | 'es' | 'zh' | 'ne' | 'am'
    sortState: {}
  };

  function getActivePersona() {
    return personas.find((p) => p.id === state.activePersonaId) || personas[0];
  }

  function getActiveQuestion() {
    const p = getActivePersona();
    return (p?.questions || [])[state.activeQuestionIdx] || p?.questions?.[0] || null;
  }

  function getActivePayload() {
    return customViews[state.activePersonaId];
  }

  function saveActivePayload(newPayload) {
    customViews[state.activePersonaId] = newPayload;
    try {
      sessionStorage.setItem(`augie_a2ui_view_${state.activePersonaId}`, JSON.stringify(newPayload));
    } catch (e) {
      // ignore storage quota errors
    }
  }

  function announcePolite(message) {
    const region = document.getElementById("a11y-live-announcer");
    if (region) {
      region.textContent = message;
    }
  }

  function showToast(title, detail) {
    const toast = document.getElementById("workbench-toast");
    if (!toast) return;
    toast.innerHTML = `
      <div style="font-weight:800; margin-bottom:0.25rem; color:var(--augie-gold);">⚡ ${title}</div>
      <div style="font-size:0.86rem;">${detail}</div>
    `;
    toast.hidden = false;
    announcePolite(`${title}. ${detail}`);
    clearTimeout(window.__augieToastTimer);
    window.__augieToastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 5200);
  }

  function renderPersonaPills() {
    const container = document.getElementById("persona-pills-container");
    if (!container) return;
    container.innerHTML = personas
      .map((p) => {
        const isSel = p.id === state.activePersonaId;
        return `
          <button
            type="button"
            role="tab"
            class="persona-pill-btn"
            aria-selected="${isSel ? "true" : "false"}"
            data-persona-id="${p.id}"
          >
            <span class="persona-pill-icon" aria-hidden="true">${p.icon || "👤"}</span>
            <span class="persona-pill-meta">
              <span class="persona-pill-role">${p.order}. ${p.role}</span>
              <span class="persona-pill-scope">${p.advisingScope}</span>
            </span>
          </button>
        `;
      })
      .join("");

    container.querySelectorAll(".persona-pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-persona-id");
        state.activePersonaId = pid;
        state.activeQuestionIdx = 0;
        const p = getActivePersona();
        announcePolite(`Switched persona to ${p.role}. Advising scope: ${p.advisingScope}.`);
        renderAll();
      });
    });
  }

  function renderSidebar() {
    const p = getActivePersona();
    if (!p) return;

    const titleEl = document.getElementById("sidebar-persona-title");
    const scopeEl = document.getElementById("sidebar-persona-scope");
    const unitEl = document.getElementById("sidebar-persona-unit");
    const promptEl = document.getElementById("sidebar-persona-prompt");
    const rosterEl = document.getElementById("sidebar-persona-roster");
    const qListEl = document.getElementById("sidebar-questions-list");

    if (titleEl) titleEl.innerHTML = `<span aria-hidden="true">${p.icon}</span> <span>${p.role}</span>`;
    if (scopeEl) scopeEl.textContent = `Advising Scope: ${p.advisingScope}`;
    if (unitEl) unitEl.textContent = `${p.defaultUnit} · Google Group: ${p.googleGroupId}`;
    if (promptEl) promptEl.textContent = p.systemPrompt;

    if (rosterEl) {
      if (p.associatedUsers && p.associatedUsers.length > 0) {
        rosterEl.innerHTML = `
          <details class="persona-roster-details">
            <summary>Associated @augie.edu Stakeholders (${p.associatedUsers.length})</summary>
            <ul class="roster-list">
              ${p.associatedUsers
                .map((u) => `<li><strong>${u.name}</strong> ${u.email ? `(<a href="mailto:${u.email}">${u.email}</a>)` : ""}</li>`)
                .join("")}
            </ul>
          </details>
        `;
      } else {
        rosterEl.innerHTML = `<div style="margin-top:0.5rem; font-size:0.8rem; color:var(--text-muted);">Assigned dynamically via Google Workspace Group / Banner / Zion SIS Role.</div>`;
      }
    }

    if (qListEl) {
      qListEl.innerHTML = (p.questions || [])
        .map((q, idx) => {
          const isCurr = idx === state.activeQuestionIdx;
          return `
            <button
              type="button"
              class="question-btn"
              aria-current="${isCurr ? "true" : "false"}"
              data-q-idx="${idx}"
            >
              <span class="q-num-badge">Q${q.number}</span>
              <span>${q.question}</span>
            </button>
          `;
        })
        .join("");

      qListEl.querySelectorAll(".question-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.getAttribute("data-q-idx"));
          state.activeQuestionIdx = idx;
          const q = getActiveQuestion();
          announcePolite(`Selected Question ${q.number}: ${q.question}`);
          renderAll();
        });
      });
    }
  }

  function renderWorkspaceTabs() {
    document.querySelectorAll(".ws-tab-btn").forEach((btn) => {
      const tab = btn.getAttribute("data-ws-tab");
      btn.setAttribute("aria-selected", tab === state.activeTab ? "true" : "false");
    });

    const panes = ["surface", "visual-builder", "json-editor", "a11y-audit", "hackathon-guide"];
    panes.forEach((paneId) => {
      const el = document.getElementById(`pane-${paneId}`);
      if (el) {
        el.hidden = paneId !== state.activeTab;
      }
    });
  }

  function renderMainSurface() {
    const surfaceContainer = document.getElementById("a2ui-live-canvas");
    if (!surfaceContainer) return;

    const p = getActivePersona();
    const q = getActiveQuestion();
    const payload = getActivePayload();

    window.AugieA2UIRenderer.renderA2UISurface(surfaceContainer, payload, {
      persona: p,
      activeQuestion: q,
      zionSchema,
      lang: state.lang,
      showGlossary: state.showGlossary,
      showZionCodes: state.showZionCodes,
      sortState: state.sortState,
      onSortChange: (tableId, colKey) => {
        const prev = state.sortState[tableId];
        const nextDir = prev && prev.key === colKey && prev.dir === "asc" ? "desc" : "asc";
        state.sortState[tableId] = { key: colKey, dir: nextDir };
        announcePolite(`Sorted table by ${colKey} ${nextDir === "asc" ? "ascending" : "descending"}.`);
        renderMainSurface();
      },
      onAction: (evt) => {
        if (evt.type === "rowAction") {
          showToast(
            `A2UI actionResponse Dispatched to ADK Agent`,
            `Persona "${p.role}" triggered action "${evt.actionId}" on record "${evt.target}" (Surface: ${evt.surfaceId}).`
          );
        } else if (evt.type === "formSubmit") {
          showToast(
            `A2UI Form Submitted (${evt.actionName})`,
            `Payload sent to ADK Agent with context: ${JSON.stringify(evt.context)}`
          );
        }
      }
    });
  }

  function getPrimaryDataTableComponent(payload) {
    const comps = payload?.surfaceUpdate?.components || [];
    const found = comps.find((c) => c.component && c.component.DataTable);
    return found ? found.component.DataTable : null;
  }

  function renderVisualBuilder() {
    const container = document.getElementById("visual-builder-content");
    if (!container) return;

    const p = getActivePersona();
    const payload = getActivePayload();
    const table = getPrimaryDataTableComponent(payload);

    if (!table) {
      container.innerHTML = `<p>No DataTable component found in this surface.</p>`;
      return;
    }

    const columns = table.columns || [];
    const availableZionFields = zionSchema.fields || [];

    container.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:0.75rem; margin-bottom:1rem;">
        <div>
          <h3 style="margin:0; color:var(--augie-navy);">No-Code A2UI Table Designer — ${p.role} View</h3>
          <p style="margin:0.25rem 0 0; font-size:0.86rem; color:var(--text-muted);">
            Customize what columns, badges, and Zion Cloud Solutions fields display for <strong>${p.role}</strong> (${p.advisingScope}).
          </p>
        </div>
        <button type="button" id="btn-reset-persona-view" class="btn-augie-outline">↺ Reset ${p.role} to Default View</button>
      </div>

      <div class="a2ui-field-group" style="margin-bottom:1rem;">
        <label for="vb-table-title" class="a2ui-field-label">Table Title</label>
        <input id="vb-table-title" type="text" class="a2ui-input" value="${table.title.replace(/"/g, "&quot;")}" />
      </div>

      <div class="a2ui-field-group" style="margin-bottom:1rem;">
        <label for="vb-table-caption" class="a2ui-field-label">Screen-Reader Accessible Caption (Required for Blind & Low-Vision Users)</label>
        <input id="vb-table-caption" type="text" class="a2ui-input" value="${(table.a11yCaption || "").replace(/"/g, "&quot;")}" />
      </div>

      <h4 style="margin:1.2rem 0 0.6rem; color:var(--augie-navy);">Current Table Columns (${columns.length})</h4>
      <div style="display:grid; gap:0.5rem; margin-bottom:1.25rem;">
        ${columns
          .map(
            (col, idx) => `
          <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.5rem; padding:0.65rem 0.9rem; background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:8px;">
            <div>
              <strong>${idx + 1}. ${col.label}</strong>
              <span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted); margin-left:0.5rem;">key: ${col.key}</span>
              ${col.zionField ? `<span class="zion-field-pill" style="background:var(--augie-navy); color:var(--augie-gold); margin-left:0.4rem;">${col.zionField}</span>` : ""}
              ${col.type === "badge" ? `<span class="a2ui-badge a2ui-badge-success" style="margin-left:0.4rem;">Accessible Status Badge</span>` : ""}
            </div>
            <button type="button" class="a2ui-action-btn btn-remove-col" data-col-idx="${idx}" aria-label="Remove column ${col.label}">
              ✕ Remove
            </button>
          </div>
        `
          )
          .join("")}
      </div>

      <div style="background:var(--augie-light-blue-soft); border:1.5px solid var(--augie-navy); border-radius:12px; padding:1rem 1.2rem;">
        <h4 style="margin:0 0 0.65rem; color:var(--augie-navy);">➕ Add a Column to ${p.role}'s Table</h4>
        <div class="a2ui-form-grid">
          <div class="a2ui-field-group">
            <label for="vb-preset-field" class="a2ui-field-label">Pick from Hypothetical / Zion Field Catalog</label>
            <select id="vb-preset-field" class="a2ui-input">
              <option value="">-- Custom Column (Type Below) --</option>
              ${availableZionFields
                .map(
                  (f) =>
                    `<option value="${f.hypotheticalField}" data-label="${f.label}" data-zion="${f.zionOfficialField}" data-type="${f.dataType}">${f.label} (${f.zionOfficialField})</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="a2ui-field-group">
            <label for="vb-new-col-label" class="a2ui-field-label">Column Display Header</label>
            <input id="vb-new-col-label" type="text" class="a2ui-input" placeholder="e.g., F-1 Visa Full-Time Check" />
          </div>
          <div class="a2ui-field-group">
            <label for="vb-new-col-key" class="a2ui-field-label">JSON Field Key</label>
            <input id="vb-new-col-key" type="text" class="a2ui-input" placeholder="e.g., visa_status" />
          </div>
          <div class="a2ui-field-group">
            <label for="vb-new-col-sample" class="a2ui-field-label">Default Cell Value (For Existing Rows)</label>
            <input id="vb-new-col-sample" type="text" class="a2ui-input" placeholder="e.g., ✓ 14 Cr (F-1 Compliant)" />
          </div>
        </div>
        <button type="button" id="btn-add-col" class="btn-augie-primary">➕ Add Column & Update Live A2UI View</button>
      </div>
    `;

    // Wire title & caption live updates
    const titleInput = document.getElementById("vb-table-title");
    const capInput = document.getElementById("vb-table-caption");
    const updateMeta = () => {
      table.title = titleInput.value;
      table.a11yCaption = capInput.value;
      saveActivePayload(payload);
      renderMainSurface();
      renderJsonEditor();
    };
    titleInput?.addEventListener("change", updateMeta);
    capInput?.addEventListener("change", updateMeta);

    // Wire preset selector
    const presetSel = document.getElementById("vb-preset-field");
    presetSel?.addEventListener("change", () => {
      const opt = presetSel.options[presetSel.selectedIndex];
      if (!opt || !opt.value) return;
      document.getElementById("vb-new-col-key").value = opt.value;
      document.getElementById("vb-new-col-label").value = opt.getAttribute("data-label") || "";
      document.getElementById("vb-new-col-sample").value = "✓ Verified (Hypothetical)";
    });

    // Wire remove column buttons
    container.querySelectorAll(".btn-remove-col").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-col-idx"));
        const removed = table.columns.splice(idx, 1);
        saveActivePayload(payload);
        renderAll();
        showToast("Column Removed", `Removed column "${removed[0]?.label}" from ${p.role} DataTable.`);
      });
    });

    // Wire add column button
    document.getElementById("btn-add-col")?.addEventListener("click", () => {
      const label = document.getElementById("vb-new-col-label").value.trim() || "New Advising Field";
      const key =
        document.getElementById("vb-new-col-key").value.trim() ||
        label.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const sampleVal = document.getElementById("vb-new-col-sample").value.trim() || "✓ On Track";
      const presetOpt = presetSel?.options[presetSel.selectedIndex];
      const zionCode = presetOpt?.getAttribute("data-zion") || "PENDING_ZION_CUSTOM_FIELD";

      table.columns.push({
        key,
        label,
        zionField: zionCode,
        type: sampleVal.match(/^[✓⚠⛔🌐]/) ? "badge" : "string",
        sortable: true
      });

      const dataModel = payload?.dataModelUpdate?.contents || {};
      const rowsKey = (table.rowsPath || "").replace(/^\//, "");
      if (Array.isArray(dataModel[rowsKey])) {
        dataModel[rowsKey].forEach((r) => {
          if (r[key] === undefined) r[key] = sampleVal;
        });
      }

      saveActivePayload(payload);
      state.activeTab = "surface";
      renderAll();
      showToast("Added Column to A2UI Surface", `Added "${label}" (${zionCode}) to ${p.role}'s table.`);
    });

    // Wire reset button
    document.getElementById("btn-reset-persona-view")?.addEventListener("click", () => {
      sessionStorage.removeItem(`augie_a2ui_view_${p.id}`);
      customViews[p.id] = JSON.parse(JSON.stringify(baseViews[p.id]));
      renderAll();
      showToast("View Reset", `Restored default A2UI surface for ${p.role}.`);
    });
  }

  function renderJsonEditor() {
    const textarea = document.getElementById("a2ui-json-textarea");
    if (!textarea) return;
    const payload = getActivePayload();
    textarea.value = JSON.stringify(payload, null, 2);
  }

  function renderA11yAudit() {
    const container = document.getElementById("a11y-audit-content");
    if (!container) return;

    const p = getActivePersona();
    const q = getActiveQuestion();
    const payload = getActivePayload();
    const checks = window.AugieA2UIRenderer.auditA2UIPayload(payload);
    const transcript = window.AugieA2UIRenderer.generateScreenReaderTranscript(payload, p, q);

    container.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:0.75rem; margin-bottom:1rem;">
        <div>
          <h3 style="margin:0; color:var(--augie-navy);">♿ WCAG 2.2 AA/AAA & International Student Audit — ${p.role}</h3>
          <p style="margin:0.25rem 0 0; font-size:0.86rem; color:var(--text-muted);">
            Role-specific note: ${p.a11yConsiderations}
          </p>
        </div>
        <button type="button" id="btn-speak-transcript" class="btn-augie-primary">🔊 Speak Screen-Reader Narration Aloud</button>
      </div>

      <div class="audit-checklist">
        ${checks
          .map(
            (c) => `
          <div class="audit-item ${c.pass ? "pass" : ""}">
            <span style="font-size:1.2rem;" aria-hidden="true">${c.pass ? "✅" : "⚠️"}</span>
            <div>
              <div style="font-weight:800; color:var(--augie-navy);">${c.label}</div>
              <div style="font-size:0.84rem; color:var(--text-secondary);">${c.detail}</div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <h4 style="margin:1.35rem 0 0.5rem; color:var(--augie-navy);">🎧 Live Screen-Reader Narration Transcript (JAWS / NVDA / VoiceOver Preview)</h4>
      <pre class="sr-transcript-box" tabindex="0" aria-label="Screen Reader Narration Transcript">${transcript}</pre>
    `;

    document.getElementById("btn-speak-transcript")?.addEventListener("click", () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(transcript);
        utter.rate = 1.02;
        window.speechSynthesis.speak(utter);
        showToast("Screen-Reader Audio Preview Started", "Reading the active A2UI surface aloud via Web Speech API.");
      } else {
        showToast("Speech Synthesis Unavailable", "Review the written screen-reader transcript box below.");
      }
    });
  }

  function buildCodingAgentPrompt() {
    const p = getActivePersona();
    const q = getActiveQuestion();
    const fieldList = (zionSchema.fields || [])
      .map((f) => `- ${f.hypotheticalField} (Zion Mapping: ${f.zionOfficialField}) — ${f.label}: ${f.plainLanguageDescription}`)
      .join("\n");

    return [
      `# Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA) A2UI Design Task`,
      ``,
      `You are helping design an accessible **A2UI (Agent-to-UI)** interface for **Augustana University in Sioux Falls, South Dakota** using the **Google Agent Development Kit (ADK)**.`,
      ``,
      `## Target Persona & Question`,
      `- **Persona Role:** ${p.role}`,
      `- **Advising Scope (RBAC):** ${p.advisingScope}`,
      `- **Companion System Prompt:** "${p.systemPrompt}"`,
      `- **Target Question (Q${q?.number || 1}):** "${q?.question || ""}"`,
      ``,
      `## Mandatory Accessibility & Branding Requirements`,
      `1. **Augustana University (Sioux Falls, SD) Brand Palette:** Primary Navy \`#081E3F\` (PMS 289 C) and Primary Gold \`#FED102\` (PMS 109 C).`,
      `2. **Blind & Screen-Reader Users:** Every \`DataTable\` MUST include \`a11yCaption\`, \`a11ySummary\`, and \`rowHeaderKey\`.`,
      `3. **Visually Impaired & Color-Blind Users:** Every status badge MUST pair an icon (\`✓\`, \`⚠\`, \`⛔\`, \`🌐\`) with explicit text—never rely on color alone.`,
      `4. **Deaf & Hard-of-Hearing Users:** 100% visual/text parity (zero audio-only alerts).`,
      `5. **International Students:** Link US higher-ed jargon terms (\`SOPHIA\`, \`DFW Rate\`, \`SAP\`, \`Hold\`, \`F-1 Full-Time Load\`, \`Prerequisite Override\`, \`Residency Requirement\`) and include F-1 12-credit full-time guardrails where relevant.`,
      ``,
      `## Available Hypothetical Fields (Pre-Zion Cloud Solutions Schema)`,
      fieldList,
      ``,
      `## Output Format`,
      `Return valid A2UI JSON matching the structure in \`docs/views/default-views.js\` (\`surfaceId\`, \`beginRendering\`, \`surfaceUpdate\`, \`dataModelUpdate\`) so I can paste it directly into the Live A2UI JSON Editor or save it to \`docs/views/default-views.js\`.`
    ].join("\n");
  }

  function renderZionModal() {
    const tbody = document.getElementById("zion-mapping-tbody");
    if (!tbody) return;
    tbody.innerHTML = (zionSchema.fields || [])
      .map(
        (f, idx) => `
        <tr>
          <th scope="row" style="font-family:var(--font-mono); font-size:0.8rem;">${f.hypotheticalField}</th>
          <td>${f.label}</td>
          <td>
            <input
              type="text"
              class="a2ui-input zion-field-input"
              style="min-height:38px; padding:0.3rem 0.6rem; font-family:var(--font-mono); font-size:0.8rem;"
              data-field-idx="${idx}"
              value="${f.zionOfficialField}"
              aria-label="Official Zion Cloud Solutions field name for ${f.label}"
            />
          </td>
          <td style="font-size:0.82rem;">${f.plainLanguageDescription}</td>
        </tr>
      `
      )
      .join("");
  }

  function renderAll() {
    renderPersonaPills();
    renderSidebar();
    renderWorkspaceTabs();
    renderMainSurface();
    renderVisualBuilder();
    renderJsonEditor();
    renderA11yAudit();
  }

  function initEvents() {
    // Workspace Tab buttons
    document.querySelectorAll(".ws-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeTab = btn.getAttribute("data-ws-tab");
        renderWorkspaceTabs();
      });
    });

    // Apply JSON Editor button
    document.getElementById("btn-apply-json")?.addEventListener("click", () => {
      const textarea = document.getElementById("a2ui-json-textarea");
      try {
        const parsed = JSON.parse(textarea.value);
        saveActivePayload(parsed);
        state.activeTab = "surface";
        renderAll();
        showToast("A2UI JSON Stream Applied", "Rendered updated A2UI payload on the live persona surface.");
      } catch (err) {
        showToast("Invalid JSON Syntax", err.message);
      }
    });

    // Download JSON button
    document.getElementById("btn-download-json")?.addEventListener("click", () => {
      const p = getActivePersona();
      const blob = new Blob([JSON.stringify(getActivePayload(), null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `augie-aaa-a2ui-${p.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Copy Coding Agent Prompt button
    document.getElementById("btn-copy-agent-prompt")?.addEventListener("click", () => {
      const promptText = buildCodingAgentPrompt();
      navigator.clipboard?.writeText(promptText);
      const p = getActivePersona();
      const q = getActiveQuestion();
      showToast(
        "Copied Coding-Agent Prompt!",
        `Ready to paste into Gemini CLI, Antigravity, Workspace Gemini, Claude, or Cursor for ${p.role} (Q${q?.number || 1}).`
      );
    });

    // Accessibility Toolbar Toggles
    const hcBtn = document.getElementById("btn-toggle-hc");
    hcBtn?.addEventListener("click", () => {
      state.highContrast = !state.highContrast;
      document.body.classList.toggle("a11y-high-contrast", state.highContrast);
      hcBtn.setAttribute("aria-pressed", state.highContrast ? "true" : "false");
      announcePolite(`High contrast AAA mode ${state.highContrast ? "enabled" : "disabled"}.`);
    });

    const scaleSel = document.getElementById("sel-text-scale");
    scaleSel?.addEventListener("change", () => {
      state.textScale = scaleSel.value;
      document.documentElement.classList.remove("a11y-scale-125", "a11y-scale-150");
      if (state.textScale === "125") document.documentElement.classList.add("a11y-scale-125");
      if (state.textScale === "150") document.documentElement.classList.add("a11y-scale-150");
      announcePolite(`Text and target scale set to ${state.textScale} percent.`);
    });

    const spacingBtn = document.getElementById("btn-toggle-spacing");
    spacingBtn?.addEventListener("click", () => {
      state.wideSpacing = !state.wideSpacing;
      document.body.classList.toggle("a11y-wide-spacing", state.wideSpacing);
      spacingBtn.setAttribute("aria-pressed", state.wideSpacing ? "true" : "false");
      announcePolite(`Low-vision and dyslexia reading spacing ${state.wideSpacing ? "enabled" : "disabled"}.`);
    });

    const glossaryBtn = document.getElementById("btn-toggle-glossary");
    glossaryBtn?.addEventListener("click", () => {
      state.showGlossary = !state.showGlossary;
      glossaryBtn.setAttribute("aria-pressed", state.showGlossary ? "true" : "false");
      renderMainSurface();
      announcePolite(`Plain-language international student glossary ${state.showGlossary ? "expanded" : "compact"}.`);
    });

    const langSel = document.getElementById("sel-intl-lang");
    langSel?.addEventListener("change", () => {
      state.lang = langSel.value;
      if (state.lang !== "en") state.showGlossary = true;
      document.getElementById("btn-toggle-glossary")?.setAttribute("aria-pressed", state.showGlossary ? "true" : "false");
      renderMainSurface();
      announcePolite(`Switched international glossary language to ${langSel.options[langSel.selectedIndex].text}.`);
    });

    // Zion Field Mapper Modal
    const zionModal = document.getElementById("zion-schema-modal");
    document.getElementById("btn-open-zion-modal")?.addEventListener("click", () => {
      renderZionModal();
      if (zionModal) zionModal.hidden = false;
    });
    document.getElementById("btn-close-zion-modal")?.addEventListener("click", () => {
      if (zionModal) zionModal.hidden = true;
    });
    document.getElementById("btn-save-zion-mappings")?.addEventListener("click", () => {
      document.querySelectorAll(".zion-field-input").forEach((inp) => {
        const idx = Number(inp.getAttribute("data-field-idx"));
        if (zionSchema.fields[idx]) {
          zionSchema.fields[idx].zionOfficialField = inp.value.trim();
        }
      });
      if (zionModal) zionModal.hidden = true;
      renderAll();
      showToast("Zion Cloud Solutions Mappings Updated!", "Updated field mappings across the workbench.");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    renderAll();
  });
})();
