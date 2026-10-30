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
    if (saved && p.id !== "student") {
      try {
        customViews[p.id] = JSON.parse(saved);
        return;
      } catch (e) {
        // fallback to default
      }
    }
    customViews[p.id] = JSON.parse(JSON.stringify(baseViews[p.id] || {}));
  });
  // Clear any stale cached student_q1 view so the latest Q1 Both/And + Calendar build always renders fresh
  try {
    sessionStorage.removeItem("augie_a2ui_view_student");
    sessionStorage.removeItem("augie_a2ui_view_student_q1");
  } catch (e) {}

  const PERSONA_RECOMMENDED_LAYOUT = {
    admin: "inverted-pyramid",
    provost: "inverted-pyramid",
    registrar: "table-first",
    student_success: "table-first",
    deans: "split-dashboard",
    area_chair: "split-dashboard",
    program_director: "split-dashboard",
    department_chair: "table-first",
    advisor: "split-dashboard",
    student: "inverted-pyramid"
  };

  const state = {
    activePersonaId: personas[0]?.id || "admin",
    activeQuestionIdx: 0,
    activeTab: "surface", // 'surface' | 'visual-builder' | 'json-editor' | 'a11y-audit' | 'hackathon-guide'
    layoutMode: PERSONA_RECOMMENDED_LAYOUT[personas[0]?.id || "admin"] || "inverted-pyramid",
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

  function getActiveViewKey() {
    const q = getActiveQuestion();
    return `${state.activePersonaId}_q${q?.number || 1}`;
  }

  function getActivePayload() {
    const key = getActiveViewKey();
    if (customViews[key]) {
      return customViews[key];
    }
    const p = getActivePersona();
    const q = getActiveQuestion();
    const base = customViews[state.activePersonaId] || baseViews[state.activePersonaId] || {};
    if (window.AUGIE_QUESTION_VIEW_ADAPTER) {
      const adapted = window.AUGIE_QUESTION_VIEW_ADAPTER.adaptPayloadForQuestion(base, p, q);
      customViews[key] = adapted.payload;
      return customViews[key];
    }
    return base;
  }

  function saveActivePayload(newPayload) {
    const key = getActiveViewKey();
    customViews[key] = newPayload;
    customViews[state.activePersonaId] = newPayload;
    try {
      sessionStorage.setItem(`augie_a2ui_view_${key}`, JSON.stringify(newPayload));
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
      <div style="font-weight:800; margin-bottom:0.25rem; color:var(--augie-gold);">${title}</div>
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
        state.layoutMode = PERSONA_RECOMMENDED_LAYOUT[pid] || "inverted-pyramid";
        const layoutSel = document.getElementById("sel-layout-mode");
        if (layoutSel) layoutSel.value = state.layoutMode;
        const p = getActivePersona();
        announcePolite(
          `Switched persona to ${p.role}. Advising scope: ${p.advisingScope}. Auto-selected AI best-practice layout: ${state.layoutMode}.`
        );
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

    if (titleEl) titleEl.innerHTML = `<span>${p.role}</span>`;
    if (scopeEl) scopeEl.textContent = `Advising Scope: ${p.advisingScope}`;
    if (unitEl) unitEl.innerHTML = `${p.defaultUnit}<br>Google Group: ${p.googleGroupId}`;
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
          const p = getActivePersona();
          const q = getActiveQuestion();
          if (window.AUGIE_QUESTION_VIEW_ADAPTER && q) {
            const bp = window.AUGIE_QUESTION_VIEW_ADAPTER.inferQuestionBlueprint(p, q);
            if (bp && bp.layout) {
              state.layoutMode = bp.layout;
              const layoutSel = document.getElementById("sel-layout-mode");
              if (layoutSel) layoutSel.value = state.layoutMode;
            }
          }
          announcePolite(
            `Selected Question ${q.number}: ${q.question}. Auto-configured AI best-practice layout (${state.layoutMode}) and question-specific table view.`
          );
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
      layoutMode: state.layoutMode,
      sortState: state.sortState,
      onSortChange: (tableId, colKey) => {
        const prev = state.sortState[tableId];
        const nextDir = prev && prev.key === colKey && prev.dir === "asc" ? "desc" : "asc";
        state.sortState[tableId] = { key: colKey, dir: nextDir };
        announcePolite(`Sorted table by ${colKey} ${nextDir === "asc" ? "ascending" : "descending"}.`);
        renderMainSurface();
      },
      onAction: (evt) => {
        if (evt.type === "prioritySliceChange") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          dataModel.activePriorityMode = evt.modeId;
          const slots = Array.isArray(dataModel.contestableSlots) ? dataModel.contestableSlots : [];
          const slot1300 = slots.find((s) => s.slotId === "13:00");
          const slot0930 = slots.find((s) => s.slotId === "09:30");

          if (evt.modeId === "heavy_major_minor") {
            if (slot1300) slot1300.selectedValue = "DATA 340";
            if (slot0930) slot0930.selectedValue = "MATH 310";
            dataModel.scheduleSummary = {
              sliceLabel: "Option 2: Heavy Major & Minor Push + Parallel SOPHIA",
              totalCredits: "15 Credits (4 Courses)",
              f1Status: "15 Credits (Meets 12-Credit Full-Time Minimum)"
            };
            dataModel.calendarEvents = [
              {
                slotId: "09:30",
                days: "TR",
                course: "MATH 310",
                title: "Linear Algebra",
                bucket: "Major Core"
              },
              {
                slotId: "10:00",
                days: "MWF",
                course: "COSC 450",
                title: "Data Science Senior Capstone",
                bucket: "Major Core"
              },
              {
                slotId: "13:00",
                days: "MWF",
                course: "DATA 340",
                title: "Applied Machine Learning",
                bucket: "Major Core"
              },
              {
                slotId: "13:30",
                days: "TR",
                course: "RELI 218",
                title: "Global Christianities",
                bucket: "SOPHIA"
              }
            ];
          } else if (evt.modeId === "sophia_electives_mix") {
            if (slot1300) slot1300.selectedValue = "ART 140";
            if (slot0930) slot0930.selectedValue = "COSC 315";
            dataModel.scheduleSummary = {
              sliceLabel: "Option 3: Finish Remaining SOPHIA + Studio & Career Electives",
              totalCredits: "14 Credits (4 Courses)",
              f1Status: "14 Credits (Meets 12-Credit Full-Time Minimum)"
            };
            dataModel.calendarEvents = [
              {
                slotId: "09:30",
                days: "TR",
                course: "COSC 315",
                title: "Accessible Human-Computer Interaction",
                bucket: "Elective"
              },
              {
                slotId: "10:00",
                days: "MWF",
                course: "COSC 450",
                title: "Data Science Senior Capstone",
                bucket: "Major Core"
              },
              {
                slotId: "13:00",
                days: "MWF",
                course: "ART 140",
                title: "Studio Ceramics",
                bucket: "Elective"
              },
              {
                slotId: "13:30",
                days: "TR",
                course: "RELI 218",
                title: "Global Christianities",
                bucket: "SOPHIA"
              }
            ];
          } else {
            if (slot1300) slot1300.selectedValue = "DATA 340";
            if (slot0930) slot0930.selectedValue = "COSC 315";
            dataModel.scheduleSummary = {
              sliceLabel: "Option 1: Balanced Major/Core + Parallel SOPHIA + Elective",
              totalCredits: "14 Credits (4 Courses)",
              f1Status: "14 Credits (Meets 12-Credit Full-Time Minimum)"
            };
            dataModel.calendarEvents = [
              {
                slotId: "09:30",
                days: "TR",
                course: "COSC 315",
                title: "Accessible Human-Computer Interaction",
                bucket: "Elective"
              },
              {
                slotId: "10:00",
                days: "MWF",
                course: "COSC 450",
                title: "Data Science Senior Capstone",
                bucket: "Major Core"
              },
              {
                slotId: "13:00",
                days: "MWF",
                course: "DATA 340",
                title: "Applied Machine Learning",
                bucket: "Major Core"
              },
              {
                slotId: "13:30",
                days: "TR",
                course: "RELI 218",
                title: "Global Christianities",
                bucket: "SOPHIA"
              }
            ];
          }

          saveActivePayload(payload);
          renderMainSurface();
          renderJsonEditor();
          showToast(
            `Updated Semester Mix`,
            `Step 1 Pillars, Step 2 Dropdowns, and Step 3 Calendar updated.`
          );
          return;
        }

        if (evt.type === "slotDropdownChange") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          const slots = Array.isArray(dataModel.contestableSlots) ? dataModel.contestableSlots : [];
          const targetSlot = slots.find((s) => s.slotId === evt.slotId);
          if (targetSlot) {
            targetSlot.selectedValue = evt.chosenCourse;
            const chosenOpt = (targetSlot.options || []).find((o) => o.value === evt.chosenCourse);
            const events = Array.isArray(dataModel.calendarEvents) ? dataModel.calendarEvents : [];
            const calEv = events.find((e) => e.slotId === evt.slotId);
            if (calEv && chosenOpt) {
              calEv.course = chosenOpt.course;
              calEv.title = chosenOpt.title;
              calEv.bucket = chosenOpt.bucket;
            }
          }
          saveActivePayload(payload);
          renderMainSurface();
          renderJsonEditor();
          showToast(
            `Updated Time Slot (${evt.chosenCourse})`,
            `Updated downstream trade-off and Step 3 Monday–Friday Calendar.`
          );
          return;
        }

        if (evt.type === "inspectCourse") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          const detailsMap = dataModel.courseCatalogDetails || {};
          const info = detailsMap[evt.courseCode];
          const drawer = document.getElementById("course-detail-drawer");
          const titleEl = document.getElementById("course-drawer-title");
          const bodyEl = document.getElementById("course-drawer-body");
          if (drawer && titleEl && bodyEl && info) {
            titleEl.textContent = `${info.code} — ${info.title}`;
            bodyEl.innerHTML = `
              <div class="course-drawer-meta-grid">
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Curriculum Pillar</span>
                  <strong>${info.pillar}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Credits</span>
                  <strong>${info.credits}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Instructor</span>
                  <strong>${info.instructor}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Meeting Time & Room</span>
                  <strong>${info.schedule}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Live J1 Seat Availability</span>
                  <strong>${info.seats}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Prerequisites</span>
                  <strong>${info.prerequisites}</strong>
                </div>
              </div>

              <div class="course-drawer-section">
                <h4>Course Catalog Description</h4>
                <p>${info.description}</p>
              </div>

              <div class="course-drawer-section">
                <h4>Spring 2027 Syllabus Outline</h4>
                <ul class="course-drawer-syllabus-list">
                  ${(info.syllabusOutline || []).map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </div>

              <div class="course-drawer-actions">
                <a href="${info.syllabusUrl}" target="_blank" rel="noopener" class="btn-augie-primary" id="btn-open-syllabus-doc">
                  Open / Download ${info.code} Syllabus (PDF Preview)
                </a>
              </div>
            `;
            drawer.hidden = false;
            const openBtn = document.getElementById("btn-open-syllabus-doc");
            openBtn?.addEventListener("click", (e) => {
              e.preventDefault();
              const syllabusHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${info.code} — ${info.title} Syllabus (Spring 2027)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #081E3F; max-width: 760px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.6; }
    header { border-bottom: 4px solid #FED102; background: #081E3F; color: #fff; padding: 1.25rem 1.5rem; border-radius: 8px; }
    h1 { margin: 0 0 0.35rem; font-size: 1.35rem; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; background: #f8fafc; border: 1px solid #cbd5e1; padding: 1rem; border-radius: 8px; margin: 1.25rem 0; font-size: 0.92rem; }
    h2 { color: #081E3F; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3rem; margin-top: 1.5rem; font-size: 1.1rem; }
  </style>
</head>
<body>
  <header>
    <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.06em; color:#FED102; font-weight:700;">Augustana University — Sioux Falls, SD</div>
    <h1>${info.code}: ${info.title} (${info.credits})</h1>
    <div>Spring 2027 Official Course Syllabus</div>
  </header>
  <div class="meta">
    <div><strong>Instructor:</strong> ${info.instructor}</div>
    <div><strong>Meeting Time & Location:</strong> ${info.schedule}</div>
    <div><strong>Curriculum Requirement:</strong> ${info.pillar}</div>
    <div><strong>Prerequisites:</strong> ${info.prerequisites}</div>
  </div>
  <h2>Course Description</h2>
  <p>${info.description}</p>
  <h2>Spring 2027 Weekly Module Outline</h2>
  <ul>
    ${(info.syllabusOutline || []).map((item) => `<li>${item}</li>`).join("")}
  </ul>
</body>
</html>`;
              const blob = new Blob([syllabusHtml], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              window.open(url, "_blank");
            });
            announcePolite(`Opened course detail side panel for ${info.code}: ${info.title}.`);
          } else {
            showToast(`Course Details: ${evt.courseCode}`, `No extended catalog record found for ${evt.courseCode}.`);
          }
          return;
        }

        if (evt.type === "exportSchedule") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          const summary = dataModel.scheduleSummary || {};
          const events = Array.isArray(dataModel.calendarEvents) ? dataModel.calendarEvents : [];
          const slots = Array.isArray(dataModel.contestableSlots) ? dataModel.contestableSlots : [];
          const detailsMap = dataModel.courseCatalogDetails || {};

          if (evt.exportAction === "download_plan") {
            const planHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Spring 2027 Advising & Registration Plan — Amina Tesfaye</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #081E3F; max-width: 820px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.55; }
    .banner { background: #081E3F; color: #ffffff; border-bottom: 5px solid #FED102; padding: 1.25rem 1.5rem; border-radius: 8px; }
    .banner h1 { margin: 0.2rem 0; font-size: 1.4rem; }
    .meta-bar { display: flex; flex-wrap: wrap; gap: 1.25rem; background: #f8fafc; border: 1px solid #cbd5e1; padding: 0.9rem 1.2rem; border-radius: 8px; margin: 1.2rem 0; font-size: 0.92rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0 1.5rem; }
    th, td { border: 1px solid #cbd5e1; padding: 0.65rem 0.8rem; text-align: left; font-size: 0.9rem; }
    th { background: #081E3F; color: #ffffff; }
    .sig-box { margin-top: 2rem; padding: 1rem 1.2rem; border: 1.5px dashed #081E3F; border-radius: 8px; background: #fffbeb; }
  </style>
</head>
<body>
  <div class="banner">
    <div style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.06em; color:#FED102; font-weight:700;">Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA)</div>
    <h1>Spring 2027 Registration Plan — Amina Tesfaye</h1>
    <div>Prepared for Faculty Advising Session & Registration Approval with Dr. Matthewulat</div>
  </div>
  <div class="meta-bar">
    <div><strong>Chosen Mix:</strong> ${summary.sliceLabel || "Option 1: Balanced Major/Core + Parallel SOPHIA + Elective"}</div>
    <div><strong>Total Load:</strong> ${summary.totalCredits || "14 Credits (4 Courses)"}</div>
    <div><strong>F-1 Status:</strong> ${summary.f1Status || "Meets 12-Credit Full-Time Minimum"}</div>
  </div>
  <h2>Proposed Monday–Friday Course Schedule</h2>
  <table>
    <thead>
      <tr>
        <th>Course Code</th>
        <th>Course Name</th>
        <th>Days & Time</th>
        <th>Curriculum Pillar</th>
        <th>Instructor</th>
      </tr>
    </thead>
    <tbody>
      ${events
        .map((e) => {
          const d = detailsMap[e.course] || {};
          return `<tr>
            <td><strong>${e.course}</strong></td>
            <td>${e.title}</td>
            <td>${d.schedule || `${e.days} ${e.slotId}`}</td>
            <td>${d.pillar || e.bucket}</td>
            <td>${d.instructor || "Staff"}</td>
          </tr>`;
        })
        .join("")}
    </tbody>
  </table>
  <h2>Time-Slot Conflict Resolutions & Downstream Notes</h2>
  <ul>
    ${slots
      .map((s) => {
        const chosen = (s.options || []).find((o) => o.value === s.selectedValue) || (s.options || [])[0];
        return `<li><strong>${s.timeLabel}:</strong> Selected <strong>${chosen ? `${chosen.course} (${chosen.title})` : s.selectedValue}</strong> — ${chosen ? chosen.impact : ""}</li>`;
      })
      .join("")}
  </ul>
  <div class="sig-box">
    <strong>Faculty Advisor Registration Clearance (Dr. Matthewulat):</strong>
    <p style="margin:0.4rem 0 0;">Advisor Signature / Approval Stamp: _____________________________________ &nbsp;&nbsp; Date: _______________</p>
  </div>
</body>
</html>`;
            const blob = new Blob([planHtml], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Augustana_Spring_2027_Advising_Plan_Amina_Tesfaye.html";
            a.click();
            URL.revokeObjectURL(url);
            showToast(
              "Advising Plan Soft Copy Exported",
              "Downloaded Augustana_Spring_2027_Advising_Plan_Amina_Tesfaye.html for your advising session."
            );
          } else if (evt.exportAction === "email_advisor") {
            const courseLines = events
              .map((e) => {
                const d = detailsMap[e.course] || {};
                return `- ${e.course}: ${e.title} (${d.schedule || `${e.days} ${e.slotId}`})`;
              })
              .join("\n");
            const subject = encodeURIComponent("Spring 2027 Registration Plan Approval Request — Amina Tesfaye");
            const body = encodeURIComponent(
              `Dear Dr. Matthewulat,\n\nI have reviewed my Spring 2027 degree progress, SOPHIA requirements, and time-slot trade-offs in the Augustana Academic Advising Agent. Here is my proposed Spring 2027 schedule for your registration approval:\n\nSelected Mix: ${summary.sliceLabel || "Option 1"}\nTotal Load: ${summary.totalCredits || "14 Credits"}\n\nProposed Courses:\n${courseLines}\n\nPlease let me know if you approve this plan for registration or if we should adjust any sections during our advising session.\n\nThank you,\nAmina Tesfaye`
            );
            window.location.href = `mailto:m.matthewulat@augie.edu?subject=${subject}&body=${body}`;
            showToast(
              "Email Draft Prepared for Dr. Matthewulat",
              "Opened email client with your Spring 2027 schedule requesting registration approval."
            );
          }
          return;
        }

        if (evt.type === "rowAction") {
          // Live in-place A2UI dataModelUpdate simulation when a row action is clicked
          const table = getPrimaryDataTableComponent(payload);
          if (table) {
            const dataModel = payload?.dataModelUpdate?.contents || {};
            const rowsKey = (table.rowsPath || "").replace(/^\//, "");
            const rows = Array.isArray(dataModel[rowsKey]) ? dataModel[rowsKey] : [];
            const targetRow = rows.find((r) => String(r[table.rowHeaderKey]) === String(evt.target));
            const badgeCol = table.columns.find((c) => c.type === "badge");
            if (targetRow && badgeCol) {
              targetRow[badgeCol.key] = `✓ ADK Action Applied (${evt.actionId})`;
              saveActivePayload(payload);
              renderMainSurface();
              renderJsonEditor();
            }
          }
          showToast(
            `A2UI actionResponse Dispatched & Applied Live`,
            `Persona "${p.role}" executed "${evt.actionId}" on "${evt.target}" (Q${q?.number || 1}) — updated table status badge in-place.`
          );
        } else if (evt.type === "formSubmit") {
          const alertComp = (payload?.surfaceUpdate?.components || []).find(
            (c) => c.component && c.component.AlertBanner
          );
          if (alertComp) {
            alertComp.component.AlertBanner.severity = "info";
            alertComp.component.AlertBanner.icon = "✓";
            alertComp.component.AlertBanner.title = `✓ ADK Agent Executed Action: ${evt.actionName}`;
            alertComp.component.AlertBanner.message = `Dispatched parameters ${JSON.stringify(evt.context)} for ${p.role} (Q${q?.number || 1}). Surface updated via A2UI dataModelUpdate.`;
            saveActivePayload(payload);
            renderMainSurface();
            renderJsonEditor();
          }
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
      for (let i = 1; i <= 10; i++) {
        delete customViews[`${p.id}_q${i}`];
        sessionStorage.removeItem(`augie_a2ui_view_${p.id}_q${i}`);
      }
      customViews[p.id] = JSON.parse(JSON.stringify(baseViews[p.id]));
      renderAll();
      showToast("View Reset", `Restored AI Best-Practice A2UI surface for ${p.role} (Q1–Q10).`);
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
      `1. **Augustana University (Sioux Falls, SD) Brand Palette:** Primary Blue/Navy \`#081E3F\` (PMS 282, RGB 9/31/64) and Primary Yellow/Gold \`#FED102\` (PMS 109, RGB 255/209/0).`,
      `2. **Blind & Screen-Reader Users:** Every \`DataTable\` (\`MaterialTable\`) MUST include \`a11yCaption\`, \`a11ySummary\`, and \`rowHeaderKey\`.`,
      `3. **Visually Impaired & Color-Blind Users:** Every status badge MUST pair an icon (\`✓\`, \`⚠\`, \`⛔\`, \`🌐\`) with explicit text—never rely on color alone.`,
      `4. **Deaf & Hard-of-Hearing Users:** 100% visual/text parity (zero audio-only alerts).`,
      `5. **International Students:** Link US higher-ed jargon terms (\`SOPHIA\`, \`DFW Rate\`, \`SAP\`, \`Hold\`, \`F-1 Full-Time Load\`, \`Prerequisite Override\`, \`Residency Requirement\`) and include F-1 12-credit full-time guardrails where relevant.`,
      ``,
      `## Gemini Enterprise A2UI v0.9 Technical Requirements (From Zion Cloud Solutions)`,
      `- **Version:** Strictly \`"version": "v0.9"\` on every message (\`v0.9.1\` is not supported in Gemini Enterprise).`,
      `- **Catalog ID:** \`https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json\` (69 built-in components across Basic, Material layout/display/actions/input, and Gemini Enterprise extras \`Canvas\`, \`IFrameSrcdoc\`, \`IFrameUrl\`).`,
      `- **A2A Extension & Hosting:** Declare \`https://a2ui.org/a2a-extension/a2ui/v0.9\` on an **A2A v0.3** agent hosted on **Google Cloud Run** (Vertex AI Agent Engine is not supported for A2UI).`,
      `- **Security & Files:** Call **Model Armor** directly and re-validate \`action\` payloads server-side; deliver downloadable files (PDF degree audits, CSV exports) as **A2A file parts** rather than \`save_artifact\`.`,
      ``,
      `## Official Zion Cloud Solutions Jenzabar J1 (J1PRD) Connector API v1.0 Fields`,
      `- **Base URL:** \`https://connector-api-385429559879.us-central1.run.app\` (26 read-only \`GET\` endpoints over Jenzabar J1 \`J1PRD\`; never writes directly to J1)`,
      `- **Auth & RBAC Headers:** \`Authorization: Bearer <OIDC>\` + \`X-User-Id: <J1 ID_NUM>\` + \`X-User-Role: student | advisor | advising_admin\``,
      fieldList,
      ``,
      `## Output Format`,
      `Return valid A2UI v0.9 JSON matching the structure in \`docs/views/default-views.js\` (\`version: "v0.9"\`, \`surfaceId\`, \`createSurface\`, \`beginRendering\`, \`surfaceUpdate\`, \`dataModelUpdate\`) so I can paste it directly into the Live A2UI JSON Editor or save it to \`docs/views/default-views.js\`.`
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
          <td>
            <div style="font-weight:700;">${f.label}</div>
            <div style="font-family:var(--font-mono); font-size:0.74rem; color:var(--text-muted);">${f.zionTable || ""}</div>
          </td>
          <td>
            <input
              type="text"
              class="a2ui-input zion-field-input"
              style="min-height:38px; padding:0.3rem 0.6rem; font-family:var(--font-mono); font-size:0.8rem;"
              data-field-idx="${idx}"
              value="${f.zionOfficialField}"
              aria-label="Official Zion Cloud Solutions J1 field path for ${f.label}"
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

    // A2UI Surface Layout Switcher
    const layoutSel = document.getElementById("sel-layout-mode");
    layoutSel?.addEventListener("change", () => {
      state.layoutMode = layoutSel.value;
      state.activeTab = "surface";
      renderWorkspaceTabs();
      renderMainSurface();
      const labelText = layoutSel.options[layoutSel.selectedIndex]?.text || state.layoutMode;
      showToast("A2UI Surface Layout Updated", `Switched active surface layout to: ${labelText}`);
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

    // Course Detail & Syllabus Drawer (Canvas Side Panel)
    const courseDrawer = document.getElementById("course-detail-drawer");
    document.getElementById("btn-close-course-drawer")?.addEventListener("click", () => {
      if (courseDrawer) courseDrawer.hidden = true;
    });
    document.getElementById("course-drawer-backdrop")?.addEventListener("click", () => {
      if (courseDrawer) courseDrawer.hidden = true;
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && courseDrawer && !courseDrawer.hidden) {
        courseDrawer.hidden = true;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    renderAll();
  });
})();
